import { ButtonLink } from "@/components/ButtonLink";
import type { HeroSection as HeroData } from "@/sanity/types";

function Headline({ text, highlight }: { text: string; highlight?: string | null }) {
  const at = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || at === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="text-orange-500">{highlight}</span>
      {text.slice(at + highlight.length)}
    </>
  );
}

export function HeroSection({ section, isHome }: { section: HeroData; isHome: boolean }) {
  const headingId = `${section._key}-heading`;
  // A page has exactly one h1: the hero on the home page, the page title elsewhere.
  const Heading = isHome ? "h1" : "h2";
  const primary = section.primaryCta?.href ? section.primaryCta : null;
  const secondary = section.secondaryCta?.href ? section.secondaryCta : null;

  return (
    <section
      id={section.anchorId ?? undefined}
      aria-labelledby={headingId}
      className="flag-bg slant-bottom on-dark relative text-cream-50"
    >
      <div className="mx-auto max-w-5xl px-4 pt-16 text-center sm:px-6 sm:pt-24">
        {section.eyebrow && (
          <p className="font-script text-3xl font-bold leading-none text-orange-500">{section.eyebrow}</p>
        )}
        <Heading
          id={headingId}
          className="mt-5 whitespace-pre-line font-display text-[clamp(2.75rem,8vw,6rem)] font-bold uppercase leading-[0.95]"
        >
          <Headline text={section.headline} highlight={section.highlight} />
        </Heading>
        {(primary || secondary) && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {primary?.href && (
              <ButtonLink href={primary.href} className="w-full sm:w-auto sm:!px-10 sm:!py-4">
                {primary.label}
              </ButtonLink>
            )}
            {secondary?.href && (
              <ButtonLink
                href={secondary.href}
                variant="outline-dark"
                className="w-full sm:w-auto sm:!px-10 sm:!py-4"
              >
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
