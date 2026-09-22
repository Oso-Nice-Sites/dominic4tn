import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/PageTitle";
import { PageSections } from "@/components/sections/PageSections";
import { getPage, getPageSlugs } from "@/sanity/content";
import { isStaticPreview } from "@/sanity/env";

// Any page created in the CMS is served here, at /<its web address>. Pages are
// looked up per request, so a page published in the Studio is live immediately.
// (The Home page is served by (site)/page.tsx, not here.)

type Props = { params: Promise<{ slug: string }> };

// Only the throwaway static preview (GitHub Pages export) needs its pages listed
// ahead of time. In a normal build this must be ABSENT: defining it, even
// returning [], makes Next treat the route as pre-generated, and per-request
// rendering then fails with DYNAMIC_SERVER_USAGE.
export const generateStaticParams = isStaticPreview
  ? async () => (await getPageSlugs()).filter((slug) => slug !== "home").map((slug) => ({ slug }))
  : undefined;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = slug === "home" ? null : await getPage(slug);
  if (!page) return {};
  return { title: page.title, description: page.description ?? undefined };
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const page = slug === "home" ? null : await getPage(slug);
  if (!page) notFound();

  return (
    <>
      <PageTitle title={page.title} />
      <PageSections sections={page.sections} />
    </>
  );
}
