"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import LenisScroll from "@/components/common/LenisScroll";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { ScrollTrigger } from "@/lib/motion";
import { ViewTransitions } from "next-view-transitions";

export default function SiteLayout({ children }) {
  const pathname = usePathname();


  useEffect(() => {
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
      if (window.lenis) {
        window.lenis.resize();
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [pathname]);

  // Sanity Studio (/admin and its sub-routes) fills the screen and scrolls its own panes, so it
  // gets none of the site's header, footer or Lenis scrolling (which would swallow the wheel)
  if (pathname.startsWith('/admin')) return children;

  return (
    <ViewTransitions>
      <LenisScroll>
        <header>
          <Header />
        </header>

        <main>
          {children}
        </main>

        {pathname !== '/under-development' && (
          <footer>
            <Footer />
          </footer>
        )}
      </LenisScroll>
    </ViewTransitions>

  );
}
