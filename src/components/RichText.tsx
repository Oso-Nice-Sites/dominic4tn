import { PortableText, type PortableTextComponents } from "next-sanity";
import type { Body } from "@/sanity/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h3: ({ children }) => (
      <h3 className="font-display text-2xl font-bold uppercase leading-tight text-forest-800">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc space-y-2 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const external = /^https?:\/\//i.test(href);
      return (
        <a
          href={href}
          className="font-semibold text-forest-700 underline underline-offset-4 hover:text-forest-800"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
          {external && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      );
    },
  },
};

/** Rich text from the CMS, spaced and styled to match the site. */
export function RichText({ value, className = "" }: { value: Body; className?: string }) {
  return (
    <div className={`space-y-5 ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  );
}
