import Link from "next/link";
import { nav, site } from "@/content/site";
import { ButtonLink } from "./ButtonLink";
import { MobileNav } from "./MobileNav";
import { Wordmark } from "./Wordmark";

export function Header() {
  return (
    <header className="on-dark relative z-30 bg-navy-950 text-cream-50">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Wordmark />

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block py-3 font-display text-sm uppercase tracking-[0.14em] text-cream-100 transition-colors hover:text-orange-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink href={site.donateUrl} className="!min-h-11 !px-5 !py-2">
            Donate
          </ButtonLink>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
