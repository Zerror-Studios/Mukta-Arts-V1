import { preload } from "react-dom";
import "../styles/globals.css";
import "../styles/fonts.css";
import SiteLayout from "@/components/common/SiteLayout";
import Noise from "@/components/common/Noise";
import { createRootMetadata } from "@/lib/seo";

export const experimental = {
  viewTransition: true,
};

export default function RootLayout({ children }) {
  // The body and heading faces (SwitzerR, SwitzerSB) every page uses: fetched with the HTML,
  // not once the stylesheet has been read, so the text settles into them sooner
  preload("/fonts/Switzer-Regular.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/fonts/Switzer-Semibold.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* <Noise /> */}
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}

export const metadata = createRootMetadata();
