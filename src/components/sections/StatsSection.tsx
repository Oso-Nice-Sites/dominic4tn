import type { StatsSection as StatsData } from "@/sanity/types";

export function StatsSection({ section }: { section: StatsData }) {
  const headingId = `${section._key}-heading`;
  const stats = section.stats ?? [];

  return (
    <section
      id={section.anchorId ?? undefined}
      aria-labelledby={headingId}
      className="on-dark bg-navy-900 px-4 py-14 text-cream-50 sm:px-6 sm:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <h2 id={headingId} className="sr-only">
          {section.heading || "At a glance"}
        </h2>
        <dl
          className={`grid gap-10 text-center md:gap-6 ${
            stats.length >= 3 ? "md:grid-cols-3" : stats.length === 2 ? "md:grid-cols-2" : ""
          }`}
        >
          {stats.map((stat) => (
            <div key={stat._key}>
              <dt className="font-display text-6xl font-bold leading-none text-orange-500 sm:text-7xl">
                {stat.value}
              </dt>
              <dd className="mx-auto mt-3 max-w-[16rem] text-base uppercase tracking-wide text-cream-100">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
