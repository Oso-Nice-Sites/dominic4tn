import type { QuoteSection as QuoteData } from "@/sanity/types";

export function QuoteSection({ section }: { section: QuoteData }) {
  return (
    <section
      id={section.anchorId ?? undefined}
      aria-label="In their own words"
      className="on-dark bg-forest-800 px-4 py-16 text-cream-50 sm:px-6 sm:py-20"
    >
      <figure className="mx-auto max-w-4xl text-center">
        <blockquote className="font-display text-2xl font-medium leading-snug sm:text-4xl">
          <p>“{section.quote}”</p>
        </blockquote>
        {section.attribution && (
          <figcaption className="mt-6 font-script text-3xl font-bold text-orange-400">— {section.attribution}</figcaption>
        )}
      </figure>
    </section>
  );
}
