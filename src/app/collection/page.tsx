import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import AppHeader from "@/components/AppHeader";

export default async function CollectionPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const [dbUser, stickers, earned] = await Promise.all([
    prisma.user.findUnique({
      where: { id: authUser.id },
      select: { timezone: true },
    }),
    prisma.sticker.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, imagePath: true },
    }),
    prisma.userSticker.findMany({
      where: { userId: authUser.id },
      select: { stickerId: true, earnedAt: true },
    }),
  ]);

  const timezone = dbUser?.timezone ?? "Asia/Kolkata";
  const earnedAtById = new Map(earned.map((e) => [e.stickerId, e.earnedAt]));
  const collected = stickers.filter((s) => earnedAtById.has(s.id)).length;

  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-[#FAF7F2]">
      <AppHeader current="collection" />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-12 pt-12 sm:px-8">
        <h1 className="fade-up text-[28px] leading-tight text-[#2A2B2B] sm:text-[32px]">
          Your sticker collection
        </h1>
        <p
          className="fade-up mt-2 text-[#2A2B2B]/70"
          style={{ "--delay": "60ms" } as CSSProperties}
        >
          {stickers.length === 0
            ? "No stickers have been added yet."
            : `${collected} of ${stickers.length} collected · one new sticker for every entry you write`}
        </p>

        {stickers.length > 0 && (
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4">
            {stickers.map((sticker, i) => {
              const earnedAt = earnedAtById.get(sticker.id);

              return (
                <li
                  key={sticker.id}
                  className="pop-in flex flex-col items-center text-center"
                  style={
                    { "--delay": `${120 + Math.min(i, 11) * 50}ms` } as CSSProperties
                  }
                >
                  <div
                    className={`flex h-[130px] w-[130px] items-center justify-center transition-transform duration-300 ${
                      earnedAt
                        ? `hover:scale-110 hover:rotate-0 ${
                            i % 2 === 0 ? "-rotate-3" : "rotate-3"
                          }`
                        : ""
                    }`}
                  >
                    <Image
                      src={sticker.imagePath}
                      alt={earnedAt ? sticker.name : "Locked sticker"}
                      width={130}
                      height={130}
                      className={
                        earnedAt
                          ? "h-[130px] w-[130px] object-contain drop-shadow-md"
                          : "h-[130px] w-[130px] object-contain opacity-[0.12] brightness-0"
                      }
                    />
                  </div>

                  {earnedAt ? (
                    <>
                      <p className="mt-3 text-[17px] text-[#2A2B2B]">
                        {sticker.name}
                      </p>
                      <p className="text-xs text-[#9E9892]">
                        {earnedAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          timeZone: timezone,
                        })}
                      </p>
                    </>
                  ) : (
                    <p className="mt-3 text-[17px] text-[#2A2B2B]/40">???</p>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {stickers.length > 0 && collected < stickers.length && (
          <p className="mt-14 text-center text-[#2A2B2B]/70">
            Write today&apos;s entry to earn the next one.{" "}
            <Link href="/journal" className="text-[#812121] underline">
              Go to journal
            </Link>
          </p>
        )}
      </main>
    </div>
  );
}
