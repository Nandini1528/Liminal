import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import line from "../components/line.png";
import logo from "../components/logo.svg";
import mainPaper from "../components/main.png";
import pin from "../components/pin.png";
import polaroid from "../components/polaroid.png";
import reminder from "../components/reminder.png";
import navline from "../components/navline.png";
import Footer from "@/components/Footer";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const traceHref = user ? "/journal" : "/login";
  const entriesHref = user ? "/entries" : "/login";
  const collectionHref = user ? "/collection" : "/login";

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "";

  const authButton =
    "flex h-10 items-center justify-center rounded-[9px] bg-[#2A2B2B] px-4 text-[16px] text-white shadow-sm transition hover:bg-[#812121]";

  return (
    <section className="relative flex flex-1 flex-col overflow-hidden bg-white px-5 text-[#2A2B2B] sm:px-8">
      {/* Auth status (top right) */}
      <div className="absolute right-5 top-5 z-40 flex items-center gap-3 sm:right-8 sm:top-6">
        {user ? (
          <>
            <span className="hidden items-center gap-2 text-[16px] text-[#2A2B2B]/80 sm:flex">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-green-500"
              />
              {displayName}
            </span>
            <form action="/logout" method="post">
              <button type="submit" className={authButton}>
                Log out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="flex h-10 items-center justify-center rounded-[9px] border border-[#2A2B2B] px-4 text-[16px] text-[#2A2B2B] transition hover:bg-[#2A2B2B] hover:text-white"
            >
              Log in
            </Link>
            <Link href="/signup" className={authButton}>
              Sign up
            </Link>
          </>
        )}
      </div>

      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex w-full max-w-4xl items-center justify-center gap-10 py-6 text-[16px] text-[#2A2B2B] sm:gap-16"
        >
          <Link
            href="/"
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
          </Link>
          <Link href={entriesHref} className="transition hover:text-[#812121]">
            Entries
          </Link>
          <Link
            href={collectionHref}
            className="transition hover:text-[#812121]"
          >
            Collection
          </Link>
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
      <Footer />
    </section>
  );
}