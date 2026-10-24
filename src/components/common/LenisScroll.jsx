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
      // Touch is left to the browser. Eased by Lenis (syncTouch), every swipe was cancelled and
      // replayed from JavaScript a frame at a time, so the page trailed the finger, the momentum
      // wasn't the phone's own, and any busy frame (the 3D canvases) stalled the scroll itself.
      // The browser scrolls touch off the main thread, so it stays smooth while the page works.
      // Lenis still follows that scroll, so ScrollTrigger and lenis.scrollTo keep working.
      // (Horizontal drags that must not turn into a pan opt out with touch-action: pan-y.)
      syncTouch: false,
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

    // Opened at a #section (e.g. /about#investor-relations, where the old site's investor pages
    // redirect): the browser's own jump happens before the pinned sections are laid out, so go to
    // the section again once the page has loaded and ScrollTrigger has measured it
    const hashId = decodeURIComponent(window.location.hash.slice(1));
    const goToHash = () =>
      requestAnimationFrame(() => {
        const target = hashId && document.getElementById(hashId);
        if (target) instance.scrollTo(target, { immediate: true, force: true });
      });
    if (hashId) {
      if (document.readyState === "complete") goToHash();
      else window.addEventListener("load", goToHash, { once: true });
    }

    return () => {
      window.removeEventListener("load", goToHash);
      gsap.ticker.remove(raf);
      instance.destroy();
      lenis.current = null;
      window.lenis = null;
    };
  }, []);

  return <>{children}</>;
}
