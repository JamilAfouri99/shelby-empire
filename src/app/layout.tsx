import type { Metadata, Viewport } from "next";
import { Inter, Besley } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const besley = Besley({
  subsets: ["latin"],
  variable: "--font-besley",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${besley.variable}`}>
      <body>{children}</body>
    </html>
  );
}
