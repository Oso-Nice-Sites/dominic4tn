import Image from "next/image";

// Green-bordered rounded frame with an orange offset shadow, per the reference.
// `alt` is required: descriptions for every image are part of the accessibility scope.
// Images come from Sanity's CDN, which already resizes and compresses them, so
// Next's own optimizer is skipped (`unoptimized`).
export function PhotoFrame({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[4/5] w-full overflow-hidden rounded-xl border-4 border-forest-700 bg-cream-200 shadow-[8px_8px_0_var(--color-orange-500)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="(min-width: 768px) 40vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}
