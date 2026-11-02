import { prisma } from "./prisma";
import { getDayOfYear } from "./date";

export async function getTodaysPrompt(today: string) {
  const dayOfYear = getDayOfYear(today);

  const prompt =
    (await prisma.prompt.findUnique({ where: { dayOfYear } })) ??
    (await prisma.prompt.findFirst({ orderBy: { dayOfYear: "asc" } }));

  if (!prompt) throw new Error("No prompts found. Run your prompt seed script.");
  return prompt;
}