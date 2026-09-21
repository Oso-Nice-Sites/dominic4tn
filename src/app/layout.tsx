import type { Metadata, Viewport } from "next";
import { Caveat_Brush, Inter, Oswald } from "next/font/google";
import { homeDescription } from "@/content/defaults";
import { isStaticPreview } from "@/sanity/env";

// Root layout: just the document shell. The public site's chrome (header,
// footer, global CSS) lives in (site)/layout.tsx so the Studio at /studio
// stays untouched by it.

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Brush script for section headings, echoing the reference site's lettering.
const caveat = Caveat_Brush({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a1120",
};

export const metadata: Metadata = {
  title: {
    default: "Dominic Howard for Tennessee State House, District 46",
    template: "%s | Dominic Howard for Tennessee",
  },
  description: homeDescription,
  // Keep the stakeholder preview out of search results.
  ...(isStaticPreview && { robots: { index: false, follow: false } }),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
