"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import { releaseReveals } from "@/lib/revealGate";

export const INTRO_KEY = "mukta-intro";

// Seconds after navigation start when the loader begins to clear. The logo has drawn in
// by then (CSS, from first paint), and the page hero reveals as the loader clears, so the
// whole sequence lands inside 2.5s.
const CLEAR_AT = 0.9;

// First-visit intro. Only shown when the inline script in the root layout has marked the
// visit with `html.intro-active` (once per session, or on a reload; never on route changes,
// never with reduced motion).
export default function Loader() {
  const rootRef = useRef(null);
  const logoRef = useRef(null);
  const ruleRef = useRef(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (window.__MUKTA_INTRO__ !== true) return;
      // A client re-render of <html> (e.g. after a hydration error) drops the class; restore it
      html.classList.add("intro-active");

      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {}

      const clear = () => {
        // Take over from the CSS draw-in without a jump
        gsap.set([logoRef.current, ruleRef.current], { autoAlpha: 1, y: 0, scale: 1, scaleX: 1, animation: "none" });
        releaseReveals();
        gsap
          .timeline({
            onComplete: () => {
              window.__MUKTA_INTRO__ = false;
              html.classList.remove("intro-active");
              window.lenis?.start();
            },
          })
          .to(logoRef.current, { autoAlpha: 0, y: -12, duration: 0.5, ease: "power2.in" }, 0)
          .to(ruleRef.current, { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, 0)
          .to(rootRef.current, { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" }, 0.1);
      };

      const elapsed = performance.now() / 1000;
      gsap.delayedCall(Math.max(0, CLEAR_AT - elapsed), clear);
    },
    { scope: rootRef }
  );

  return (
    <div
      id="site-loader"
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[9999990] items-center justify-center bg-white"
    >
      <div className="flex flex-col items-center gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element -- must paint before hydration, no optimiser round-trip */}
        <img
          ref={logoRef}
          src="/img/sg/HeadLogo.png"
          alt=""
          fetchPriority="high"
          className="loader-logo h-28 md:h-36 w-auto select-none"
          draggable={false}
        />
        <span ref={ruleRef} className="loader-rule block h-px w-24 md:w-32 bg-black/25" />
      </div>
    </div>
  );
}
