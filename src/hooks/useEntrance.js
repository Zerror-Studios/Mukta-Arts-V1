"use client";

import { useGSAP } from "@gsap/react";
import {
  gsap,
  SplitText,
  EASE,
  DURATION,
  DURATION_LONG,
  STAGGER,
  RISE,
  COUNT_DURATION,
  MOTION_OK,
  MOTION_REDUCED,
  countText,
} from "@/lib/motion";
import { whenRevealsReleased } from "@/lib/revealGate";

const SPLIT_TYPES = { words: "words", lines: "lines" };

function addToTimeline(tl, el, at, splits) {
  const kind = el.dataset.entrance;
  gsap.set(el, { autoAlpha: 1 });

  if (SPLIT_TYPES[kind]) {
    const split = SplitText.create(el, { type: SPLIT_TYPES[kind] });
    splits.push(split);
    tl.fromTo(
      split[kind],
      { autoAlpha: 0, y: RISE },
      { autoAlpha: 1, y: 0, duration: DURATION, ease: EASE, stagger: STAGGER },
      at
    );
    return;
  }

  if (kind === "count") {
    const counter = { value: 0 };
    const target = parseFloat(el.dataset.countTo) || 0;
    el.textContent = countText(el, 0);
    tl.fromTo(el, { autoAlpha: 0, y: RISE }, { autoAlpha: 1, y: 0, duration: DURATION, ease: EASE }, at);
    tl.to(
      counter,
      {
        value: target,
        duration: COUNT_DURATION,
        ease: EASE,
        onUpdate: () => {
          el.textContent = countText(el, counter.value);
        },
      },
      at
    );
    return;
  }

  if (kind === "line") {
    tl.fromTo(
      el,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: DURATION_LONG, ease: "power3.inOut" },
      at
    );
    return;
  }

  if (kind === "fade") {
    tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: DURATION_LONG, ease: "power2.out" }, at);
    return;
  }

  // "rise" (default): the element rises and fades in as one piece
  tl.fromTo(el, { autoAlpha: 0, y: RISE }, { autoAlpha: 1, y: 0, duration: DURATION, ease: EASE }, at);
}

/**
 * The page-hero entrance every page shares. Mark elements inside `scopeRef`:
 *   data-entrance="words"  headline, word by word (rise + fade, Elder's stagger)
 *   data-entrance="lines"  paragraph, line by line
 *   data-entrance="rise"   one piece (buttons, images, groups) — the default
 *   data-entrance="fade"   opacity only (backgrounds, canvases)
 *   data-entrance="line"   hairline drawing in from the left
 *   data-entrance="count"  number counting up to data-count-to; the element's text must be
 *                          only the number, with data-count-prefix / data-count-suffix
 *                          (render the final value, e.g. "50+", so it reads without JS)
 * Items play in DOM order, each starting `gap` seconds after the one before;
 * data-entrance-at="<seconds>" pins an item to an exact time instead.
 * Do not nest [data-entrance] elements. Only split static text (React must not re-render it).
 * The entrance waits for the first-visit loader / menu transition to clear, and with
 * reduced motion everything is simply shown.
 */
export default function useEntrance(scopeRef, { gap = 0.15, delay = 0, onComplete } = {}) {
  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;
      const items = gsap.utils.toArray("[data-entrance]", scope);
      if (!items.length) return;

      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, reduced: MOTION_REDUCED }, (context) => {
        items.forEach((el) => el.setAttribute("data-entrance-ready", ""));
        if (context.conditions.reduced) return;

        gsap.set(items, { autoAlpha: 0 });

        let cancelled = false;
        let cancelWait = () => {};
        const fontsReady = document.fonts?.ready ?? Promise.resolve();

        fontsReady.then(() => {
          if (cancelled) return;
          context.add(() => {
            const splits = [];
            const tl = gsap.timeline({
              paused: true,
              delay,
              onComplete: () => {
                // Hand the text back to normal layout so it reflows on resize
                splits.forEach((split) => split.revert());
                onComplete?.();
              },
            });
            let cursor = 0;
            items.forEach((el) => {
              const at = el.dataset.entranceAt != null ? parseFloat(el.dataset.entranceAt) : cursor;
              addToTimeline(tl, el, at, splits);
              cursor = at + gap;
            });
            cancelWait = whenRevealsReleased(() => tl.play());
          });
        });

        return () => {
          cancelled = true;
          cancelWait();
        };
      });
    },
    { scope: scopeRef }
  );
}
