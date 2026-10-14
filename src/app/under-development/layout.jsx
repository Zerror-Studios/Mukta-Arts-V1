import { createPageMetadata } from "@/lib/seo";

// The page itself is a client component, so its metadata lives here.
export async function generateMetadata(_props, parent) {
  return createPageMetadata("/under-development", await parent);
}

export default function UnderDevelopmentLayout({ children }) {
  return children;
}
