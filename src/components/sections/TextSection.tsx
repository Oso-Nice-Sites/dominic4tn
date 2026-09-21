import { PhotoFrame } from "@/components/PhotoFrame";
import { RichText } from "@/components/RichText";
import { SectionHeading } from "@/components/SectionHeading";
import { imageUrl } from "@/sanity/image";
import type { TextSection as TextData } from "@/sanity/types";

export function TextSection({ section }: { section: TextData }) {
  const headingId = `${section._key}-heading`;
  const photoSrc = imageUrl(section.image);
  const photoLeft = section.imagePosition !== "right";
  const callout = section.variant === "callout";
  const hasBody = Array.isArray(section.body) ? section.body.length > 0 : Boolean(section.body);

  const photo = photoSrc ? (
    <PhotoFrame src={photoSrc} alt={section.image?.alt ?? ""} className="mx-auto max-w-sm md:max-w-none" />
  ) : null;

  const copy = (
    <div>
      {section.heading && <SectionHeading id={headingId}>{section.heading}</SectionHeading>}
      {hasBody && section.body && (
        <RichText
          value={section.body}
          className={
            callout
              ? `${section.heading ? "mt-8 " : ""}rounded-lg border-2 border-forest-700 bg-mint-100 p-6 text-lg text-ink sm:p-8`
              : `${section.heading ? "mt-8 " : ""}text-lg text-ink-soft`
          }
        />
      )}
    </div>
  );

  return (
    <section
      id={section.anchorId ?? undefined}
      aria-labelledby={section.heading ? headingId : undefined}
      className="px-4 py-16 sm:px-6 sm:py-24"
    >
      {photo ? (
        <div
          className={`mx-auto grid max-w-6xl items-center gap-10 md:gap-14 ${
            photoLeft
              ? "md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
              : "md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
          }`}
        >
          {photoLeft ? photo : copy}
          {photoLeft ? copy : photo}
        </div>
      ) : (
        <div className="mx-auto max-w-3xl">{copy}</div>
      )}
    </section>
  );
}
