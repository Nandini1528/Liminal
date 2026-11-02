"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { saveJournalEntry } from "@/app/actions/journal";
import ReflectionModal from "./ReflectionModal";
import StickerReveal from "./StickerReveal";

type FormState = {
  error?: string;
  success?: boolean;
  entryId?: string;
  currentStreak?: number;
  longestStreak?: number;
  reflection?: { quote: string; activities: string[] };
  sticker?: { id: string; name: string; imagePath: string } | null;
  collectionComplete?: boolean;
};

const initialState: FormState = {};

export default function JournalEntryForm({
  promptId,
}: {
  promptId: string;
}) {
  const [state, formAction, pending] = useActionState(
    saveJournalEntry,
    initialState
  );

  const [dismissedEntryId, setDismissedEntryId] = useState<string | null>(null);
  const [revealedEntryId, setRevealedEntryId] = useState<string | null>(null);

  // 1) After a save, the reflection modal opens.
  const modalOpen =
    state.success === true &&
    !!state.reflection &&
    dismissedEntryId !== state.entryId;

  // 2) Once the modal is closed, the sticker reveal plays (once per entry).
  const revealOpen =
    state.success === true &&
    !!state.sticker &&
    !modalOpen &&
    revealedEntryId !== state.entryId;

  return (
    <>
      <form action={formAction} className="mt-8">
        <input type="hidden" name="promptId" value={promptId} />

        <textarea
          name="journalText"
          placeholder="Start writing..."
          required
          maxLength={10000}
          readOnly={state.success === true}
          aria-label="Your journal entry"
          className="h-[260px] w-full resize-none bg-transparent text-lg leading-10 text-[#2A2B2B] placeholder:text-[#2A2B2B]/30 focus:outline-none sm:h-[220px]"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, transparent 35px, #E7E0D9 36px)",
            backgroundSize: "100% 36px",
          }}
        />

        {state.error && (
          <p role="alert" className="fade-up mt-4 text-sm text-[#812121]">
            {state.error}
          </p>
        )}

        {state.success && (
          <div
            role="status"
            className="fade-up mt-4 flex items-start justify-between gap-4 rounded-lg border border-[#D6CEC7] bg-[#FAF7F2] p-4 text-[#2A2B2B]"
          >
            <div>
              <p>Your moment has been saved. ♡</p>

              <p className="mt-1 text-sm">
                Current streak: {state.currentStreak}{" "}
                {state.currentStreak === 1 ? "day" : "days"}
              </p>

              <p className="mt-1 text-sm">
                Longest streak: {state.longestStreak}{" "}
                {state.longestStreak === 1 ? "day" : "days"}
              </p>

              {state.collectionComplete && (
                <p className="mt-2 text-sm text-[#812121]">
                  You&apos;ve collected every sticker so far. More are coming. ✦
                </p>
              )}

              {state.reflection && dismissedEntryId === state.entryId && (
                <button
                  type="button"
                  onClick={() => setDismissedEntryId(null)}
                  className="mt-3 text-sm text-[#812121] underline"
                >
                  View today&apos;s reflection again
                </button>
              )}
            </div>

            {state.sticker && (
              <Image
                src={state.sticker.imagePath}
                alt={state.sticker.name}
                width={72}
                height={72}
                className="pop-in h-[72px] w-[72px] shrink-0 rotate-[6deg] object-contain"
              />
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={pending || state.success === true}
          className={`mt-10 w-full rounded-xl bg-[#2A2B2B] px-8 py-4 text-lg text-white transition hover:bg-[#812121] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
            pending ? "animate-pulse" : ""
          }`}
        >
          {pending
            ? "Saving your moment..."
            : state.success
              ? "Moment saved ♡"
              : "Mark this Moment"}
        </button>
      </form>

      <ReflectionModal
        open={modalOpen}
        reflection={state.reflection ?? null}
        onClose={() => setDismissedEntryId(state.entryId ?? null)}
      />

      <StickerReveal
        open={revealOpen}
        sticker={state.sticker ?? null}
        onClose={() => setRevealedEntryId(state.entryId ?? null)}
      />
    </>
  );
}