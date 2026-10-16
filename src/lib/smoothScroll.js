// Programmatic scrolls go through Lenis when it is running, so they glide like the wheel and
// Lenis keeps track of where the page is. Without Lenis (reduced motion), the browser scrolls.

// `target` is a pixel position or an element; `center` puts an element in the middle of the screen
export function smoothScrollTo(target, { center = false } = {}) {
  const isElement = typeof target !== "number";
  const offset = isElement && center ? -(window.innerHeight - target.offsetHeight) / 2 : 0;

  if (window.lenis) {
    window.lenis.scrollTo(target, { offset, duration: 1.2 });
    return;
  }

  if (isElement) {
    target.scrollIntoView({ behavior: "smooth", block: center ? "center" : "start" });
  } else {
    window.scrollTo({ top: target, behavior: "smooth" });
  }
}
