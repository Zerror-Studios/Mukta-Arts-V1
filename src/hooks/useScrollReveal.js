"use client";

import { useGSAP } from "@gsap/react";
import {
  gsap,
  SplitText,
  EASE,
  DURATION_LONG,
  STAGGER,
  RISE,
  COUNT_DURATION,
  MOTION_OK,
  countText,
} from "@/lib/motion";

/**
 * Gentle scroll-triggered reveals for section headings and copy inside `scopeRef`.
 *   data-reveal="lines"  (default) split into lines, rise + fade, Elder's stagger
 *   data-reveal="words"  word by word, for short display headings
 *   data-reveal="rise"   the element rises + fades as one piece
 *   data-reveal="count"  counts up to data-count-to once (same attributes as useEntrance)
 * Each element reveals once, when its top reaches `start`. With reduced motion nothing
 * is hidden. Only split static text.
 */
export default function useScrollReveal(scopeRef, { start = "top 100%" } = {}) {
  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;
      const els = gsap.utils.toArray("[data-reveal]", scope);
      if (!els.length) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        els.forEach((el) => {
          const kind = el.dataset.reveal || "lines";
          const scrollTrigger = { trigger: el, start, once: true };

          if (kind === "count") {
            const counter = { value: 0 };
            const target = parseFloat(el.dataset.countTo) || 0;
            el.textContent = countText(el, 0);
            gsap.to(counter, {
              value: target,
              duration: COUNT_DURATION,
              ease: EASE,
              scrollTrigger,
              onUpdate: () => {
                el.textContent = countText(el, counter.value);
              },
              onComplete: () => {
                el.textContent = countText(el, target);
              },
            });
            return;
          }

          if (kind === "rise") {
            gsap.fromTo(
              el,
              { autoAlpha: 0, y: RISE },
              { autoAlpha: 1, y: 0, duration: DURATION_LONG, ease: EASE, scrollTrigger }
            );
            return;
          }

          SplitText.create(el, {
            type: kind === "words" ? "words" : "lines",
            autoSplit: kind !== "words",
            onSplit: (self) =>
              gsap.fromTo(
                kind === "words" ? self.words : self.lines,
                { autoAlpha: 0, y: RISE },
                { autoAlpha: 1, y: 0, duration: DURATION_LONG, ease: EASE, stagger: STAGGER, scrollTrigger }
              ),
          });
        });
      });
    },
    { scope: scopeRef }
  );
}
