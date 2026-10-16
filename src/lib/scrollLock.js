// Holds the page still while the home intro plays. The hero locks before Lenis is
// created (child effects run first), so LenisScroll checks `isScrollLocked()` on start.

let locked = false;

export function lockScroll() {
  locked = true;
  // Instant: a smooth glide here would visibly scroll the page up as the intro starts
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.classList.add("scroll-locked");
  window.lenis?.scrollTo(0, { immediate: true, force: true });
  window.lenis?.stop();
}

export function unlockScroll() {
  if (!locked) return;
  locked = false;
  document.documentElement.classList.remove("scroll-locked");
  window.lenis?.start();
}

export function isScrollLocked() {
  return locked;
}
