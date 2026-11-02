import type { Prisma } from "@/generated/prisma/client";

export type AwardedSticker = {
  id: string;
  name: string;
  imagePath: string;
};

export async function awardRandomSticker(
  tx: Prisma.TransactionClient,
  userId: string,
  entryId: string
): Promise<{ sticker: AwardedSticker | null; collectionComplete: boolean }> {
  const owned = await tx.userSticker.findMany({
    where: { userId },
    select: { stickerId: true },
  });

  const available = await tx.sticker.findMany({
    where: { id: { notIn: owned.map((o) => o.stickerId) } },
    select: { id: true, name: true, imagePath: true },
  });

  if (available.length === 0) {
    return { sticker: null, collectionComplete: owned.length > 0 };
  }

  const sticker = available[Math.floor(Math.random() * available.length)];

  await tx.userSticker.create({
    data: { userId, stickerId: sticker.id, entryId },
  });

  return { sticker, collectionComplete: false };
}