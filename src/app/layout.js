import { preload } from "react-dom";
import "../styles/globals.css";
import "../styles/fonts.css";
import SiteLayout from "@/components/common/SiteLayout";
import Noise from "@/components/common/Noise";
import JsonLd from "@/components/seo/JsonLd";
import Analytics from "@/components/seo/Analytics";
import { SITE, SITE_URL } from "@/lib/seo/site";
import { buildMetadata, PAGES } from "@/lib/seo/metadata";
import siteSchema from "@/lib/seo/schema/site.json";

export const experimental = {
  viewTransition: true,
};

export default function RootLayout({ children }) {
  // The body and heading faces (SwitzerR, SwitzerSB) every page uses: fetched with the HTML,
  // not once the stylesheet has been read, so the text settles into them sooner
  preload("/fonts/Switzer-Regular.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/fonts/Switzer-Semibold.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <html lang={SITE.lang} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Site-wide entity graph (Corporation + WebSite); each page adds its own */}
        <JsonLd data={siteSchema} />
        {/* <Noise /> */}
        <SiteLayout>{children}</SiteLayout>
        <Analytics />
      </body>
    </html>
  );
}

export const metadata = {
  ...buildMetadata(PAGES.home),
  metadataBase: new URL(SITE_URL),
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName, url: SITE_URL }],
  publisher: SITE.legalName,
  formatDetection: { telephone: false, email: false, address: false },
  verification: {
    google: SITE.googleVerification, // only if the client uses the HTML-tag method
    other: SITE.bingVerification ? { "msvalidate.01": SITE.bingVerification } : undefined,
  },
  // Listing icons here replaces Next's file-based ones, so app/apple-icon.png is named too
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};
