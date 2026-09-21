"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { ResolvedLink } from "@/lib/links";

export function MobileNav({ items, donateUrl }: { items: ResolvedLink[]; donateUrl?: string | null }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-11 items-center gap-2 rounded-md border-2 border-cream-50/60 px-4 font-display text-sm font-semibold uppercase tracking-wider text-cream-50"
      >
        {open ? "Close" : "Menu"}
      </button>

      <nav
        id={panelId}
        aria-label="Mobile"
        hidden={!open}
        className="absolute inset-x-0 top-full border-t border-cream-50/10 bg-navy-950 px-4 pb-6 pt-2 shadow-xl"
      >
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item.key} className="border-b border-cream-50/10">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-4 font-display text-lg uppercase tracking-wider text-cream-50"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        {donateUrl && (
          <a
            href={donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center rounded-md bg-orange-500 px-6 py-3 font-display text-base font-semibold uppercase tracking-wider text-ink"
          >
            Donate Today
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </nav>
    </div>
  );
}
