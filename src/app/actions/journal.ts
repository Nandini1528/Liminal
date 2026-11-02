"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";
import { getDateInTimezone, dateStringToUtc, getPreviousDate } from "@/lib/date";
import { awardRandomSticker, type AwardedSticker } from "@/lib/stickers";
import {
  generateReflection,
  FALLBACK_REFLECTION,
  type Reflection,
} from "@/lib/ai/reflection";

type JournalActionState = {
  error?: string;
  success?: boolean;
  entryId?: string;
  currentStreak?: number;
  longestStreak?: number;
  reflection?: Reflection;
  sticker?: AwardedSticker | null;
  collectionComplete?: boolean;
};

const userSelect = {
  id: true,
  timezone: true,
  currentStreak: true,
  longestStreak: true,
} as const;

export async function saveJournalEntry(
  _prevState: JournalActionState,
  formData: FormData
): Promise<JournalActionState> {
  const journalText = formData.get("journalText");
  const promptId = formData.get("promptId");

  if (typeof journalText !== "string" || !journalText.trim()) {
    return { error: "Write a little something before saving your moment." };
  }
  if (journalText.trim().length > 10000) {
    return { error: "Your entry is too long. Please keep it under 10,000 characters." };
  }
  if (typeof promptId !== "string" || !promptId) {
    return { error: "Today's prompt is missing. Please refresh and try again." };
  }

  const supabase = await createClient();
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser || !authUser.email) {
    console.error("Journal authentication error:", authError?.message);
    return { error: "Your login session wasn't found. Please log in again." };
  }

  try {
    let user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: userSelect,
    });
    if (!user) {
      await syncUser(authUser);
      user = await prisma.user.findUniqueOrThrow({
        where: { id: authUser.id },
        select: userSelect,
      });
    }

    const today = getDateInTimezone(user.timezone);
    const todayDate = dateStringToUtc(today);
    const yesterday = getPreviousDate(today);

    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
      select: { id: true, text: true },
    });
    if (!prompt) {
      return { error: "Today's prompt could not be found. Please refresh and try again." };
    }

    const cleanText = journalText.trim();

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.entry.findUnique({
        where: { userId_entryDate: { userId: user.id, entryDate: todayDate } },
        select: { id: true },
      });
      if (existing) {
        return { error: "You've already marked this moment today. Come back tomorrow." };
      }

      const latest = await tx.entry.findFirst({
        where: { userId: user.id },
        orderBy: { entryDate: "desc" },
        select: { entryDate: true },
      });
      const latestDate = latest ? latest.entryDate.toISOString().slice(0, 10) : null;
      const nextStreak = latestDate === yesterday ? user.currentStreak + 1 : 1;
      const longestStreak = Math.max(user.longestStreak, nextStreak);

      const entry = await tx.entry.create({
        data: {
          journalText: cleanText,
          entryDate: todayDate,
          userId: user.id,
          promptId: prompt.id,
        },
        select: { id: true },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { currentStreak: nextStreak, longestStreak },
      });

      const { sticker, collectionComplete } = await awardRandomSticker(
        tx,
        user.id,
        entry.id
      );

      return {
        success: true,
        entryId: entry.id,
        currentStreak: nextStreak,
        longestStreak,
        sticker,
        collectionComplete,
      };
    });

    if (!result.success) return result;

    // The entry and sticker are safely saved. Now the AI reflection (never blocks saving).
    let reflection = await generateReflection(cleanText, prompt.text);
    if (reflection) {
      try {
        await prisma.entry.update({
          where: { id: result.entryId },
          data: { reflection },
        });
      } catch (e) {
        console.error("Failed to store reflection:", e);
      }
    } else {
      reflection = FALLBACK_REFLECTION;
    }

    return { ...result, reflection };
  } catch (error) {
    if ((error as { code?: string })?.code === "P2002") {
      return { error: "You've already marked this moment today. Come back tomorrow." };
    }
    console.error("Failed to save journal entry:", error);
    return { error: "We couldn't save your moment. Please try again." };
  }
}