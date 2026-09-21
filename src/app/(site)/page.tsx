import type { Metadata } from "next";
import { defaultPages } from "@/content/defaults";
import { PageSections } from "@/components/sections/PageSections";
import { getPage } from "@/sanity/content";

// The Home page is the CMS page whose address is "home".
async function getHome() {
  return (await getPage("home")) ?? defaultPages.home;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHome();
  return { description: page.description ?? undefined };
}

export default async function Home() {
  const page = await getHome();
  return <PageSections sections={page.sections} isHome />;
}
