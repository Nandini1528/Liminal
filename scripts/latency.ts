import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local" });
config();

async function time(label: string, fn: () => Promise<unknown>) {
  const start = performance.now();
  try {
    await fn();
    console.log(`${label.padEnd(36)} ${Math.round(performance.now() - start)} ms`);
  } catch (error) {
    console.log(
      `${label.padEnd(36)} FAILED:`,
      error instanceof Error ? error.message : error
    );
  }
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!dbUrl || !supabaseUrl || !anonKey) {
    console.error("Missing DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    process.exit(1);
  }

  console.log("Database host:", new URL(dbUrl).hostname);
  console.log("Supabase URL: ", supabaseUrl);

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: dbUrl }) });

  console.log("\n--- Database (through Prisma) ---");
  await time("first query (opens connection)", () => prisma.$queryRaw`SELECT 1`);
  for (let i = 1; i <= 4; i++) {
    await time(`query ${i} (connection reused)`, () => prisma.$queryRaw`SELECT 1`);
  }

  console.log("\n--- Supabase Auth server ---");
  for (let i = 1; i <= 3; i++) {
    await time(`auth request ${i}`, () =>
      fetch(`${supabaseUrl}/auth/v1/health`, { headers: { apikey: anonKey } })
    );
  }

  console.log("\n--- JWT signing keys (decides if getClaims is fast) ---");
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/.well-known/jwks.json`);
    const json = (await res.json()) as { keys?: { alg?: string; kty?: string }[] };
    const keys = json.keys ?? [];
    if (keys.length === 0) {
      console.log("No public keys found: your project uses a shared secret, so getClaims() still calls the server.");
    } else {
      console.log(`Found ${keys.length} public key(s):`, keys.map((k) => k.alg ?? k.kty).join(", "));
      console.log("Good: getClaims() can verify logins without a network call.");
    }
  } catch (error) {
    console.log("Could not read the JWKS endpoint:", error instanceof Error ? error.message : error);
  }

  await prisma.$disconnect();
}

main();