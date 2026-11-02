"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import footerMsg from "./footermsg.png";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/journal") return null;

  return (
    <footer className="mt-auto flex w-full flex-col items-center gap-2 px-4 pb-5 pt-6 text-center text-lg text-[#9E9892]">
      <Image
        src={footerMsg}
        alt=""
        className="h-auto w-16 select-none"
        sizes="64px"
      />
      <p>Copyright © 2026 Liminal. All rights reserved.</p>
    </footer>
  );
}
