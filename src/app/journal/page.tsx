import { redirect } from "next/navigation";
import Image from "next/image";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getTodaysPrompt } from "@/lib/getTodaysPrompt";
import {
  getDateInTimezone,
  dateStringToUtc,
  formatLongDate,
} from "@/lib/date";
import AppHeader from "@/components/AppHeader";
import JournalEntryForm from "./JournalEntryForm";

import pin2 from "@/components/pin2.png";
import clipper from "@/components/clipper.png";
import newspaper from "@/components/newspaper.png";
import stamp from "@/components/stamp.png";

function parseReflection(
  value: unknown
): { quote: string; activities: string[] } | null {
  if (!value || typeof value !== "object") return null;
  const v = value as { quote?: unknown; activities?: unknown };
  if (typeof v.quote !== "string") return null;
  const activities = Array.isArray(v.activities)
    ? v.activities.filter((a): a is string => typeof a === "string")
    : [];
  return { quote: v.quote, activities };
}

export default async function JournalPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { timezone: true, currentStreak: true },
  });

  const today = getDateInTimezone(dbUser?.timezone ?? "Asia/Kolkata");
  const prompt = await getTodaysPrompt(today);
  const formattedDate = formatLongDate(today);

  const todayEntry = await prisma.entry.findUnique({
    where: {
      userId_entryDate: {
        userId: authUser.id,
        entryDate: dateStringToUtc(today),
      },
    },
    select: { journalText: true, reflection: true },
  });

  const reflection = parseReflection(todayEntry?.reflection);
  const streak = dbUser?.currentStreak ?? 0;

  return (
    // overflow-x-clip stops the decorative pieces from causing sideways scrolling
    // radial gradient = lighter centre, darker edges, so the paper feels lit
    <div className="flex flex-1 flex-col overflow-x-clip bg-[#5D0703] bg-[radial-gradient(ellipse_at_center,#7A0F09_0%,#5D0703_55%,#360301_100%)]">
      <AppHeader current="journal" theme="dark" />

      {/* pb-28 (was pb-10): leaves room for the stamp + newspaper that hang below the paper,
          so they never poke out past the red background into the white page edge */}
      <main className="flex-1 px-4 pb-28 pt-16 sm:px-8">
        <div className="fade-up relative mx-auto max-w-[900px]">
          {/* Stacked sheets behind the main paper (desktop only) */}
          <div className="pointer-events-none absolute inset-0 z-0 hidden rotate-[-2deg] border border-[#D6CEC7] bg-[#EFE8DE] shadow-[0_10px_30px_rgba(0,0,0,0.45)] md:block" />
          <div className="pointer-events-none absolute inset-0 z-0 hidden rotate-[1.5deg] border border-[#D6CEC7] bg-[#F6F0E7] shadow-[0_10px_30px_rgba(0,0,0,0.45)] md:block" />

          {/* Journal Paper */}
          <div className="relative z-10 border border-[#D6CEC7] bg-[#FFFFFB] px-6 py-8 shadow-[0_2px_4px_rgba(0,0,0,0.25),0_12px_24px_rgba(0,0,0,0.3),0_35px_70px_-10px_rgba(0,0,0,0.6)] sm:px-12 sm:py-10">
            <Image
              src={clipper}
              alt=""
              className="pointer-events-none absolute left-1/2 top-[-48px] z-20 w-20 -translate-x-1/2 select-none drop-shadow-[0_6px_6px_rgba(0,0,0,0.4)] sm:top-[-75px] sm:w-32"
            />

            {/* Ribbon */}
            <Image
              src={pin2}
              alt=""
              className="pointer-events-none absolute left-[-14px] top-[-34px] w-24 rotate-[-3deg] select-none drop-shadow-[0_6px_6px_rgba(0,0,0,0.35)] sm:left-[-70px] sm:top-[-70px] sm:w-44"
            />

            <Image
              src={newspaper}
              alt=""
              className="pointer-events-none absolute bottom-[-40px] right-[-52px] z-10 hidden w-56 rotate-[1deg] select-none drop-shadow-[0_8px_10px_rgba(0,0,0,0.45)] md:block"
            />

            <Image
              src={stamp}
              alt=""
              className="pointer-events-none absolute bottom-[-60px] right-[-60px] z-[22] hidden w-22 rotate-[12deg] select-none drop-shadow-[0_6px_8px_rgba(0,0,0,0.5)] md:block"
            />

            {/* Prompt and date */}
            <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:pt-0">
              <h1 className="text-[20px] leading-relaxed text-[#2A2B2B] md:text-[24px]">
                {prompt.text}
              </h1>

              <p className="whitespace-nowrap text-lg text-[#2A2B2B]/70 sm:ml-8 sm:pt-1 sm:text-xl">
                {formattedDate}
              </p>
            </div>

            <div className="mt-5 h-px bg-[#D6CEC7]" />

            {/* Journal form, or today's saved entry */}
            {todayEntry ? (
              <div className="fade-up mt-8">
                <p className="whitespace-pre-wrap text-lg leading-10 text-[#2A2B2B]">
                  {todayEntry.journalText}
                </p>

                {reflection && (
                  <div className="mt-7 border-l-2 border-[#812121]/40 pl-4 md:pr-40">
                    <p className="leading-relaxed text-[#2A2B2B]/85">
                      &ldquo;{reflection.quote}&rdquo;
                    </p>

                    {reflection.activities.length > 0 && (
                      <details className="mt-3 text-[#2A2B2B]/85">
                        <summary className="cursor-pointer text-sm text-[#812121]">
                          Little things to try
                        </summary>
                        <ul className="mt-2 flex flex-col gap-1.5 text-[15px]">
                          {reflection.activities.map((activity) => (
                            <li key={activity} className="flex gap-2">
                              <span className="text-[#812121]">✦</span>
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                )}

                <p className="mt-8 text-sm text-[#2A2B2B]/70">
                  You&apos;ve marked today&apos;s moment. Come back tomorrow. ♡
                  Current streak: {streak} {streak === 1 ? "day" : "days"}
                </p>
              </div>
            ) : (
              <JournalEntryForm promptId={prompt.id} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}