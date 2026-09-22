// The h1 for pages other than Home (Home's h1 is its hero headline).
export function PageTitle({ title }: { title: string }) {
  return (
    <div className="px-4 pt-16 sm:px-6 sm:pt-24">
      <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold uppercase leading-tight text-forest-800 sm:text-5xl">
        {title}
      </h1>
    </div>
  );
}
