import { config } from "dotenv";
import { GoogleGenAI } from "@google/genai";

config({ path: ".env.local" });
config();

async function main() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing. Check .env.local in the project root.");
    process.exit(1);
  }
  console.log(`Key found (starts with ${apiKey.slice(0, 6)}..., length ${apiKey.length}).`);

  const ai = new GoogleGenAI({ apiKey });

  console.log("\nModels available to your key:");
  try {
    const pager = await ai.models.list();
    for await (const model of pager) {
      if (model.name?.toLowerCase().includes("flash")) console.log(" -", model.name);
    }
  } catch (error) {
    console.error("Could not list models:", error);
  }

  const model = process.argv[2] || process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
  console.log(`\nTesting generateContent with "${model}"...`);
  try {
    const res = await ai.models.generateContent({
      model,
      contents: 'Reply with a JSON object: {"ok": true}',
      config: { responseMimeType: "application/json" },
    });
    console.log("Success. Response:", res.text);
  } catch (error) {
    console.error("FAILED:", error);
  }
}

main();