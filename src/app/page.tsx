import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import footerMsg from "../components/footermsg.png";
import line from "../components/line.png";
import logo from "../components/logo.svg";
import mainPaper from "../components/main.png";
import pin from "../components/pin.png";
import polaroid from "../components/polaroid.png";
import reminder from "../components/reminder.png";
import navline from "../components/navline.png";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const traceHref = user ? "/journal" : "/login";

  return (
    <section className="relative flex min-h-[90vh] w-full flex-col overflow-hidden bg-white px-5 text-[#2A2B2B] sm:px-8">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex w-full max-w-4xl items-center justify-center gap-10 py-6 text-[16px] text-[#2A2B2B] sm:gap-16"
        >
          
          <a
            href="#home"
            className="inline-flex h-5 w-12.25 items-center"
            aria-label="Liminal home"
          >
            <Image
              src={logo}
              alt="Liminal"
              priority
              className="h-5 w-auto"
              sizes="49px"
            />
          </a>
          <a href="#calendar" className="transition hover:text-[#812121]">
            Calendar
          </a>
          <a href="#entries" className="transition hover:text-[#812121]">
            Entries
          </a>
        </nav>
        <div className="mx-auto mb-4 flex w-full justify-center">
          <Image
            src={navline}
            alt=""
            className="h-auto w-[420px] rotate-[-1deg] select-none"
            sizes="420px"
          />
        </div>

        <div
          id="home"
          className="relative mx-auto flex w-full max-w-7xl flex-1 items-center justify-center pb-12"
        >
          <div className="relative w-full max-w-[980px] lg:h-[560px] lg:max-w-[1280px]">
            <div className="relative z-20 mx-auto w-full max-w-[641px] lg:absolute lg:left-[-3%] lg:top-[140px] lg:mx-0">
              <Image
                src={mainPaper}
                alt=""
                priority
                className="h-auto w-full select-none"
                sizes="(min-width: 1024px) 641px, 92vw"
              />
              <Image
                src={pin}
                alt=""
                className="absolute left-[58%] top-[-8%] h-[70px] w-[58px] -translate-x-1/2 rotate-[-1deg] select-none drop-shadow-md"
                sizes="58px"
              />
              <div className="absolute left-[21%] right-[8%] top-[13%]">
                <h1 className="text-center text-[37px] leading-none text-[#2A2B2B]">
                  In between is still a place
                </h1>
                <Image
                  src={line}
                  alt=""
                  className="mt-[29px] h-auto w-[92%] select-none"
                  sizes="405px"
                />
                <p className="ml-6 mt-[28px] max-w-[430px] text-justify text-[24px] leading-tight text-[#2A2B2B]">
                  Collect thoughts, memories, discoveries, and pieces of
                  yourself as you move through life&apos;s in-between seasons.
                </p>
                <Link
                  href={traceHref}
                  className="mx-auto mt-[35px] flex h-[50px] w-[160px] items-center justify-center gap-[10px] rounded-[9px] bg-[#2A2B2B] p-[10px] text-[20px] text-white shadow-sm transition hover:bg-[#812121]"
                >
                  Leave a trace
                </Link>
              </div>
            </div>

            <div className="relative z-30 mx-auto mt-8 w-[72%] max-w-[360px] rotate-[0deg] lg:absolute lg:left-[45%] lg:top-[0px] lg:mt-0 lg:w-[32%] lg:max-w-[400px]">
              <Image
                src={polaroid}
                alt="A scrapbook polaroid memory by the ocean"
                priority
                className="h-auto w-full select-none drop-shadow-xl"
                sizes="(min-width: 1024px) 400px, 72vw"
              />
            </div>

            <div className="relative z-30 mx-auto mt-[-1rem] w-[495.73px] max-w-[495.73px] rotate-[2deg] lg:absolute lg:right-[-8%] lg:top-[100px] lg:mt-0 lg:w-[495.73px] lg:max-w-[495.73px]">
              <Image
                src={reminder}
                alt="A handwritten reminder about temporary seasons"
                className="h-[516px] w-[495.73px] select-none drop-shadow-lg"
                sizes="(min-width: 1024px) 495.73px, 82vw"
              />
            </div>
          </div>
        </div>
      </div>

      <footer className="mx-auto mt-24 flex w-full max-w-3xl flex-col items-center gap-2 pb-7 text-center text-lg text-[#9E9892]">
        <Image
          src={footerMsg}
          alt=""
          className="h-auto w-16 select-none"
          sizes="64px"
        />
        <p>Copyright © 2026 Liminal. All rights reserved.</p>
      </footer>
    </section>
  );
}