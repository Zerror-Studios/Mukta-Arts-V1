import "../styles/globals.css";
import "../styles/fonts.css";
import { preload } from "react-dom";
import SiteLayout from "@/components/common/SiteLayout";
import Noise from "@/components/common/Noise";
import { createRootMetadata } from "@/lib/seo";

export const experimental = {
  viewTransition: true,
};

// Runs before first paint: decides whether this visit gets the intro loader
// (first visit in the session, or a reload; never with reduced motion).
const introScript = `(function(){try{var d=document.documentElement,m=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches,n=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0],r=n&&n.type==='reload',s=sessionStorage.getItem('mukta-intro');if(!m&&(!s||r)){d.classList.add('intro-active');window.__MUKTA_INTRO__=true;}}catch(e){}})();`;

export default function RootLayout({ children }) {
  preload("/img/sg/HeadLogo.png", { as: "image", fetchPriority: "high" });

  return (
    // The intro script adds a class to <html> before hydration
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body suppressHydrationWarning>
        <Noise />
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}

export const metadata = createRootMetadata();
