import Link from "next/link";

export function Wordmark({ name, office, className = "" }: { name: string; office: string; className?: string }) {
  // Highlight the last word of the name (e.g. "Howard") in the accent colour.
  const words = name.trim().split(/\s+/);
  const last = words.length > 1 ? words.pop() : null;

  return (
    <Link
      href="/"
      aria-label={`${name}, ${office} — home`}
      className={`inline-flex flex-col leading-none ${className}`}
    >
      <span className="font-display text-2xl font-bold uppercase tracking-wide text-cream-50 sm:text-3xl">
        {words.join(" ")}
        {last && <span className="text-orange-500"> {last}</span>}
      </span>
      <span className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-cream-200 sm:text-xs">
        {office}
      </span>
    </Link>
  );
}
