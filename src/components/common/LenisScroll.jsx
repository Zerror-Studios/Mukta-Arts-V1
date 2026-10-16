"use client";
import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/motion";
import { isScrollLocked } from "@/lib/scrollLock";

export default function LenisScroll({ children }) {
  const lenis = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (lenis.current) lenis.current.scrollTo(0, { immediate: true });
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reduced motion: leave the browser's own scrolling alone
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      lerp: 0.05, // how much of the remaining distance each frame covers; lower glides longer
      wheelMultiplier: 0.7,
      smoothWheel: true,
      // Touch is eased too, so phones and tablets glide like the wheel and the scrubbed
      // sections stay in step with the finger instead of the browser's own momentum
      syncTouch: true,
      syncTouchLerp: 0.08,
      touchInertiaExponent: 1.5,
      gestureOrientation: "vertical",
      anchors: true, // in-page #links glide through Lenis as well
      autoRaf: false, // driven by GSAP's ticker below
    });

    lenis.current = instance;
    window.lenis = instance;

    // The home intro locks scrolling before Lenis exists; it restarts it when done
    if (isScrollLocked()) instance.stop();

    // Sync Lenis with GSAP ScrollTrigger
    instance.on("scroll", ScrollTrigger.update);

    // Use GSAP's ticker for Lenis's raf for perfect sync with GSAP animations
    const raf = (time) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(raf);

    gsap.ticker.lagSmoothing(0);

    // Lenis watches the page's size itself (autoResize), so no resize listener is needed

    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      lenis.current = null;
      window.lenis = null;
    };
  }, []);

  return <>{children}</>;
}
