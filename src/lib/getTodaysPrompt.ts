import { prisma } from "./prisma";

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay) + 1;
}

export async function getTodaysPrompt() {
  const today = new Date();
  const dayOfYear = getDayOfYear(today);

  const prompt = await prisma.prompt.findUnique({
    where: { dayOfYear },
  });

  if (!prompt) {
    throw new Error(`No prompt found for day ${dayOfYear}`);
  }

  return prompt;
}