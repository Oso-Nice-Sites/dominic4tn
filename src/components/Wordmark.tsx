import Link from "next/link";
import { site } from "@/content/site";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} for ${site.office} — home`}
      className={`inline-flex flex-col leading-none ${className}`}
    >
      <span className="font-display text-2xl font-bold uppercase tracking-wide text-cream-50 sm:text-3xl">
        Dominic <span className="text-orange-500">Howard</span>
      </span>
      <span className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-cream-200 sm:text-xs">
        {site.office}
      </span>
    </Link>
  );
}
