import type { Metadata } from "next";
import { Schoolbell } from "next/font/google";
import "./globals.css";

const schoolbell = Schoolbell({
  variable: "--font-schoolbell",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Liminal",
  description: "Between who you are and who you're becoming.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${schoolbell.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
