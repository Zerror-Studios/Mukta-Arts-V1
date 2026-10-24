/**
 * Next.js 16 proxy (formerly middleware.js).
 *
 * 1. Any non-canonical host (the Vercel staging address, muktaarts.com without www) -> 301 to https://www.muktaarts.com, same path.
 *    (The apex redirect should ALSO be set in Vercel > Domains; this is a safety net.)
 * 2. Old PHP-site URLs -> 301 to the closest new page, or 410 for old images.
 * 3. Preview deployments get X-Robots-Tag: noindex, nofollow.
 */
import { NextResponse } from "next/server";
import { legacyDestination } from "@/lib/seo/legacy-redirects";

const CANONICAL_HOST = "www.muktaarts.com";

export function proxy(req) {
  const host = (req.headers.get("host") || "").toLowerCase();
  const url = req.nextUrl.clone();
  const isProduction = process.env.VERCEL_ENV === "production";

  // 1. Host canonicalisation (production deployment only, so preview URLs keep working for the team)
  if (isProduction && host && host !== CANONICAL_HOST && !host.startsWith("localhost")) {
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  // 2. Legacy URLs
  const dest = legacyDestination(req.nextUrl.pathname);
  if (dest === 410) {
    return new NextResponse("Gone", { status: 410, headers: { "X-Robots-Tag": "noindex" } });
  }
  if (dest) {
    const [path, hash] = dest.split("#");
    const to = new URL(path, `https://${CANONICAL_HOST}`);
    if (hash) to.hash = hash;
    return NextResponse.redirect(to, 301);
  }

  // 3. Preview deployments: never indexable
  const res = NextResponse.next();
  if (!isProduction) res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  // Skip Next internals and static files that the new site serves itself.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|apple-icon.png|opengraph-image|twitter-image|fonts/|img/|model/|investor-relations/).*)"],
};
