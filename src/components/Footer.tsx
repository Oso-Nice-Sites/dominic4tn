import Link from "next/link";
import { phoneHref, resolvedLinks } from "@/lib/links";
import type { SiteSettings } from "@/sanity/types";
import { Wordmark } from "./Wordmark";

const linkClass = "inline-flex min-h-11 items-center underline-offset-4 hover:underline";

export function Footer({ settings }: { settings: SiteSettings }) {
  const explore = resolvedLinks(settings.navigation);
  const legal = resolvedLinks(settings.footerLinks);

  return (
    <footer className="on-dark bg-forest-950 text-cream-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Wordmark name={settings.name} office={settings.office} />
          {settings.tagline && <p className="mt-4 max-w-xs text-sm text-cream-200">{settings.tagline}</p>}
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-sm uppercase tracking-[0.18em] text-orange-500">Explore</h2>
          <ul className="mt-3 text-sm">
            {explore.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            {settings.donateUrl && (
              <li>
                <a href={settings.donateUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Donate<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            )}
          </ul>
        </nav>

        {(settings.email || settings.phone) && (
          <div>
            <h2 className="font-display text-sm uppercase tracking-[0.18em] text-orange-500">Contact</h2>
            <ul className="mt-3 text-sm">
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className={linkClass}>
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={phoneHref(settings.phone)} className={linkClass}>
                    {settings.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-cream-50/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-cream-200 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.name} for Tennessee. All rights reserved.
          </p>
          {legal.length > 0 && (
            <ul className="flex flex-wrap gap-x-6">
              {legal.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className={`${linkClass} underline`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        {settings.disclaimer && (
          <p className="mx-auto max-w-6xl px-4 pb-[max(2rem,env(safe-area-inset-bottom))] text-xs text-cream-200 sm:px-6">
            {settings.disclaimer}
          </p>
        )}
      </div>
    </footer>
  );
}
