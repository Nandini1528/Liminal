import type { Metadata } from "next";
import { Schoolbell } from "next/font/google";
import "./globals.css";

const schoolbell = Schoolbell({
  variable: "--font-schoolbell",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
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
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${schoolbell.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        {children}
      </body>
    </html>
  );
}
