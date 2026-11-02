-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "savedReflection" TEXT,
ADD COLUMN     "stickerId" TEXT,
ALTER COLUMN "entryDate" DROP DEFAULT,
ALTER COLUMN "entryDate" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata';

-- CreateTable
CREATE TABLE "Sticker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sticker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sticker_imagePath_key" ON "Sticker"("imagePath");

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_stickerId_fkey" FOREIGN KEY ("stickerId") REFERENCES "Sticker"("id") ON DELETE SET NULL ON UPDATE CASCADE;
