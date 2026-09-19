import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline-dark" | "outline-light" | "solid-green";

const variants: Record<Variant, string> = {
  // Orange with dark text — white on orange fails WCAG contrast.
  primary:
    "bg-orange-500 text-ink border-orange-500 shadow-[3px_3px_0_rgb(0_0_0/0.4)] hover:bg-orange-400 hover:border-orange-400 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  "outline-dark":
    "bg-transparent text-cream-50 border-cream-50/70 hover:bg-cream-50 hover:text-navy-950",
  "outline-light":
    "bg-transparent text-forest-800 border-forest-800 hover:bg-forest-800 hover:text-cream-50",
  "solid-green":
    "bg-forest-800 text-cream-50 border-forest-800 hover:bg-forest-700 hover:border-forest-700",
};

const base =
  "inline-flex min-h-12 items-center justify-center rounded-md border-2 px-6 py-3 text-center font-display text-base font-semibold uppercase tracking-wider transition-colors";

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
