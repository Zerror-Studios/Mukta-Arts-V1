import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

// Motion tokens, lifted from the home page so every page moves the same way.
export const EASE = "power3.out"; // every reveal on the home page (Elder, OldCamera, Films)
export const EASE_IN_OUT = "expo.inOut"; // the menu panel and page curtains
export const DURATION = 0.8; // menu items and the films carousel
export const DURATION_LONG = 1; // Elder's closing words
export const STAGGER = 0.08; // Elder's closing words
export const RISE = 30; // px; the rise used by OldCamera and the About intro
export const COUNT_DURATION = 1.2;

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_REDUCED = "(prefers-reduced-motion: reduce)";

// Counters show plain numbers ("4500+"), unless an element asks for grouping
// with data-count-format="en-IN" / "en-US".
export function formatCount(value, format) {
  const n = Math.round(value);
  return format && format !== "none" ? n.toLocaleString(format) : String(n);
}

export function countText(el, value) {
  const { countPrefix = "", countSuffix = "", countFormat } = el.dataset;
  return `${countPrefix}${formatCount(value, countFormat)}${countSuffix}`;
}

export { gsap, ScrollTrigger, SplitText };
