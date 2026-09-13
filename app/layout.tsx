import type { Metadata, Viewport } from "next";
import { Caveat, Archivo_Black } from "next/font/google";
import "./globals.css";

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});
const hand = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
});

export const metadata: Metadata = {
  title: "ALIVE — Don't Just Exist. Live.",
  description:
    "Take back your attention. Take back your time. Make room for your life.",
};

export const viewport: Viewport = {
  themeColor: "#f4f1ea",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
