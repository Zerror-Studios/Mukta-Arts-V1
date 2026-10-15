// The hand-off between the home hero's intro timeline (components/home/Hero.jsx) and the
// 3D headphones (components/home/HeadphonesModel.jsx), which live in different React trees.

// World units below the resting spot: far enough that the model starts out of view
export const MODEL_OFFSCREEN_Y = -8;

// Written by the hero's timeline, read by the model every frame
export const modelIntro = { y: MODEL_OFFSCREEN_Y, spin: 0, scale: 1, tilt: 0 };

let modelReady = false;
const waiting = new Set();

// Called by the model once it is loaded and its shaders are compiled
export function setModelReady(ready) {
  modelReady = ready;
  if (!ready) return;
  const queued = [...waiting];
  waiting.clear();
  queued.forEach((fn) => fn());
}

// Runs `fn` now, or as soon as the model is ready. Returns a cancel function.
export function whenModelReady(fn) {
  if (modelReady) {
    fn();
    return () => {};
  }
  waiting.add(fn);
  return () => waiting.delete(fn);
}

// Heavy below-the-fold work (the 20MB camera model) waits for the intro, so it cannot
// steal bandwidth from the hero model or drop frames while the intro plays
let introDone = true;
const afterIntro = new Set();

export function setIntroDone(done) {
  introDone = done;
  if (!done) return;
  const queued = [...afterIntro];
  afterIntro.clear();
  queued.forEach((fn) => fn());
}

// Runs `fn` now, or once the home intro has played. Returns a cancel function.
export function whenIntroDone(fn) {
  if (introDone) {
    fn();
    return () => {};
  }
  afterIntro.add(fn);
  return () => afterIntro.delete(fn);
}
