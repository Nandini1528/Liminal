-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "reflection" JSONB;

-- CreateTable
CREATE TABLE "UserSticker" (
    "id" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "stickerId" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,

    CONSTRAINT "UserSticker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSticker_entryId_key" ON "UserSticker"("entryId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSticker_userId_stickerId_key" ON "UserSticker"("userId", "stickerId");

-- AddForeignKey
ALTER TABLE "UserSticker" ADD CONSTRAINT "UserSticker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSticker" ADD CONSTRAINT "UserSticker_stickerId_fkey" FOREIGN KEY ("stickerId") REFERENCES "Sticker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSticker" ADD CONSTRAINT "UserSticker_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
