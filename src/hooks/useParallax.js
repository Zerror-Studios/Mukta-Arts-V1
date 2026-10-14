"use client";

import { useGSAP } from "@gsap/react";
import { gsap, MOTION_OK } from "@/lib/motion";

/**
 * Calm parallax for photographs. Mark the image with data-parallax="0.12" (it then moves
 * 12% slower than the scroll). The image must sit absolutely positioned (left-0 top-0
 * w-full h-full object-cover) inside a `relative overflow-hidden` frame with a fixed height;
 * on desktop it is made taller than the frame by exactly the distance it travels, so it
 * always covers the frame. Off below 768px and with reduced motion.
 */
export default function useParallax(scopeRef) {
  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;
      const images = gsap.utils.toArray("[data-parallax]", scope);
      if (!images.length) return;

      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        images.forEach((img) => {
          const frame = img.parentElement;
          const speed = parseFloat(img.dataset.parallax) || 0.12;
          // Over the frame's whole pass through the viewport the image falls behind by `travel`
          const travel = () => speed * (window.innerHeight + frame.offsetHeight);
          const fit = () => {
            img.style.height = `${frame.offsetHeight + travel()}px`;
            img.style.top = `${-travel() / 2}px`;
          };

          fit();
          gsap.fromTo(
            img,
            { y: () => -travel() / 2 },
            {
              y: () => travel() / 2,
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
                onRefreshInit: fit,
              },
            }
          );
        });

        return () => {
          images.forEach((img) => {
            img.style.height = "";
            img.style.top = "";
          });
        };
      });
    },
    { scope: scopeRef }
  );
}
