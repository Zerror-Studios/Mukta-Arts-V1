import { PAGES } from "@/lib/seo/metadata";
import { abs } from "@/lib/seo/site";
import { getFilmSlugs } from "@/sanity/lib/queries";

/**
 * Served at /sitemap.xml.
 * Pages flagged noindexUntilLive (Privacy, T&C) are left out until they exist:
 * when they go live, delete `noindexUntilLive: true` in lib/seo/metadata.js and they appear here automatically.
 * LASTMOD: bump the date of a page when its content actually changes. Do not use new Date() (it changes on every deploy and Google learns to ignore it).
 */
const LASTMOD = "2026-10-24";

const SETTINGS = {
  "/": { changeFrequency: "weekly", priority: 1.0 },
  "/about": { changeFrequency: "monthly", priority: 0.9 },
  "/subhash-ghai": { changeFrequency: "monthly", priority: 0.9 },
  "/our-films": { changeFrequency: "monthly", priority: 0.9 },
  "/whistling-woods": { changeFrequency: "monthly", priority: 0.8 },
  "/mukta-a2-cinemas": { changeFrequency: "monthly", priority: 0.8 },
  "/sgm-studios": { changeFrequency: "monthly", priority: 0.7 },
  "/submit-script": { changeFrequency: "monthly", priority: 0.7 },
  "/privacy-policy": { changeFrequency: "yearly", priority: 0.3 },
  "/terms-and-conditions": { changeFrequency: "yearly", priority: 0.3 },
};

// Built on every request so a film added in the studio is listed straight away
export const dynamic = "force-dynamic";

export default async function sitemap() {
  const pages = Object.values(PAGES)
    .filter((p) => !p.noindexUntilLive)
    .map((p) => ({
      url: abs(p.path),
      lastModified: LASTMOD,
      ...SETTINGS[p.path],
    }));

  // Film detail pages; their last edit in Sanity is a real content change, so it is safe as lastmod
  const films = (await getFilmSlugs()).map((film) => ({
    url: abs(`/our-films/${film.slug}`),
    lastModified: film._updatedAt.slice(0, 10),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pages, ...films];
}
