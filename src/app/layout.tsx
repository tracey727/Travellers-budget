import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

/** Headings and figures — a warm serif that carries the premium, editorial feel. */
const display = Fraunces({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

/** Body and interface text — clean and legible at small sizes. */
const body = Inter({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://wayfarer.app"),
  title: {
    default: "Wayfarer — Travel Budgeting, Done Beautifully",
    template: "%s · Wayfarer",
  },
  description:
    "Plan the trip, not the spreadsheet. Wayfarer is the travel budgeting app that tracks every flight, night and meal against your plan — in any currency, for any trip.",
  keywords: [
    "travel budget app",
    "trip budget planner",
    "travel expense tracker",
    "multi currency budgeting",
    "vacation budget planner",
  ],
  openGraph: {
    title: "Wayfarer — Travel Budgeting, Done Beautifully",
    description:
      "Plan the trip, not the spreadsheet. Track every flight, night and meal against your budget, in any currency.",
    type: "website",
    locale: "en_US",
    siteName: "Wayfarer",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#082021",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
