import type { ReactNode } from "react";

// Stand-in for pages whose content will be managed in the CMS. Not final copy.
export function LegalPlaceholder({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="font-display text-4xl font-bold uppercase leading-tight text-forest-800 sm:text-5xl">
        {title}
      </h1>
      <p className="mt-6 text-lg text-ink-soft">
        {children ?? "This page is being drafted and will be published before launch."}
      </p>
    </div>
  );
}
