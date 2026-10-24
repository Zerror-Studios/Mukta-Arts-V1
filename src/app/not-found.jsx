import Button from "@/components/common/Button";
import { noindexMetadata } from "@/lib/seo/metadata";

// Next adds <meta name="robots" content="noindex"> to a 404 itself, so no second robots tag here
export const metadata = { ...noindexMetadata("Page not found"), robots: null };

// Somewhere to go next, for lost visitors and for old-site URLs that no longer exist
const LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Productions", href: "/our-films" },
  { label: "Submit Script", href: "/submit-script" },
];

export default function NotFound() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center gap-10 px-6 py-32 text-center bg-[#FAFAFA] text-[#1B123D]">
      <h1 className="text-4xl sm:text-6xl">404 - Page Not Found</h1>
      <nav aria-label="Suggested pages" className="flex flex-wrap justify-center gap-4">
        {LINKS.map(({ label, href }) => (
          <Button key={href} href={href}>
            {label}
          </Button>
        ))}
      </nav>
    </section>
  );
}
