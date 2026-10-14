// Page entrances wait until nothing is covering the page: the first-visit loader,
// or the menu panel that sweeps across during a page change. Otherwise they would
// play underneath it and the visitor would land on text that is already in place.

const INTRO_FAILSAFE_MS = 4000;
const TRANSITION_FAILSAFE_MS = 2500;

let held = false;
let failsafe = null;
const waiting = new Set();

export function releaseReveals() {
  held = false;
  clearTimeout(failsafe);
  const queued = [...waiting];
  waiting.clear();
  queued.forEach((fn) => fn());
}

export function holdReveals(timeout = TRANSITION_FAILSAFE_MS) {
  held = true;
  clearTimeout(failsafe);
  failsafe = setTimeout(releaseReveals, timeout);
}

// Runs `fn` now, or as soon as the cover starts to clear. Returns a cancel function.
export function whenRevealsReleased(fn) {
  if (!held) {
    fn();
    return () => {};
  }
  waiting.add(fn);
  return () => waiting.delete(fn);
}

// The inline script in the root layout marks the first visit before any JS runs.
if (typeof window !== "undefined" && window.__MUKTA_INTRO__ === true) {
  holdReveals(INTRO_FAILSAFE_MS);
}
