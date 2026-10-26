/**
 * Old muktaarts.com (PHP site) -> new site.
 * The old site had ~1,700 URLs in Google (news articles, galleries, film pages, investor pages).
 * Rule-based instead of a giant table, so every old URL (including ones we never saw) lands somewhere sensible.
 * Test list with expected results: scripts/legacy-redirects-test.csv (run: node scripts/test-legacy-redirects.mjs)
 *
 * Returns: a new path, the number 410 (gone: old images), or null (not an old URL, let Next handle it).
 */
const FILMS = new Set([
  "kalicharan", "vishwanath", "gautam govinda", "karz", "krodhi", "vidhaata", "hero", "meri jung", "karma",
  "uttar dakshin", "ram lakhan", "saudagar", "prem deewane", "pyar ki ganga bahe", "khalnayak", "trimurti",
  "jaan", "pardes", "shyam ghanshyam", "taal", "rahul", "yaadein", "badhaai ho badhaai", "ek aur ek gyarah",
  "jogger's park", "aitraaz", "kisna", "iqbal", "shaadi se pehle", "36 china town", "apna sapna money money",
  "good boy bad boy", "bombay to bangkok", "valu", "black and white", "sanai choughade", "yuvvraaj",
  "paying guests", "right yaaa wrong", "hello darling", "kashmakash", "nouka dubi", "love express",
  "cycle kick", "samhita", "nimbehuli", "kaanchi", "double di trouble", "vijeta", "36 farmhouse",
  "tu me ani amaira",
]);

// The film's new page is /our-films/<slug>, with the slugs as set in Sanity (scripts/seed-films.mjs).
// Renaming a slug in the studio breaks its redirect here, so the two have to change together.
const FILM_SLUG_EXCEPTIONS = { "kashmakash": "nouka-dubi" };
const filmSlug = (name) => FILM_SLUG_EXCEPTIONS[name] || name.replace(/'/g, "").replace(/ /g, "-");

// A news story naming exactly one of these films goes to that film's page; any other film story to the list.
// Kept short on purpose: names like "hero" or "rahul" are common words and would pull in unrelated stories.
const STORY_FILMS = {
  "jaanki": /jaana?ki/, "36-farmhouse": /36 farmhouse/, "khalnayak": /khalnayak/, "karma": /\bkarma\b/,
  "pardes": /pardes/, "karz": /\bkarz\b/, "ram-lakhan": /ram lakhan/, "tu-me-ani-amaira": /amaira/,
  "vijeta": /vijeta/, "taal": /\btaal\b/, "yaadein": /yaadein/,
};

const IR_KEYS = [
  "investorsrelation", "annual-reports", "annual-returns", "board-meetings", "shareholding-pattern",
  "corporate-governance", "secretarial-compliance", "related-party", "postal-ballots", "members-meetings",
  "members-information", "stock exchange intimations", "disclosures under regulation", "unpaid-dividend",
  "aboutus/investorrelations", "aboutus/cfo",
];

const OLD_DIRS = [
  "/aboutus/", "/movies/", "/education/", "/network/", "/media/", "/media-speaks/", "/archive/", "/images/",
  "/sg-gallery/", "/sg-celebrities/", "/subhash-ghai/", "/flashback-subhash-ghai/", "/flashback-mukta-arts-ltd/",
  "/investorsrelation/", "/contact/", "/connect1", "/music-videos/",
];

export function normaliseLegacyPath(raw) {
  let p = raw;
  try { p = decodeURIComponent(raw); } catch { /* keep raw */ }
  p = p.toLowerCase().replace(/&amp;/g, "&");
  while (p.includes("/../")) p = p.replace("/../", "/");
  p = p.replace(/\/+/g, "/");
  if (p.length > 1) p = p.replace(/\/$/, "");
  return p || "/";
}

/** True only for URLs shaped like the old site, so the proxy never touches new routes or assets. */
export function isLegacyPath(pathname) {
  const n = normaliseLegacyPath(pathname);
  if (/\.(php|html?)$/.test(n)) return true;
  if (OLD_DIRS.some((d) => n.startsWith(d))) return true;
  return false;
}

export function legacyDestination(pathname) {
  if (!isLegacyPath(pathname)) return null;
  const n = normaliseLegacyPath(pathname);
  const spaced = n.replace(/-/g, " ");

  if (n === "/index.php" || n === "/index.html" || n === "/index.htm") return "/";
  if (n.startsWith("/images/") || n.includes("/thumbs/") || /\.(jpe?g|png|gif|webp)$/.test(n)) return 410;
  if (IR_KEYS.some((k) => n.includes(k)) || /\.(pdf|docx?)$/.test(n)) return "/about#investor-relations";
  if (n.startsWith("/aboutus/") || n.startsWith("/rahul-puri") || n.startsWith("/achievements") || n.includes("we believe that less")) return "/about";

  const base = n.split("/").pop().replace(/\.php$/, "").replace(/-/g, " ");
  if (FILMS.has(base)) return `/our-films/${filmSlug(base)}`;
  if (n.startsWith("/movies/")) return "/our-films";
  if (n.startsWith("/education/") || /whistling|wwi|convocation|5th veda|tiss|scholarship/.test(n)) return "/whistling-woods";
  if (n.startsWith("/network/exhibition") || /mukta ?a2|muktaa2|a2 cinema|cinemas a2|cinemas? (opens|re opens|reopens)/.test(spaced)) return "/mukta-a2-cinemas";
  if (/sgm|animation/.test(n)) return "/sgm-studios";
  if (n.startsWith("/contact") || n.startsWith("/connect1")) return "/submit-script";
  if (/^\/(subhash-ghai|sg-gallery|sg-celebrities|flashback-subhash-ghai|music-videos)/.test(n) || n.includes("subhash")) return "/subhash-ghai";
  const named = Object.keys(STORY_FILMS).filter((slug) => STORY_FILMS[slug].test(spaced));
  if (named.length === 1) return `/our-films/${named[0]}`;
  if (named.length || /film/.test(spaced)) return "/our-films";
  return "/about";
}
