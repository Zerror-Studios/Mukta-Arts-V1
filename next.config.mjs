/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    // AVIF for browsers that take it (most do; it is usually well under WebP's size), WebP for the rest
    formats: ["image/avif", "image/webp"],
    // Film posters uploaded in the Sanity studio
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async redirects() {
    return [
      {
        // Investor Relations documents uploaded in the studio. The page links to this site's own address, which
        // hands the browser straight to the Sanity CDN. A redirect, not a rewrite: a rewrite passed every file
        // through the site's server, and on Amplify anything over about 4.5 MB came back as 413 Payload Too Large.
        // This way no file size is too big. Query strings carry over, so ?dl= (download) still works.
        // Project ID and dataset as in src/sanity/env.js.
        source: "/investor-relations/files/:file",
        destination: "https://cdn.sanity.io/files/golvykos/production/:file",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        // The font files never change, so browsers can keep them instead of asking again on every visit
        source: "/fonts/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
