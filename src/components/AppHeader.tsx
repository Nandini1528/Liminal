import Link from "next/link";

type Props = {
  current: "journal" | "entries" | "collection";
  theme?: "light" | "dark";
};

const links = [
  { key: "journal", href: "/journal", label: "Journal" },
  { key: "entries", href: "/entries", label: "Entries" },
  { key: "collection", href: "/collection", label: "Collection" },
] as const;

export default function AppHeader({ current, theme = "light" }: Props) {
  const isDark = theme === "dark";

  const base = isDark
    ? "text-white/70 hover:text-white"
    : "text-[#2A2B2B]/70 hover:text-[#812121]";
  const active = isDark
    ? "text-white underline underline-offset-8"
    : "text-[#812121] underline underline-offset-8";

  return (
    <header className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-6 py-6 sm:px-10">
      <nav className="flex items-center gap-6 text-[18px] sm:gap-8">
        <Link href="/" aria-label="Back to home" className={`transition ${base}`}>
          ←
        </Link>
        {links.map((l) => (
          <Link
            key={l.key}
            href={l.href}
            className={`transition ${current === l.key ? active : base}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <form action="/logout" method="post">
        <button
          type="submit"
          className={`flex h-10 items-center justify-center rounded-[9px] border bg-white px-4 text-[16px] text-[#2A2B2B] shadow-sm transition hover:bg-[#812121] hover:text-white ${
            isDark ? "border-white/30" : "border-[#D6CEC7]"
          }`}
        >
          Log out
        </button>
      </form>
    </header>
  );
}