// Canonical origin for metadata, the sitemap and robots.txt.
// NEXT_PUBLIC_SITE_URL wins (set it once the client's own domain is live),
// then Vercel's production domain, then the current live build.
function resolveSiteUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "");
  const url = (fromEnv || "https://mukta-arts-v1.vercel.app").trim();
  const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;

  return withProtocol.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "Mukta Arts",
  description:
    "Mukta Arts is the vision of Subhash Ghai, one of India's most celebrated filmmakers, who founded the company in 1978. What started with landmark films like Karz, Ram Lakhan, Khalnayak and Pardes has grown into an entertainment group spanning production, education, exhibition and animation.",
  url: resolveSiteUrl(),
  locale: "en_IN",
  language: "en-IN",
  keywords: [
    "Mukta Arts",
    "Mukta Arts Limited",
    "Subhash Ghai",
    "Whistling Woods International",
    "Mukta A2 Cinemas",
    "SGM Studios",
    "Mukta Arts Productions",
    "Hindi films",
    "Indian cinema",
  ],
  contact: {
    phone: "",
    email: "investorrelations@muktaarts.com",
  },
  address: {
    street:
      "3rd Floor, Mukta House, Behind Whistling Woods International, Film City Complex, Aarey Milk Colony, Goregaon (East)",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400065",
    country: "IN",
  },
  socials: {
    instagram: "https://www.instagram.com/muktaartsltd/",
    linkedin: "https://www.linkedin.com/in/muktaartsltd/",
    youtube: "https://www.youtube.com/muktaarts",
    facebook: "https://www.facebook.com/MuktaArts/",
  },
};

const whistlingWoodsDescription =
  "Founded in 2006 by Subhash Ghai within Mumbai’s iconic Filmcity Complex, Whistling Woods International is a premier institute for filmmaking, media, communication and creative arts. Combining world-class education with hands-on industry experience, WWI has emerged as a global leader in media and entertainment education.";

const ourFilmsDescription =
  "For nearly five decades, Mukta Arts has brought powerful stories to the screen, creating some of Hindi cinema’s most enduring films.";

// One entry per route. `title` gets the root "%s | Mukta Arts" template;
// `{ absolute }` is used as is. Descriptions are copy already on the site.
// `noIndex` routes are kept out of search results and the sitemap.
export const siteRoutes = [
  {
    path: "/",
    title: {
      absolute:
        "Mukta Arts | Telling stories across screens, classrooms and theatres",
    },
    description: siteConfig.description,
    priority: 1,
  },
  {
    path: "/about",
    title: "About",
    description:
      "Building an enduring ecosystem for Indian entertainment by creating compelling stories, nurturing creative talent and bringing the magic of cinema to audiences across generations.",
    priority: 0.9,
  },
  {
    path: "/subhash-ghai",
    title: "Subhash Ghai",
    description:
      "A five-decade journey across cinema, education and entrepreneurship. From creating some of Indian cinema’s most enduring films to building institutions that shape the next generation of creative talent, Subhash Ghai’s vision has always extended beyond the screen.",
    priority: 0.8,
  },
  {
    path: "/our-films",
    title: "Mukta Arts Productions",
    description: ourFilmsDescription,
    priority: 0.8,
  },
  {
    path: "/whistling-woods",
    title: "Whistling Woods International",
    description: whistlingWoodsDescription,
    priority: 0.8,
  },
  {
    path: "/mukta-a2-cinemas",
    title: "Mukta A2 Cinemas",
    description:
      "Mukta A2 Cinemas is the exhibition arm of Mukta Arts, founded with a vision to make the big-screen experience accessible to audiences across India.",
    priority: 0.8,
  },
  {
    path: "/sgm-studios",
    title: "SGM Studios",
    description:
      "SGM Studios is Mukta Arts' animation and visual storytelling arm, built to carry the company's cinematic legacy into the world of animation and new-age entertainment.",
    priority: 0.7,
  },
  {
    path: "/submit-script",
    title: "Submit Script",
    description:
      "Submit your original screenplay to Mukta Arts and give your story the opportunity to be discovered and considered by our creative team.",
    priority: 0.6,
  },
  // Film detail view, opened from the film grid (content comes from the click).
  {
    path: "/work-in-progress",
    title: "Our Films",
    description: ourFilmsDescription,
    priority: 0.3,
    noIndex: true,
  },
  // Hidden draft of the Whistling Woods hero.
  {
    path: "/wd",
    title: "Whistling Woods International",
    description: whistlingWoodsDescription,
    priority: 0.3,
    noIndex: true,
  },
  {
    path: "/contact",
    title: "Contact",
    description: siteConfig.description,
    priority: 0.3,
    noIndex: true,
  },
  {
    path: "/under-development",
    title: "Under Development",
    description: siteConfig.description,
    priority: 0.3,
    noIndex: true,
  },
];
