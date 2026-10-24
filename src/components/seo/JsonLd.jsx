/**
 * Renders one JSON-LD <script>. Server component, no client JS.
 * Usage:
 *   import siteSchema from "@/lib/seo/schema/site.json";      // in app/layout.js (every page)
 *   import pageSchema from "@/lib/seo/schema/about.json";     // in the route's page.jsx
 *   <JsonLd data={pageSchema} />
 */
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: the data is static and authored by us.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
