"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import LenisScroll from "@/components/common/LenisScroll";
import Loader from "@/components/common/Loader";
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

  return (
    <ViewTransitions>
      <LenisScroll>
        <Loader />

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
