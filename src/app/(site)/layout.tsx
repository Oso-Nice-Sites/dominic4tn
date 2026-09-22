import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PreviewBanner } from "@/components/PreviewBanner";
import { getSiteSettings } from "@/sanity/content";
import "../globals.css";

// Chrome for the public website: skip link, header, footer. Site-wide details
// (name, menu, contact info, disclaimer) come from "Site settings" in the CMS.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-orange-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>
      <PreviewBanner />
      <Header settings={settings} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
    </div>
  );
}
