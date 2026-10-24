/**
 * Google Analytics 4. Renders nothing until NEXT_PUBLIC_GA_ID is set in Vercel env vars.
 * Requires: npm i @next/third-parties
 * Place <Analytics /> once, at the end of <body> in app/layout.js.
 */
import { GoogleAnalytics } from "@next/third-parties/google";
import { SITE } from "@/lib/seo/site";

export default function Analytics() {
  if (!SITE.gaId || process.env.VERCEL_ENV !== "production") return null;
  return <GoogleAnalytics gaId={SITE.gaId} />;
}
