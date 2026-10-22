"use client"
import React, { useRef, useEffect, useLayoutEffect, Suspense } from 'react';
import { useGLTF, useEnvironment, Environment, Center } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
// The same GSAP + ScrollTrigger instance as the rest of the site, so these triggers update in
// step with Lenis instead of on a second, separate copy listening to the scroll on its own
import { gsap, ScrollTrigger } from '@/lib/motion';
import { modelIntro, MODEL_FRONT_Y, IDLE_SPEED, setModelReady, MODEL_URL, MODEL_ENV_URL } from '@/lib/homeIntro';

// Reused every frame while the model follows the header logo / footer, instead of allocating new vectors
const _point = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _dockPos = new THREE.Vector3();
const _footerPos = new THREE.Vector3();
const _size = new THREE.Vector3();
const _worldScale = new THREE.Vector3();
const TURN = Math.PI * 2;

// Share of the header logo image's height that the headphones fill (the PNG has a little padding),
// so the docked 3D logo ends the same size as the flat one it swaps with
const DOCK_FILL = 0.86;
// Scrolling past this much of a screen (a fraction of the viewport height) sets off the trip up to
// the header logo, which then plays through on its own over DOCK_DURATION seconds instead of
// following the scroll; scrolling back above it plays the trip back down into the hero
const DOCK_TRIGGER = 0.06;
const DOCK_DURATION = 1.4;
// Share of that trip after which it starts turning to face front (below it, it is back in the hero
// and turning on its own)
const DOCK_TURN_FROM = 0.03;
// Share of that trip over which the model is brought round to face front (it starts turning
// to the front on its own as soon as the trip starts; this makes sure it gets there in time)
const DOCK_HOLD_FROM = 0.3;
const DOCK_HOLD_TO = 0.8;
// Share of the trip at which the model has reached the header logo and swaps with it
const DOCK_SWAP = 0.97;

// The trip down into the footer, from when the footer's top comes into view to when it reaches the
// top of the screen: it swaps back from the header logo at the start, sets off from the corner just
// after, and starts turning again on the way
const FOOTER_START = 'top 80%';
const FOOTER_END = 'top top';
const FOOTER_SWAP = 0.03;
const FOOTER_TRAVEL_FROM = 0.06;
const FOOTER_SPIN_FROM = 0.3;
// The footer model's scale, per breakpoint (desktop, tablet, phone)
const footerScaleFor = (width) => (width >= 1024 ? 25 : width >= 768 ? 8 : 15);

// Seconds the rotation takes to get back up to speed (after the header, or after a drag)
const SPEED_RAMP = 1.2;
// Turning to the front takes at least this much of a turn, so it always slows down smoothly
// instead of stopping dead when it happens to be nearly facing front already
const SETTLE_MIN = 0.5;
// Radians the model turns per pixel dragged
const DRAG_SPEED = 0.01;

// Phones, upright or on their side (the `phone` variant in globals.css)
const PHONE = '(max-width: 767.98px), (max-height: 500px)';
// On phones the model's textures are cut down to this size before they reach the GPU. All 38 are
// 1024px, about 200 MB of GPU memory, which is more than iOS and Android always give a page: they drop
// the canvas's WebGL context and the logo disappears. The whole model is only a few hundred pixels
// across on a phone, so half-size textures look the same there and take a quarter of the memory.
const PHONE_TEXTURE_SIZE = 512;
// Seconds the hero waits for the shaders to compile before its intro plays anyway: on a context the
// phone drops part-way through, compiling never finishes, and the model would never rise in
const COMPILE_WAIT = 2;
// Milliseconds a lost WebGL context gets to come back before a fresh canvas replaces it
const CONTEXT_RESTORE_WAIT = 1000;

const clamp01 = (t) => Math.min(Math.max(t, 0), 1);
const smooth = (t) => {
  const u = clamp01(t);
  return u * u * (3 - 2 * u);
};
const easeInOut = (t) => {
  const u = clamp01(t);
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
};
// A cubic Hermite curve from 0 to 1 that leaves at slope `start` and arrives at rest
const settleEase = (u, start) => {
  const u2 = u * u;
  const u3 = u2 * u;
  return start * (u3 - 2 * u2 + u) + (3 * u2 - 2 * u3);
};

// Where the centre of a DOM element lands on the z = 0 plane the model moves in
function elementToWorld(el, size, camera, out) {
  const rect = el.getBoundingClientRect();
  const x = ((rect.left + rect.width / 2) / size.width) * 2 - 1;
  const y = -((rect.top + rect.height / 2) / size.height) * 2 + 1;
  _point.set(x, y, 0).unproject(camera);
  _dir.copy(_point).sub(camera.position).normalize();
  const distance = -camera.position.z / _dir.z;
  return out.copy(camera.position).add(_dir.multiplyScalar(distance));
}

// Redraws every texture of the (cached, shared) model at most `maxSize` across, once
const shrunkScenes = new WeakSet();
function shrinkTextures(scene, maxSize) {
  if (shrunkScenes.has(scene)) return;
  shrunkScenes.add(scene);
  scene.traverse((obj) => {
    if (!obj.isMesh) return;
    [].concat(obj.material).forEach((material) => {
      Object.values(material).forEach((texture) => {
        const image = texture?.isTexture ? texture.image : null;
        // An <img> on Safari, an ImageBitmap elsewhere; a texture shared by two maps is only done once
        const drawable = image instanceof HTMLImageElement || (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap);
        if (!drawable || Math.max(image.width, image.height) <= maxSize) return;
        const ratio = maxSize / Math.max(image.width, image.height);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * ratio);
        canvas.height = Math.round(image.height * ratio);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        image.close?.();
        texture.image = canvas;
        texture.needsUpdate = true;
      });
    });
  });
}

// footerOnly: the other pages, which have no hero model. It starts docked in the header logo and
// only makes the trip down into the footer (and back up), with no hero intro.
export function Model({ onDrawingChange, footerOnly = false, scale: baseScale = 1, ...props }) {
  const { scene } = useGLTF(MODEL_URL);
  const introRef = useRef();
  const groupRef = useRef();
  const spinRef = useRef();
  const { size, camera, gl, scene: rootScene, invalidate } = useThree();
  const frameloop = useThree((s) => s.frameloop);

  // Back from "never" to "always" (drawing again after the header logo), R3F's render loop only
  // starts up again when asked. The home page's other canvases keep it running anyway; this one
  // is alone on the other pages.
  useEffect(() => {
    if (frameloop === 'always') invalidate();
  }, [frameloop, invalidate]);

  // dockP: 0 in the hero, 1 once it has reached the header logo
  // footerP: 0 until the footer comes into view, 1 once the model sits in it
  const stateRef = useRef({ dockP: footerOnly ? 1 : 0, footerP: 0 });
  // The hero intro only plays on the home page; elsewhere the model just turns on its own
  const introIdle = () => (footerOnly ? 1 : modelIntro.idle);
  // The model's own height (before any scaling), measured once it is upright
  const modelHeightRef = useRef(0);
  const elsRef = useRef({ canvas: null, logo: null, footer: null, docked: false, drawing: true, z: '' });
  // angle: the turn the model is at; speed (0–1): how much of the idle speed it is turning at;
  // settle: the turn to the front in progress; drag / dragTarget: the turn added by the pointer
  const spin = useRef({ angle: 0, speed: 1, ramping: false, settle: null, drag: 0, dragTarget: 0 });
  const pointer = useRef({ dragging: false, moved: false, x: 0 });
  // The swap with the header logo (set up with the scroll triggers below), also checked every frame
  const updateRef = useRef(null);

  // Which stage the model is in, from the scroll
  const turningFront = () => {
    const { dockP, footerP } = stateRef.current;
    return footerP > 0 ? footerP < FOOTER_SPIN_FROM : dockP > DOCK_TURN_FROM;
  };

  // Drag to turn it: in the hero (anywhere but the links), and in the footer over its spot
  useEffect(() => {
    const canDrag = (target) => {
      if (turningFront() || introIdle() < 1 || !(target instanceof Element)) return false;
      if (stateRef.current.footerP > 0) return !!target.closest('#footer-headphone');
      return !target.closest('a, button, header, input, textarea');
    };
    const handlePointerDown = (e) => {
      if (!e.isPrimary || !canDrag(e.target)) return;
      pointer.current.dragging = true;
      pointer.current.moved = false;
      pointer.current.x = e.clientX;
    };
    const handlePointerUp = () => {
      if (!pointer.current.dragging) return;
      pointer.current.dragging = false;
      // Let go: it picks its own rotation back up, gently (a tap never stopped it)
      if (pointer.current.moved) spin.current.ramping = true;
    };
    const handlePointerMove = (e) => {
      if (!pointer.current.dragging || !e.isPrimary) return;
      const dx = e.clientX - pointer.current.x;
      if (!dx) return;
      pointer.current.moved = true;
      spin.current.dragTarget += dx * DRAG_SPEED;
      pointer.current.x = e.clientX;
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    // A touch that turns into a scroll ends in pointercancel, not pointerup
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  // Phones get smaller textures (PHONE_TEXTURE_SIZE). A layout effect, so it is done before R3F
  // first draws the model and before the effect below uploads the textures.
  useLayoutEffect(() => {
    if (window.matchMedia(PHONE).matches) shrinkTextures(scene, PHONE_TEXTURE_SIZE);
  }, [scene]);

  // Get the GPU ready while the model is still out of view (textures uploaded, shaders
  // compiled), so the first frames of the hero intro never stutter. Then tell the hero.
  useEffect(() => {
    let cancelled = false;
    scene.traverse((obj) => {
      if (!obj.isMesh) return;
      [].concat(obj.material).forEach((material) => {
        Object.values(material).forEach((value) => {
          if (value?.isTexture) gl.initTexture(value);
        });
      });
    });
    // Never waited on for longer than COMPILE_WAIT, and a compile that throws (a lost context) only
    // rejects, so the hero always gets its go-ahead
    const compiled = Promise.race([
      new Promise((resolve) => resolve(gl.compileAsync ? gl.compileAsync(rootScene, camera) : gl.compile(rootScene, camera))),
      new Promise((resolve) => setTimeout(resolve, COMPILE_WAIT * 1000)),
    ]);
    // Only the home hero waits on this
    if (footerOnly) {
      compiled.catch(() => {});
      return;
    }
    compiled
      .catch(() => {})
      .then(() => requestAnimationFrame(() => !cancelled && setModelReady(true)));

    return () => {
      cancelled = true;
      setModelReady(false);
    };
  }, [scene, gl, rootScene, camera, footerOnly]);

  useFrame((state, delta) => {
    // Capped so a long frame (or the first one after drawing resumes) never jumps the motion
    const dt = Math.min(delta, 0.1);

    // Hero intro (driven by Hero.jsx): rise from below and turn into place
    if (introRef.current && !footerOnly) {
      introRef.current.position.y = modelIntro.y;
      introRef.current.rotation.y = modelIntro.spin;
      introRef.current.rotation.x = modelIntro.tilt;
      introRef.current.scale.setScalar(modelIntro.scale);
    }

    // Measured once, upright (no intro tilt): the model's height in its own units. The world
    // matrices are brought up to date first: off the home page this can be the very first frame.
    if (!modelHeightRef.current && (footerOnly || modelIntro.tilt === 0)) {
      scene.updateWorldMatrix(true, true);
      new THREE.Box3().setFromObject(scene).getSize(_size);
      scene.getWorldScale(_worldScale);
      modelHeightRef.current = _size.y / _worldScale.y;
    }

    const { dockP, footerP } = stateRef.current;
    const els = elsRef.current;
    updateRef.current?.();

    // 1. Where it is and how big: the hero centre, the header logo, or the footer spot
    if (groupRef.current) {
      const pos = groupRef.current.position;
      let scale = baseScale;

      if (dockP > 0 || footerP > 0) {
        // The header logo's spot, and the scale at which the model is the logo's height on screen
        if (!els.logo || !els.logo.isConnected) els.logo = document.getElementById('header-dock-logo');
        let dockScale = baseScale;
        if (els.logo) {
          elementToWorld(els.logo, size, camera, _dockPos);
          // World units per screen pixel on the plane the model moves in (z = 0)
          const worldPerPx = (2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / size.height;
          const logoHeight = els.logo.getBoundingClientRect().height;
          if (modelHeightRef.current && logoHeight) {
            dockScale = (logoHeight * worldPerPx * DOCK_FILL) / modelHeightRef.current;
          }
        } else {
          _dockPos.set(0, 3, 0);
        }

        // Up to the header logo: it rises a little ahead of moving across, so it curves up into the
        // corner, and shrinks evenly (by ratio, so it doesn't collapse at the start and crawl at the end).
        // It arrives exactly as it swaps with the flat logo.
        const travel = easeInOut(dockP / DOCK_SWAP);
        const rise = 1 - (1 - travel) * (1 - travel);
        pos.set(_dockPos.x * travel, _dockPos.y * rise, 0);
        scale = baseScale * Math.pow(dockScale / baseScale, travel);

        // Down from the header logo into the footer, growing to its footer size on the way
        if (footerP > 0) {
          if (!els.footer || !els.footer.isConnected) els.footer = document.getElementById('footer-headphone');
          if (els.footer) {
            elementToWorld(els.footer, size, camera, _footerPos);
            const down = easeInOut((footerP - FOOTER_TRAVEL_FROM) / (1 - FOOTER_TRAVEL_FROM));
            pos.lerp(_footerPos, down);
            scale *= Math.pow(footerScaleFor(size.width) / scale, down);
          }
        }
      } else {
        pos.set(0, 0, 0);
      }
      groupRef.current.scale.setScalar(scale);    }

    // 2. Rotation
    if (spinRef.current) {
      const s = spin.current;

      if (turningFront()) {
        // On its way to (or sitting in) the header: it turns on to the next front-facing angle,
        // slowing down from the speed it was turning at, so it matches the flat logo when they swap
        if (!s.settle) {
          pointer.current.dragging = false;
          const from = s.angle + s.drag;
          const to = Math.ceil((from + SETTLE_MIN) / TURN) * TURN;
          const distance = to - from;
          const duration = 0.6 + distance * 0.25;
          // Leaves at the speed it was turning (as a slope of the 0–1 curve)
          const start = Math.min((s.speed * introIdle() * IDLE_SPEED * duration) / distance, 3);
          s.settle = { from, to, t: 0, duration, start };
          s.angle = from;
          s.drag = s.dragTarget = 0;
        }
        const st = s.settle;
        st.t = Math.min(st.t + dt, st.duration);
        const timed = st.from + (st.to - st.from) * settleEase(st.t / st.duration, st.start);
        // ...and the trip's progress makes sure it is there by the time it swaps
        const hold = footerP > 0
          ? 1 - smooth((footerP - FOOTER_TRAVEL_FROM) / (FOOTER_SPIN_FROM - FOOTER_TRAVEL_FROM))
          : smooth((dockP - DOCK_HOLD_FROM) / (DOCK_HOLD_TO - DOCK_HOLD_FROM));
        s.angle = timed + (st.to - timed) * hold;
        s.speed = 0;
      } else {
        if (s.settle) {
          // Back in the hero, or into the footer: it starts turning again from wherever it is
          s.settle = null;
          s.ramping = true;
        }
        if (pointer.current.dragging && pointer.current.moved) {
          // Held by the pointer: only the drag turns it
          s.speed = 0;
          s.ramping = true;
        } else if (s.ramping) {
          s.speed = Math.min(1, s.speed + dt / SPEED_RAMP);
          if (s.speed === 1) s.ramping = false;
        }
        // The hero intro holds this at 0 (modelIntro.idle) during its own turn, then hands over at
        // full speed, so the model never stops
        s.angle += dt * IDLE_SPEED * s.speed * introIdle();
        s.drag += (s.dragTarget - s.drag) * (1 - Math.exp(-dt * 12));
      }

      spinRef.current.rotation.y = s.angle + s.drag;
    }
  });

  useEffect(() => {
    if (!groupRef.current) return;

    // Swapping between the 3D model and the flat logo in the header: instant, in the same frame, so
    // there is no fade to see. The model is already at the logo's spot and size, facing front, so one
    // simply replaces the other. While the canvas is hidden it stops drawing altogether (it covers the
    // whole screen); its last frame is that same docked pose, so it shows straight back without a gap.
    const els = elsRef.current;
    const setDrawing = (drawing) => {
      if (drawing === els.drawing) return;
      els.drawing = drawing;
      onDrawingChange?.(drawing);
    };
    const swap = (toLogo) => {
      const { canvas, logo } = els;
      if (!canvas) return;
      if (!logo) {
        canvas.style.opacity = toLogo ? '0' : '1';
        setDrawing(!toLogo);
        return;
      }
      if (!toLogo) setDrawing(true);
      canvas.style.opacity = toLogo ? '0' : '1';
      logo.style.opacity = toLogo ? '1' : '0';
      logo.style.visibility = toLogo ? 'visible' : 'hidden';
      logo.style.pointerEvents = toLogo ? 'auto' : 'none';
      if (toLogo) setDrawing(false);
    };

    const update = () => {
      if (!els.canvas) els.canvas = document.getElementById('hero-logo-canvas');
      if (!els.logo || !els.logo.isConnected) els.logo = document.getElementById('header-dock-logo');
      if (!els.canvas) return;
      const { dockP, footerP } = stateRef.current;

      const docked = dockP >= DOCK_SWAP && footerP < FOOTER_SWAP;
      if (docked !== els.docked) {
        els.docked = docked;
        swap(docked);
      }

      // While it travels to the header or down into the footer, the model passes over the page, not
      // behind it (the hero's tagline and button are z-20, and the section above the footer has its
      // own layers). Above the content but under the header (z-50); back to its usual layer once it
      // has settled in the hero or the footer.
      const travelling = footerP > 0 ? footerP < 0.9 : dockP > 0.001;
      const z = travelling ? '45' : '';
      if (z !== els.z) {
        els.z = z;
        els.canvas.style.zIndex = z;
      }
    };

    const state = stateRef.current;
    const ctx = gsap.context(() => {
      // Hero to header logo: set off by the scroll, then timed, so the logo glides up to the corner
      // in one smooth move however fast or slow the scroll is. Scrolling back to the top reverses it
      // from wherever it has got to. (The move, the shrink and the turn happen every frame, in
      // useFrame; the ease is applied there, so the progress here stays linear.)
      // (Off the home page it is already docked.)
      if (!footerOnly) {
        const dock = gsap.fromTo(state, { dockP: 0 }, {
          dockP: 1,
          duration: DOCK_DURATION,
          ease: 'none',
          onUpdate: update,
          scrollTrigger: {
            trigger: document.body,
            start: () => window.innerHeight * DOCK_TRIGGER,
            toggleActions: 'play none none reverse',
          },
        });
        // Set up part-way down the page (the model loaded after the visitor had scrolled on, or a
        // fresh canvas replaced one the phone dropped): it starts docked instead of flying up again
        if (window.scrollY > window.innerHeight * DOCK_TRIGGER) dock.progress(1);
      }

      // Header logo to the footer, on every screen size (footerScaleFor picks the size)
      gsap.fromTo(state, { footerP: 0 }, {
        footerP: 1,
        ease: 'none',
        onUpdate: update,
        scrollTrigger: {
          trigger: '#footer',
          start: FOOTER_START,
          end: FOOTER_END,
          // Measured after the pinned sections above the footer, which push it down the page
          refreshPriority: -1,
          scrub: 1,
        },
      });
    });

    update();
    // A refresh (a resize, or content loading in further down) measures the triggers by putting their
    // tweens back to the start and then straight back, without a last onUpdate: check again after it
    let refreshFrame = 0;
    const afterRefresh = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(update);
    };
    ScrollTrigger.addEventListener('refresh', afterRefresh);
    updateRef.current = update;

    return () => {
      ScrollTrigger.removeEventListener('refresh', afterRefresh);
      cancelAnimationFrame(refreshFrame);
      updateRef.current = null;
      ctx.revert();
      els.docked = false;
      setDrawing(true);
      // Hand the header logo back to its own classes (it stays mounted between the other pages)
      if (els.logo) {
        els.logo.style.opacity = '';
        els.logo.style.visibility = '';
        els.logo.style.pointerEvents = '';
      }
      // ...and the canvas's wrapper too, which stays mounted when a fresh canvas replaces a lost one
      if (els.canvas) {
        els.canvas.style.opacity = '';
        els.canvas.style.zIndex = '';
      }
    };
  }, [onDrawingChange, footerOnly]);

  return (
    <group ref={introRef}>
      <group ref={groupRef} {...props}>
        <group ref={spinRef}>
          {/* The front turn wraps only the model, innermost: on an outer group it would also turn
              the dock movement (groupRef's position) and send the logo away from the camera instead
              of to the corner. Every whole turn of the spins above still ends with the Om in front. */}
          <group rotation={[0, MODEL_FRONT_Y, 0]}>
            <Center>
              <primitive object={scene} />
            </Center>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
useEnvironment.preload({ files: MODEL_ENV_URL });

export default function HeadphonesCanvas({ footerOnly = false }) {
  const [modelScale, setModelScale] = React.useState(30);
  // False while the model is docked in the header and this canvas is hidden
  const [drawing, setDrawing] = React.useState(true);
  // Bumped to mount a fresh canvas in place of one whose WebGL context the phone dropped
  const [contextKey, setContextKey] = React.useState(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Phones drop a page's WebGL contexts when GPU memory runs short or the browser has been in the
  // background, and a lost canvas draws nothing from then on. If the browser gives the context back,
  // three.js carries on by itself; if it doesn't, a fresh canvas (with a new context) takes over.
  const handleCreated = ({ gl }) => {
    const canvas = gl.domElement;
    let timer = 0;
    // Set once this canvas has been replaced: R3F forces its context to be lost as it unmounts
    let retired = false;
    const rebuild = () => {
      if (retired || !mountedRef.current || !gl.getContext().isContextLost()) return;
      // Not while the page is in the background, where the new context would be dropped as well
      if (document.hidden) {
        document.addEventListener('visibilitychange', rebuild, { once: true });
        return;
      }
      retired = true;
      setContextKey((key) => key + 1);
    };
    canvas.addEventListener('webglcontextlost', () => {
      clearTimeout(timer);
      timer = setTimeout(rebuild, CONTEXT_RESTORE_WAIT);
    });
    canvas.addEventListener('webglcontextrestored', () => clearTimeout(timer));
  };

  useEffect(() => {
    const updateScale = () => {
      if (window.innerWidth < 768) {
        setModelScale(15); // scale down for mobile
      } else if (window.innerWidth < 1024) {
        setModelScale(8); // scale down for tablet
      } else {
        setModelScale(30); // default desktop scale
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    // Never takes the pointer (it covers the whole screen, over the footer too): dragging the model
    // is picked up on the window instead (Model)
    // Off the home page it starts hidden behind the header logo (Model shows it when the footer comes in)
    <div id="hero-logo-canvas" className={`fixed inset-0 z-10 pointer-events-none flex items-center justify-center ${footerOnly ? 'opacity-0' : ''}`}>
      <div id="3d-canvas-container" className="w-full h-full pointer-events-none">
        <Canvas
          key={contextKey}
          onCreated={handleCreated}
          camera={{ position: [0, 0, 8], fov: 45 }}
          className="w-full h-full"
          // R3F makes its wrapper take the pointer by default
          style={{ pointerEvents: 'none' }}
          frameloop={drawing ? "always" : "never"}
          // Full-screen canvas: capped at 1.5x it looks the same and draws ~45% fewer pixels than 2x
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 5]} intensity={0} />
          <directionalLight position={[-10, -10, -5]} intensity={0} />
          {/* Its own boundary for the lighting and model loads, so they never suspend the page around the
              canvas (off the home page that is the site layout's footer); while they did, no tap on the
              page did anything */}
          <Suspense fallback={null}>
            {/* drei's "city" preset, served from this site (MODEL_ENV_URL) */}
            <Environment files={MODEL_ENV_URL} />
            <Model position={[0, 0, 0]} scale={modelScale} footerOnly={footerOnly} onDrawingChange={setDrawing} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
