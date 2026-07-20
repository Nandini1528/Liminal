import Image from "next/image";
import Link from "next/link";
import logo from "./logo.svg";
import navline from "./navline.png";

export default function Nav() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex w-full max-w-4xl items-center justify-center gap-10 py-6 font-handwritten text-[16px] text-[#2A2B2B] sm:gap-16"
      >
        <Link href="/" className="inline-flex h-5 w-[49px] items-center" aria-label="Liminal home">
          <Image src={logo} alt="Liminal" priority className="h-5 w-auto" sizes="49px" />
        </Link>
        <a href="#calendar" className="transition hover:text-[#812121]">
          Calendar
        </a>
        <Link href="/entries" className="transition hover:text-[#812121]">
          Entries
        </Link>
      </nav>
      <div className="mx-auto mb-4 flex w-full justify-center">
        <Image src={navline} alt="" className="h-auto w-[420px] rotate-[-1deg] select-none" sizes="420px" />
      </div>
    </div>
  );
}