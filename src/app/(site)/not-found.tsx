import { ButtonLink } from "@/components/ButtonLink";

export default function NotFound() {
  return (
    <div className="px-4 py-24 text-center sm:px-6 sm:py-32">
      <h1 className="font-display text-5xl font-bold uppercase leading-tight text-forest-800 sm:text-6xl">
        Page not found
      </h1>
      <p className="mx-auto mt-5 max-w-md text-lg text-ink-soft">
        Sorry, we couldn’t find that page. It may have moved, or the address may have a typo.
      </p>
      <ButtonLink href="/" variant="solid-green" className="mt-9">
        Back to the home page
      </ButtonLink>
    </div>
  );
}
