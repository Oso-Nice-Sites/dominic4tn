import { SectionHeading } from "@/components/SectionHeading";
import type { CardsSection as CardsData } from "@/sanity/types";

export function CardsSection({ section }: { section: CardsData }) {
  const headingId = `${section._key}-heading`;
  const cards = section.cards ?? [];

  return (
    <section
      id={section.anchorId ?? undefined}
      aria-labelledby={section.heading ? headingId : undefined}
      className="bg-cream-100 px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        {section.heading && (
          <SectionHeading id={headingId} center>
            {section.heading}
          </SectionHeading>
        )}
        <ul className={`grid gap-6 md:grid-cols-3 ${section.heading ? "mt-12" : ""}`}>
          {cards.map((card) => (
            <li
              key={card._key}
              className="flex flex-col rounded-lg border-t-[6px] border-orange-500 bg-white p-7 shadow-sm ring-1 ring-cream-200"
            >
              {card.topic && (
                <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-forest-700">
                  {card.topic}
                </p>
              )}
              <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-ink">
                {card.title}
              </h3>
              {card.body && <p className="mt-4 text-ink-soft">{card.body}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
