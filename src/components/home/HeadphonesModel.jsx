"use client"
import React, { useRef, useEffect } from 'react';
import { useGLTF, Environment, Center } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
// The same GSAP + ScrollTrigger instance as the rest of the site, so these triggers update in
// step with Lenis instead of on a second, separate copy listening to the scroll on its own
import { gsap, ScrollTrigger } from '@/lib/motion';
import { modelIntro, MODEL_FRONT_Y, IDLE_SPEED, setModelReady } from '@/lib/homeIntro';

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
// The trip up to the header logo runs from this much of a screen's scroll to this much
// (fractions of the viewport height)
const DOCK_START = 0.05;
const DOCK_END = 0.85;
// Share of that trip after which it starts turning to face front (below it, it is back in the hero
// and turning on its own, so it doesn't wait for the scroll to settle exactly at the top)
const DOCK_TURN_FROM = 0.03;
// Share of that trip over which the scroll brings the model round to face front (it starts turning
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

export function Model({ onDrawingChange, scale: baseScale = 1, ...props }) {
  const { scene } = useGLTF('/model/ModelV2.glb');
  const introRef = useRef();
  const groupRef = useRef();
  const spinRef = useRef();
  const { size, camera, gl, scene: rootScene } = useThree();

  // dockP: 0 in the hero, 1 once it has reached the header logo
  // footerP: 0 until the footer comes into view, 1 once the model sits in it
  const stateRef = useRef({ dockP: 0, footerP: 0 });
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
      if (turningFront() || modelIntro.idle < 1 || !(target instanceof Element)) return false;
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
    const compiled = gl.compileAsync ? gl.compileAsync(rootScene, camera) : Promise.resolve(gl.compile(rootScene, camera));
    compiled
      .catch(() => {})
      .then(() => requestAnimationFrame(() => !cancelled && setModelReady(true)));

    return () => {
      cancelled = true;
      setModelReady(false);
    };
  }, [scene, gl, rootScene, camera]);

  useFrame((state, delta) => {
    // Capped so a long frame (or the first one after drawing resumes) never jumps the motion
    const dt = Math.min(delta, 0.1);

    // Hero intro (driven by Hero.jsx): rise from below and turn into place
    if (introRef.current) {
      introRef.current.position.y = modelIntro.y;
      introRef.current.rotation.y = modelIntro.spin;
      introRef.current.rotation.x = modelIntro.tilt;
      introRef.current.scale.setScalar(modelIntro.scale);
    }

    // Measured once, upright (no intro tilt): the model's height in its own units
    if (!modelHeightRef.current && modelIntro.tilt === 0) {
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
      groupRef.current.scale.setScalar(scale);
    }

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
          const start = Math.min((s.speed * modelIntro.idle * IDLE_SPEED * duration) / distance, 3);
          s.settle = { from, to, t: 0, duration, start };
          s.angle = from;
          s.drag = s.dragTarget = 0;
        }
        const st = s.settle;
        st.t = Math.min(st.t + dt, st.duration);
        const timed = st.from + (st.to - st.from) * settleEase(st.t / st.duration, st.start);
        // ...and the scroll makes sure it is there by the time it swaps, however fast the scroll
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
        s.angle += dt * IDLE_SPEED * s.speed * modelIntro.idle;
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
      // Hero to header logo: spread over most of the hero's scroll, so the logo visibly travels
      // up to the corner (the move, the shrink and the turn happen every frame, in useFrame)
      gsap.fromTo(state, { dockP: 0 }, {
        dockP: 1,
        ease: 'none',
        onUpdate: update,
        scrollTrigger: {
          trigger: document.body,
          start: () => window.innerHeight * DOCK_START,
          end: () => window.innerHeight * DOCK_END,
          scrub: 1,
        },
      });

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
    };
  }, [onDrawingChange]);

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

useGLTF.preload('/model/headphones.glb');

export default function HeadphonesCanvas() {
  const [modelScale, setModelScale] = React.useState(30);
  // False while the model is docked in the header and this canvas is hidden
  const [drawing, setDrawing] = React.useState(true);

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
    <div id="hero-logo-canvas" className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center">
      <div id="3d-canvas-container" className="w-full h-full pointer-events-none">
        <Canvas
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
          <Environment preset="city" />
          <Model position={[0, 0, 0]} scale={modelScale} onDrawingChange={setDrawing} />
        </Canvas>
      </div>
    </div>
  );
}
