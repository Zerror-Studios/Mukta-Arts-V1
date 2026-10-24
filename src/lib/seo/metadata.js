import { SITE, abs } from "./site";

/**
 * Final, approved titles and descriptions. Do not edit lengths without re-checking (title 45-62, description 120-165).
 * Each entry: { path, title, description, ogTitle, ogDescription, noindexUntilLive? }
 */
export const PAGES = {
  home: { path: "/", title: "Mukta Arts Ltd | Subhash Ghai's Film & Entertainment Group", description: "Founded by Subhash Ghai in 1978, Mukta Arts is the group behind Karz, Ram Lakhan and Pardes, Whistling Woods International, Mukta A2 Cinemas and SGM Studios.", ogTitle: "Mukta Arts | Telling stories across screens, classrooms and theatres", ogDescription: "The Subhash Ghai group spanning film production, Whistling Woods International, Mukta A2 Cinemas and SGM Studios. Since 1978." },
  about: { path: "/about", title: "About Mukta Arts | Legacy, Board & Investor Relations", description: "Mukta Arts was founded by Subhash Ghai in 1978 and became India's first listed film studio. See our milestones, board of directors and investor documents.", ogTitle: "About Mukta Arts | Since 1978", ogDescription: "From Karz to Whistling Woods: the milestones, leadership and investor information of Mukta Arts Limited." },
  subhashGhai: { path: "/subhash-ghai", title: "Subhash Ghai | Filmmaker, Showman & Founder of Mukta Arts", description: "Subhash Ghai has written and directed 19 films including Karz, Hero, Ram Lakhan, Saudagar and Taal, and founded Mukta Arts and Whistling Woods International.", ogTitle: "Subhash Ghai | The Showman of Hindi Cinema", ogDescription: "Five decades across cinema, education and entrepreneurship: the films, firsts and honours of Subhash Ghai." },
  ourFilms: { path: "/our-films", title: "Mukta Arts Films | Karz, Ram Lakhan, Pardes, Taal & More", description: "Explore 50+ films from the house of Mukta Arts and Subhash Ghai, from Kalicharan and Karz to Khalnayak, Pardes, Taal, National Award winner Iqbal and more.", ogTitle: "Mukta Arts Productions | 50+ Films", ogDescription: "Karz, Hero, Ram Lakhan, Khalnayak, Pardes, Taal, Iqbal and more: the films of Mukta Arts." },
  whistlingWoods: { path: "/whistling-woods", title: "Whistling Woods International | Subhash Ghai's Film School", description: "Whistling Woods International, founded by Subhash Ghai in 2006 at Film City, Mumbai, offers degrees in filmmaking, acting, animation, design, media and music.", ogTitle: "Whistling Woods International | Film City, Mumbai", ogDescription: "India's premier institute for film, communication and creative arts, founded by Subhash Ghai in 2006." },
  muktaA2Cinemas: { path: "/mukta-a2-cinemas", title: "Mukta A2 Cinemas | Affordable Multiplexes Across India", description: "Mukta A2 Cinemas, the exhibition arm of Mukta Arts, runs affordable cinemas across India, from Mumbai's New Excelsior to Hyderabad, Bahrain and Saudi Arabia.", ogTitle: "Mukta A2 Cinemas | The Big Screen, Closer to You", ogDescription: "Quality cinema at accessible prices, across India and the Middle East. The exhibition arm of Mukta Arts." },
  sgmStudios: { path: "/sgm-studios", title: "SGM Studios | Animation & Original IP by Mukta Arts", description: "SGM Studios is the animation and visual storytelling arm of Mukta Arts, creating original, culturally rooted IP for film, series and new-age entertainment.", ogTitle: "SGM Studios | Animation by Mukta Arts", ogDescription: "Original, culturally rooted animated worlds and characters from the house of Mukta Arts." },
  submitScript: { path: "/submit-script", title: "Submit Your Script to Mukta Arts | Screenplay Submissions", description: "Writers can submit an original, SWA-registered feature film or web series screenplay to Mukta Arts online, with a logline, synopsis and pitch deck.", ogTitle: "Submit Your Script to Mukta Arts", ogDescription: "Have an original, SWA-registered screenplay? Submit it to the Mukta Arts creative team." },
  privacyPolicy: { path: "/privacy-policy", title: "Privacy Policy | Mukta Arts Limited", description: "How Mukta Arts Limited collects, uses and protects personal information shared through muktaarts.com, including script submissions and enquiries.", ogTitle: "Privacy Policy | Mukta Arts Limited", ogDescription: "How Mukta Arts Limited collects, uses and protects personal information shared through muktaarts.com, including script submissions and enquiries.", noindexUntilLive: true },
  termsAndConditions: { path: "/terms-and-conditions", title: "Terms and Conditions | Mukta Arts Limited", description: "The terms that govern use of muktaarts.com, including the conditions that apply when you submit a screenplay or other material to Mukta Arts.", ogTitle: "Terms and Conditions | Mukta Arts Limited", ogDescription: "The terms that govern use of muktaarts.com, including the conditions that apply when you submit a screenplay or other material to Mukta Arts.", noindexUntilLive: true },
};

/** Use in each route: export const metadata = buildMetadata(PAGES.about); */
export function buildMetadata(p) {
  const url = abs(p.path);
  return {
    title: { absolute: p.title },
    description: p.description,
    alternates: { canonical: url },
    robots: p.noindexUntilLive ? { index: false, follow: true } : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    openGraph: { type: "website", url, siteName: SITE.name, locale: SITE.locale, title: p.ogTitle, description: p.ogDescription, images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: p.ogTitle }] },
    twitter: { card: "summary_large_image", title: p.ogTitle, description: p.ogDescription, images: [SITE.ogImage] },
  };
}

/**
 * Hidden/draft routes that are not in PAGES (/contact, /wd, /work-in-progress, /under-development) and the 404:
 * a plain title, kept out of search results and the sitemap. The nulls stop them inheriting the home page's
 * description, canonical and share card from the root layout.
 */
export function noindexMetadata(title) {
  return {
    title: { absolute: `${title} | ${SITE.name}` },
    description: null,
    alternates: null,
    openGraph: null,
    twitter: null,
    robots: { index: false, follow: true },
  };
}
