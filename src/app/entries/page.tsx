import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import AppHeader from "@/components/AppHeader";

const PAGE_SIZE = 10;

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

export default async function EntriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const [dbUser, total] = await Promise.all([
    prisma.user.findUnique({
      where: { id: authUser.id },
      select: { currentStreak: true, longestStreak: true },
    }),
    prisma.entry.count({ where: { userId: authUser.id } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const requested = Number.parseInt(pageParam ?? "1", 10);
  const page = Number.isFinite(requested) && requested > 0 ? requested : 1;
  if (page > totalPages) redirect(`/entries?page=${totalPages}`);

  const entries = await prisma.entry.findMany({
    where: { userId: authUser.id },
    orderBy: { entryDate: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      entryDate: true,
      journalText: true,
      reflection: true,
      prompt: { select: { text: true } },
      userSticker: {
        select: { sticker: { select: { name: true, imagePath: true } } },
      },
    },
  });

  const streak = dbUser?.currentStreak ?? 0;
  const longest = dbUser?.longestStreak ?? 0;

  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-[#FAF7F2]">
      <AppHeader current="entries" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-12 pt-12 sm:px-8">
        <h1 className="fade-up text-[28px] leading-tight text-[#2A2B2B] sm:text-[32px]">
          Your entries
        </h1>
        <p
          className="fade-up mt-2 text-[#2A2B2B]/70"
          style={{ "--delay": "60ms" } as CSSProperties}
        >
          {total} {total === 1 ? "moment" : "moments"} marked · current streak{" "}
          {streak} {streak === 1 ? "day" : "days"} · longest {longest}{" "}
          {longest === 1 ? "day" : "days"}
        </p>

        {entries.length === 0 ? (
          <div
            className="fade-up mt-14 border border-dashed border-[#D6CEC7] bg-[#FFFFFB] px-8 py-14 text-center"
            style={{ "--delay": "120ms" } as CSSProperties}
          >
            <p className="text-xl text-[#2A2B2B]">No moments yet.</p>
            <p className="mt-2 text-[#2A2B2B]/70">
              Your entries will be kept here, forever.
            </p>
            <Link
              href="/journal"
              className="mt-6 inline-block rounded-xl bg-[#2A2B2B] px-6 py-3 text-white transition hover:bg-[#812121] active:scale-[0.98]"
            >
              Write today&apos;s entry
            </Link>
          </div>
        ) : (
          <ol className="mt-14 flex flex-col gap-14">
            {entries.map((entry, i) => {
              const reflection = parseReflection(entry.reflection);
              const sticker = entry.userSticker?.sticker;
              const dateLabel = entry.entryDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              });

              return (
                <li
                  key={entry.id}
                  className="fade-up"
                  style={
                    { "--delay": `${120 + Math.min(i, 6) * 80}ms` } as CSSProperties
                  }
                >
                  <article
                    className={`relative border border-[#D6CEC7] bg-[#FFFFFB] px-6 pb-8 pt-9 shadow-md transition-shadow duration-300 hover:shadow-xl sm:px-10 ${
                      i % 2 === 0 ? "md:-rotate-[0.4deg]" : "md:rotate-[0.4deg]"
                    }`}
                  >
                    <span className="pointer-events-none absolute left-1/2 top-[-11px] h-6 w-24 -translate-x-1/2 rotate-[-2deg] bg-[#E9DFC8]/80 shadow-sm" />

                    {sticker && (
                      <Image
                        src={sticker.imagePath}
                        alt={`Sticker: ${sticker.name}`}
                        width={80}
                        height={80}
                        className="absolute -top-7 right-1 h-16 w-16 rotate-[8deg] object-contain drop-shadow-md sm:-right-3 sm:h-20 sm:w-20"
                      />
                    )}

                    <p
                      className={`text-sm uppercase tracking-widest text-[#9E9892] ${
                        sticker ? "pr-16 sm:pr-20" : ""
                      }`}
                    >
                      {dateLabel}
                    </p>

                    <h2 className="mt-3 text-[19px] leading-relaxed text-[#2A2B2B] sm:text-[20px]">
                      {entry.prompt.text}
                    </h2>

                    <div className="mt-4 h-px bg-[#D6CEC7]" />

                    <p className="mt-5 whitespace-pre-wrap break-words text-lg leading-9 text-[#2A2B2B]">
                      {entry.journalText}
                    </p>

                    {reflection && (
                      <div className="mt-7 border-l-2 border-[#812121]/40 pl-4">
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
                  </article>
                </li>
              );
            })}
          </ol>
        )}

        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-14 flex items-center justify-between text-[#2A2B2B]"
          >
            {page > 1 ? (
              <Link
                href={`/entries?page=${page - 1}`}
                className="py-2 transition hover:text-[#812121]"
              >
                ← Newer
              </Link>
            ) : (
              <span />
            )}

            <span className="text-sm text-[#2A2B2B]/60">
              Page {page} of {totalPages}
            </span>

            {page < totalPages ? (
              <Link
                href={`/entries?page=${page + 1}`}
                className="py-2 transition hover:text-[#812121]"
              >
                Older →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </main>
    </div>
  );
}
