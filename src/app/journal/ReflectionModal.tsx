"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Reflection = { quote: string; activities: string[] };

export default function ReflectionModal({
  open,
  reflection,
  onClose,
}: {
  open: boolean;
  reflection: Reflection | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Close on Escape + lock page scroll while open
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && reflection && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A2B2B]/40 px-5 py-8 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Your reflection"
            className="relative max-h-full w-full max-w-[520px] overflow-y-auto border border-[#D6CEC7] bg-[#FFFFFB] px-8 pb-9 pt-12 shadow-2xl sm:px-11"
            initial={{ opacity: 0, y: 18, scale: 0.96, rotate: -1 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* tape */}
            <span className="pointer-events-none absolute left-1/2 top-[-12px] h-6 w-24 -translate-x-1/2 rotate-[-2deg] bg-[#E9DFC8]/80 shadow-sm" />

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close reflection"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#2A2B2B]/60 transition hover:bg-[#F1ECE4] hover:text-[#812121] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#812121]"
            >
              ×
            </button>

            <p className="text-sm uppercase tracking-widest text-[#9E9892]">
              A thought for today
            </p>

            <p className="mt-4 text-[22px] italic leading-relaxed text-[#2A2B2B] md:text-[26px]">
              &ldquo;{reflection.quote}&rdquo;
            </p>

            <div className="my-7 h-px bg-[#D6CEC7]" />

            <p className="text-sm uppercase tracking-widest text-[#9E9892]">
              Little things to try
            </p>

            <ul className="mt-4 flex flex-col gap-3">
              {reflection.activities.map((activity, i) => (
                <motion.li
                  key={activity}
                  className="flex gap-3 text-[17px] leading-snug text-[#2A2B2B]"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.12 }}
                >
                  <span className="text-[#812121]">✦</span>
                  <span>{activity}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}