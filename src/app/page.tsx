import { ButtonLink } from "@/components/ButtonLink";
import { PhotoFrame } from "@/components/PhotoFrame";
import { SectionHeading } from "@/components/SectionHeading";
import { GET_INVOLVED_FORMS_LIVE, home, homePhotos, site } from "@/content/site";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        className="flag-bg slant-bottom on-dark relative text-cream-50"
      >
        <div className="mx-auto max-w-5xl px-4 pt-16 text-center sm:px-6 sm:pt-24">
          <p className="font-script text-3xl font-bold leading-none text-orange-500">
            {home.hero.eyebrow}
          </p>
          <h1
            id="hero-heading"
            className="mt-5 font-display text-[clamp(2.75rem,8vw,6rem)] font-bold uppercase leading-[0.95]"
          >
            {home.hero.headline[0]}{" "}
            <span className="text-orange-500">{home.hero.headline[1]}</span>
            <br />
            {home.hero.headline[2]}
          </h1>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink href={site.donateUrl} className="w-full sm:w-auto sm:!px-10 sm:!py-4">
              Donate Today
            </ButtonLink>
            <ButtonLink
              href="/#about"
              variant="outline-dark"
              className="w-full sm:w-auto sm:!px-10 sm:!py-4"
            >
              Meet Dominic
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Meet Dominic */}
      <section id="about" aria-labelledby="meet-heading" className="px-4 py-16 sm:px-6 sm:py-24">
        <div
          className={
            homePhotos.meet
              ? "mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-14"
              : "mx-auto max-w-3xl"
          }
        >
          {homePhotos.meet && (
            <PhotoFrame photo={homePhotos.meet} className="mx-auto max-w-sm md:max-w-none" />
          )}
          <div>
            <SectionHeading id="meet-heading">{home.meet.heading}</SectionHeading>
            <div className="mt-8 space-y-5 text-lg text-ink-soft">
              {home.meet.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section
        aria-label="In Dominic's words"
        className="on-dark bg-forest-800 px-4 py-16 text-cream-50 sm:px-6 sm:py-20"
      >
        <figure className="mx-auto max-w-4xl text-center">
          <blockquote className="font-display text-2xl font-medium leading-snug sm:text-4xl">
            <p>“{home.quote.text}”</p>
          </blockquote>
          <figcaption className="mt-6 font-script text-3xl font-bold text-orange-400">
            — {home.quote.attribution}
          </figcaption>
        </figure>
      </section>

      {/* Why I'm running */}
      <section aria-labelledby="why-heading" className="px-4 py-16 sm:px-6 sm:py-24">
        <div
          className={
            homePhotos.why
              ? "mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-14"
              : "mx-auto max-w-3xl"
          }
        >
          <div>
            <SectionHeading id="why-heading">{home.why.heading}</SectionHeading>
            <p className="mt-8 rounded-lg border-2 border-forest-700 bg-mint-100 p-6 text-lg text-ink sm:p-8">
              {home.why.body}
            </p>
          </div>
          {homePhotos.why && (
            <PhotoFrame photo={homePhotos.why} className="mx-auto max-w-sm md:max-w-none" />
          )}
        </div>
      </section>

      {/* At a glance */}
      <section
        aria-labelledby="glance-heading"
        className="on-dark bg-navy-900 px-4 py-14 text-cream-50 sm:px-6 sm:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <h2 id="glance-heading" className="sr-only">
            {home.glance.heading}
          </h2>
          <dl className="grid gap-10 text-center md:grid-cols-3 md:gap-6">
            {home.glance.stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-6xl font-bold leading-none text-orange-500 sm:text-7xl">
                  {s.value}
                </dt>
                <dd className="mx-auto mt-3 max-w-[16rem] text-base uppercase tracking-wide text-cream-100">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Priorities */}
      <section
        id="priorities"
        aria-labelledby="priorities-heading"
        className="bg-cream-100 px-4 py-16 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading id="priorities-heading" center>
            {home.priorities.heading}
          </SectionHeading>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {home.priorities.items.map((item) => (
              <li
                key={item.topic}
                className="flex flex-col rounded-lg border-t-[6px] border-orange-500 bg-white p-7 shadow-sm ring-1 ring-cream-200"
              >
                <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-forest-700">
                  {item.topic}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-4 text-ink-soft">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Get involved — wrapper matches Priorities' cream so the slanted top edge blends in */}
      <div className="bg-cream-100">
        <section
          id="get-involved"
          aria-labelledby="involved-heading"
          className="flag-bg slant-top on-dark px-4 pb-20 text-center text-cream-50 sm:px-6 sm:pb-24"
        >
          <div className="mx-auto max-w-3xl">
            <SectionHeading id="involved-heading" dark center size="lg">
              {home.getInvolved.heading}
            </SectionHeading>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-cream-100">
              {home.getInvolved.body}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {GET_INVOLVED_FORMS_LIVE && (
                <>
                  <ButtonLink href="/yard-signs" className="w-full sm:w-auto">
                    Request a Yard Sign
                  </ButtonLink>
                  <ButtonLink href="/volunteer" variant="outline-dark" className="w-full sm:w-auto">
                    Volunteer
                  </ButtonLink>
                </>
              )}
              <ButtonLink
                href={site.donateUrl}
                variant={GET_INVOLVED_FORMS_LIVE ? "outline-dark" : "primary"}
                className="w-full sm:w-auto"
              >
                Donate
              </ButtonLink>
              {!GET_INVOLVED_FORMS_LIVE && (
                <ButtonLink
                  href={`mailto:${site.email}`}
                  variant="outline-dark"
                  className="w-full sm:w-auto"
                >
                  Email the Campaign
                </ButtonLink>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
