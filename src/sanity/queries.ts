import { defineQuery } from "next-sanity";

// GROQ queries. Page links are resolved here so components only ever see a
// plain `href`. A link to an unpublished page resolves to null and is dropped.

const link = /* groq */ `
  _key,
  label,
  "href": select(
    defined(page) => select(page->slug.current == "home" => "/", "/" + page->slug.current),
    url
  )
`;

const image = /* groq */ `image{ alt, asset, crop, hotspot }`;

const sections = /* groq */ `
  sections[]{
    _key,
    _type,
    anchorId,
    _type == "heroSection" => {
      eyebrow, headline, highlight,
      primaryCta{ ${link} },
      secondaryCta{ ${link} }
    },
    _type == "textSection" => { heading, body, variant, imagePosition, ${image} },
    _type == "quoteSection" => { quote, attribution },
    _type == "statsSection" => { heading, stats[]{ _key, value, label } },
    _type == "cardsSection" => { heading, cards[]{ _key, topic, title, body } },
    _type == "ctaSection" => { heading, body, buttons[]{ ${link}, style } }
  }
`;

export const pageQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    description,
    ${sections}
  }
`);

export const pageSlugsQuery = defineQuery(`
  *[_type == "page" && defined(slug.current)].slug.current
`);

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    name, office, tagline, email, phone, donateUrl, disclaimer,
    navigation[]{ ${link} },
    footerLinks[]{ ${link} }
  }
`);
