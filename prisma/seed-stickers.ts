import { config } from "dotenv";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local" });
config();

const STICKER_DIR = path.join(process.cwd(), "public", "stickers");
const EXTENSIONS = new Set([".png", ".webp", ".svg", ".jpg", ".jpeg", ".gif"]);

function toName(file: string): string {
  return path
    .parse(file)
    .name.replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    const files = (await readdir(STICKER_DIR))
      .filter((f) => EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort();

    if (files.length === 0) {
      console.log("No images found in public/stickers.");
      return;
    }

    for (const file of files) {
      const imagePath = `/stickers/${file}`;
      await prisma.sticker.upsert({
        where: { imagePath },
        update: { name: toName(file) },
        create: { name: toName(file), imagePath },
      });
    }

    const total = await prisma.sticker.count();
    console.log(`Synced ${files.length} stickers (${total} in the database).`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});