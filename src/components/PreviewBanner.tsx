// Shown only on the GitHub Pages stakeholder preview (NEXT_PUBLIC_PREVIEW is set
// by next.config.ts for that build). Plain language for non-technical reviewers.
export function PreviewBanner() {
  if (process.env.NEXT_PUBLIC_PREVIEW !== "true") return null;

  return (
    <div role="note" className="bg-orange-500 px-4 py-2 text-center text-sm font-semibold text-ink">
      Draft preview for review — wording, photos and links are not final, and some pages are
      still to come.
    </div>
  );
}
