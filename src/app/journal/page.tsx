import { getTodaysPrompt } from "@/lib/getTodaysPrompt";
import Image from "next/image";
import footermsg from "@/components/footermsg.png";
import pin2 from "@/components/pin2.png";
import redpaper from "@/components/redpaper.png";
import clipper from "@/components/clipper.png";
import newspaper from "@/components/newspaper.png";
import stamp from "@/components/stamp.png";

export default async function JournalPage() {
  const prompt = await getTodaysPrompt();

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="mx-auto flex max-w-6xl px-8 pt-8">
        <a
          href="/"
          aria-label="Back to home"
          className="inline-flex items-center gap-2 text-[#2A2B2B] transition hover:text-[#812121]"
        >
          <span className="text-3xl leading-none">←</span>
          <span className="text-base"></span>
        </a>
      </div>

      <main className="px-8 pt-16 pb-4">
      <div className="relative mx-auto max-w-[900px]">
          {/* Red paper behind */}
          <Image
  src={redpaper}
  alt=""
  className="pointer-events-none absolute right-[-130px] bottom-[-80px] w-[900px] max-w-none rotate-[5.5deg] select-none z-0"
  />

          {/* Journal Paper */}
          <div className="relative border border-[#D6CEC7] bg-[#FFFFFB] px-12 py-10 shadow-xl">

            <Image
              src={clipper}
              alt=""
              className="pointer-events-none absolute left-1/2 top-[-75px] z-20 w-32 -translate-x-1/2 select-none"
            />

            {/* Ribbon */}
            <Image
              src={pin2}
              alt=""
              className="absolute left-[-70px] top-[-70px] w-44 rotate-[-3deg] select-none"
            />
            <Image
              src={newspaper}
              alt=""
              className="pointer-events-none absolute bottom-[-40px] right-[-52px] z-10 w-56 rotate-[1deg] select-none"
            />
            <Image
              src={stamp}
              alt=""
              className="pointer-events-none absolute bottom-[-60px] right-[-60px] z-22 w-22 rotate-[12deg] select-none"
            />

            {/* Prompt */}
            <div className="flex items-start justify-between gap-6">
              <h1 className="text-[18px] leading-relaxed text-[#2A2B2B] md:text-[24px]">
                {prompt.text}
              </h1>

              <p className="ml-8 whitespace-nowrap pt-1 text-xl text-[#2A2B2B]/70">
                {formattedDate}
              </p>
            </div>

            <div className="mt-5 h-px bg-[#D6CEC7]" />

            {/* Journal */}
            <form className="mt-8">
              <textarea
                name="journalText"
                placeholder="Start writing..."
                className="h-[220px] w-full resize-none bg-transparent text-lg leading-10 text-[#2A2B2B] placeholder:text-[#2A2B2B]/30 focus:outline-none"                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, transparent 35px, #E7E0D9 36px)",
                  backgroundSize: "100% 36px",
                }}
              />

              <button
                type="submit"
                className="mt-10 rounded-xl bg-[#2A2B2B] px-8 py-4 text-lg text-white transition hover:bg-[#812121]"
              >
                Mark this Moment
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <footer className="mx-auto mt-31 flex max-w-3xl flex-col items-center gap-3 pb-6 text-center text-[#9E9892]">
          <Image src={footermsg} alt="" className="w-16" />
          <p>Copyright © 2026 Liminal. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}