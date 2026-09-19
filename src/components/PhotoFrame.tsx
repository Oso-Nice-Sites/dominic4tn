import Image from "next/image";
import type { Photo } from "@/content/site";

// Green-bordered rounded frame with an orange offset shadow, per the reference.
// `alt` is required: descriptions for every image are part of the accessibility scope.
export function PhotoFrame({ photo, className = "" }: { photo: Photo; className?: string }) {
  return (
    <div
      className={`relative aspect-[4/5] w-full overflow-hidden rounded-xl border-4 border-forest-700 bg-cream-200 shadow-[8px_8px_0_var(--color-orange-500)] ${className}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(min-width: 768px) 40vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}
