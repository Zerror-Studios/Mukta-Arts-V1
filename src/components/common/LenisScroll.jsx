"use client";
import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/motion";

export default function LenisScroll({ children }) {
  const lenis = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (lenis.current) lenis.current.scrollTo(0, { immediate: true });
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // if (window.innerWidth < 1024) return

    const instance = new Lenis({
      smooth: !0,
      lerp: .05, // Lower lerp for smoother scroll
      wheelMultiplier: .7,
      gestureOrientation: "vertical",
      normalizeWheel: !1,
      smoothTouch: !1
    });

    lenis.current = instance;
    window.lenis = instance;

    // The first-visit loader restarts scrolling when it clears
    if (window.__MUKTA_INTRO__ === true) instance.stop();

    // Sync Lenis with GSAP ScrollTrigger
    instance.on('scroll', ScrollTrigger.update);

    // Use GSAP's ticker for Lenis's raf for perfect sync with GSAP animations
    const raf = (time) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(raf);

    gsap.ticker.lagSmoothing(0);

    const handleResize = () => {
      instance.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      gsap.ticker.remove(raf);
      window.removeEventListener("resize", handleResize);
      instance.destroy();
      lenis.current = null;
      window.lenis = null;
    };
  }, []);

  return <>{children}</>;
}
