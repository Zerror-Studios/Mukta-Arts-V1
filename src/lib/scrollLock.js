// Holds the page still while the home intro plays. The hero locks before Lenis is
// created (child effects run first), so LenisScroll checks `isScrollLocked()` on start.

let locked = false;

export function lockScroll() {
  locked = true;
  window.scrollTo(0, 0);
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
