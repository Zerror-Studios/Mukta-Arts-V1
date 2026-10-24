/**
 * Mukta Arts — single source of truth for SEO.
 * Every canonical, OG URL, sitemap entry and schema @id is built from SITE_URL.
 * Never hard-code the Vercel staging address anywhere again.
 */
export const SITE_URL = "https://www.muktaarts.com";

export const SITE = {
  name: "Mukta Arts",
  legalName: "Mukta Arts Limited",
  locale: "en_IN",
  lang: "en-IN",
  foundingDate: "1978",
  logo: `${SITE_URL}/img/logo/logo-4k.png`,
  ogImage: `${SITE_URL}/opengraph-image`,
  emails: {
    scripts: "pitch@muktaarts.com",
    hr: "hr@muktaarts.com",
    investors: "investorrelations@muktaarts.com",
  },
  address: {
    streetAddress:
      "3rd Floor, Mukta House, Behind Whistling Woods International, Film City Complex, Aarey Milk Colony, Goregaon (East)",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    postalCode: "400065",
    addressCountry: "IN",
  },
  social: {
    instagram: "https://www.instagram.com/muktaartsltd/",
    linkedin: "https://www.linkedin.com/in/muktaartsltd/",
    youtube: "https://www.youtube.com/muktaarts",
    facebook: "https://www.facebook.com/MuktaArts/",
  },
  wikipedia: {
    muktaArts: "https://en.wikipedia.org/wiki/Mukta_Arts",
    subhashGhai: "https://en.wikipedia.org/wiki/Subhash_Ghai",
    wwi: "https://en.wikipedia.org/wiki/Whistling_Woods_International",
    a2: "https://en.wikipedia.org/wiki/Mukta_A2_Cinemas",
  },
  external: {
    wwi: "https://www.whistlingwoods.net/",
    a2: "https://muktaa2cinemas.in/",
  },
  // Filled from env so no code change is needed once the client shares the IDs.
  gaId: process.env.NEXT_PUBLIC_GA_ID, // e.g. G-XXXXXXXXXX
  googleVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION, // only if using the HTML-tag method
  bingVerification: process.env.NEXT_PUBLIC_BING_VERIFICATION,
};

export const abs = (path = "/") =>
  path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
