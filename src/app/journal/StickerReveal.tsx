"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Sticker = { id: string; name: string; imagePath: string };

const SPARKLES = [
  { x: -120, y: -90 },
  { x: 125, y: -70 },
  { x: -105, y: 85 },
  { x: 115, y: 95 },
  { x: 0, y: -130 },
  { x: 0, y: 125 },
];

export default function StickerReveal({
  open,
  sticker,
  onClose,
}: {
  open: boolean;
  sticker: Sticker | null;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(onClose, 3500);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && sticker && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A2B2B]/30 px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="status"
          aria-live="polite"
        >
          <div className="relative flex flex-col items-center">
            {!reduceMotion &&
              SPARKLES.map((s, i) => (
                <motion.span
                  key={i}
                  className="pointer-events-none absolute left-1/2 top-[88px] text-2xl text-[#B8963E]"
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
                  animate={{ opacity: [0, 1, 0], x: s.x, y: s.y, scale: [0.3, 1.1, 0.6] }}
                  transition={{ duration: 0.9, delay: 0.25 + i * 0.04, ease: "easeOut" }}
                >
                  ✦
                </motion.span>
              ))}

            <motion.div
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.2, rotate: -28, y: 50 }
              }
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1, rotate: -6, y: 0 }
              }
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
            >
              <Image
                src={sticker.imagePath}
                alt={sticker.name}
                width={180}
                height={180}
                priority
                className="h-[180px] w-[180px] object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.25)]"
              />
            </motion.div>

            <motion.div
              className="mt-5 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <p className="text-sm uppercase tracking-widest text-[#FFFFFB]/80">
                New sticker
              </p>
              <p className="mt-1 text-2xl text-[#FFFFFB]">{sticker.name}</p>
              <Link
                href="/collection"
                onClick={(e) => e.stopPropagation()}
                className="mt-3 inline-block text-sm text-[#FFFFFB]/80 underline transition hover:text-white"
              >
                See your collection →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}