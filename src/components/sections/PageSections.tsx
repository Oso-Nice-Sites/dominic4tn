import type { Section } from "@/sanity/types";
import { CardsSection } from "./CardsSection";
import { CtaSection } from "./CtaSection";
import { HeroSection } from "./HeroSection";
import { QuoteSection } from "./QuoteSection";
import { StatsSection } from "./StatsSection";
import { TextSection } from "./TextSection";

function SectionRenderer({ section, isHome }: { section: Section; isHome: boolean }) {
  switch (section._type) {
    case "heroSection":
      return <HeroSection section={section} isHome={isHome} />;
    case "textSection":
      return <TextSection section={section} />;
    case "quoteSection":
      return <QuoteSection section={section} />;
    case "statsSection":
      return <StatsSection section={section} />;
    case "cardsSection":
      return <CardsSection section={section} />;
    case "ctaSection":
      return <CtaSection section={section} />;
    default:
      // A section type this version of the site doesn't know about: skip it.
      return null;
  }
}

/** Renders a page's sections in the order the editors arranged them. */
export function PageSections({ sections, isHome = false }: { sections: Section[]; isHome?: boolean }) {
  return (
    <>
      {sections.map((section) => (
        <SectionRenderer key={section._key} section={section} isHome={isHome} />
      ))}
    </>
  );
}
