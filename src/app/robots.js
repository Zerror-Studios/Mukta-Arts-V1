import { SITE_URL } from "@/lib/seo/site";

/**
 * Served at /robots.txt.
 * AI crawlers are explicitly allowed so Mukta Arts can be found and cited in ChatGPT, Claude, Perplexity,
 * Gemini / Google AI Overviews and Copilot answers.
 * /api/ is blocked (script-submission endpoints should never be crawled).
 */
const AI_BOTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",        // OpenAI
  "ClaudeBot", "Claude-SearchBot", "Claude-User",   // Anthropic
  "PerplexityBot", "Perplexity-User",               // Perplexity
  "Google-Extended",                                 // Gemini / AI Overviews
  "Applebot", "Applebot-Extended",                   // Apple
  "Bingbot",                                         // Bing + Copilot
  "CCBot",                                           // Common Crawl
];

export default function robots() {
  // Never let a preview or staging deployment be indexed.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: "/", disallow: ["/api/"] })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
