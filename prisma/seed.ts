// prisma/seed.ts
// Run this once to populate the Prompt table with all 365 daily prompts.

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { prompts } from "./prompts-data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Seeding ${prompts.length} prompts...`);

  for (let i = 0; i < prompts.length; i++) {
    const dayOfYear = i + 1;
    await prisma.prompt.upsert({
      where: { dayOfYear },
      update: { text: prompts[i] },
      create: { text: prompts[i], dayOfYear },
    });
  }

  console.log("Done seeding all prompts.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });