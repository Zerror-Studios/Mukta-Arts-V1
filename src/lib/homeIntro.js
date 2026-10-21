// The hand-off between the home hero's intro timeline (components/home/Hero.jsx) and the
// 3D headphones (components/home/HeadphonesModel.jsx), which live in different React trees.

// World units below the resting spot: just past the bottom of the screen, so it comes into view
// straight away as it starts to rise
export const MODEL_OFFSCREEN_Y = -6;

// Radians per second the model turns on its own (in the hero and in the footer). The intro's spin
// ends at exactly this speed, so the turn it lands with carries straight on into this one.
export const IDLE_SPEED = 0.8;

// Written by the hero's timeline, read by the model every frame.
// `idle` (0–1) scales the model's own rotation: 0 holds it still during the intro's own turn.
export const modelIntro = { y: MODEL_OFFSCREEN_Y, spin: 0, scale: 1, tilt: 0, idle: 1 };

// The turn that shows the logo's front (the Om) to the camera. In headphones.glb the Om plate faces
// the model's +x side and the ear cups sit at ±z, so with no turn the camera (on +z) sees an ear cup.
export const MODEL_FRONT_Y = -Math.PI / 2;

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
