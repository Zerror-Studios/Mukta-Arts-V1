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
