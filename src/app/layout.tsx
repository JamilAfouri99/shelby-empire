import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "By Order — The Daily Peaky Blinders Companion",
  description:
    "Your daily ritual. A fresh quote, a daily challenge, and an empire to build. By order of the Peaky Blinders.",
  openGraph: {
    title: "By Order — The Daily Peaky Blinders Companion",
    description: "Your daily ritual. A fresh quote, a daily challenge, and an empire to build.",
    type: "website",
    url: "https://byorder.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
