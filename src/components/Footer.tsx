import Link from "next/link";
import { nav, site } from "@/content/site";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="on-dark bg-forest-950 text-cream-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm text-cream-200">
            The Correct Call for Tennessee Families.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-sm uppercase tracking-[0.18em] text-orange-500">
            Explore
          </h2>
          <ul className="mt-3 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={site.donateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
              >
                Donate<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm uppercase tracking-[0.18em] text-orange-500">
            Contact
          </h2>
          <ul className="mt-3 text-sm">
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.phoneHref} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                {site.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream-50/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-cream-200 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Dominic Howard for Tennessee. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6">
            <li>
              <Link href="/privacy" className="inline-flex min-h-11 items-center underline underline-offset-4">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/accessibility" className="inline-flex min-h-11 items-center underline underline-offset-4">
                Accessibility Statement
              </Link>
            </li>
          </ul>
        </div>
        <p className="mx-auto max-w-6xl px-4 pb-[max(2rem,env(safe-area-inset-bottom))] text-xs text-cream-200 sm:px-6">
          {site.disclaimer}
        </p>
      </div>
    </footer>
  );
}
