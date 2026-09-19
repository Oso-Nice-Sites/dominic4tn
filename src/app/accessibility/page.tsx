import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/LegalPlaceholder";

export const metadata: Metadata = { title: "Accessibility Statement" };

export default function AccessibilityPage() {
  return <LegalPlaceholder title="Accessibility Statement" />;
}
