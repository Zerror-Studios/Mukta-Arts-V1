import { noindexMetadata } from "@/lib/seo/metadata";

// The page itself is a client component, so its metadata lives here.
export const metadata = noindexMetadata("Under Development");

export default function UnderDevelopmentLayout({ children }) {
  return children;
}
