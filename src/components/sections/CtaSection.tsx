import { ButtonLink } from "@/components/ButtonLink";
import { SectionHeading } from "@/components/SectionHeading";
import type { CtaSection as CtaData } from "@/sanity/types";

export function CtaSection({ section }: { section: CtaData }) {
  const headingId = `${section._key}-heading`;
  const buttons = (section.buttons ?? []).flatMap((b) => (b.href ? [{ ...b, href: b.href }] : []));

  return (
    // The wrapper's cream matches the cards section above, so the slanted top edge blends in.
    <div className="bg-cream-100">
      <section
        id={section.anchorId ?? undefined}
        aria-labelledby={headingId}
        className="flag-bg slant-top on-dark px-4 pb-20 text-center text-cream-50 sm:px-6 sm:pb-24"
      >
        <div className="mx-auto max-w-3xl">
          <SectionHeading id={headingId} dark center size="lg">
            {section.heading}
          </SectionHeading>
          {section.body && <p className="mx-auto mt-6 max-w-2xl text-lg text-cream-100">{section.body}</p>}
          {buttons.length > 0 && (
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
              {buttons.map((button) => (
                <ButtonLink
                  key={button._key ?? button.label}
                  href={button.href}
                  variant={button.style === "outline" ? "outline-dark" : "primary"}
                  className="w-full sm:w-auto"
                >
                  {button.label}
                </ButtonLink>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
