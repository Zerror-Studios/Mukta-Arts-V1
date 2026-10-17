"use client"
import React, { useRef, useEffect } from 'react';
import { useGLTF, Environment, Center } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
// The same GSAP + ScrollTrigger instance as the rest of the site, so these triggers update in
// step with Lenis instead of on a second, separate copy listening to the scroll on its own
import { gsap } from '@/lib/motion';
import { modelIntro, MODEL_FRONT_Y, setModelReady } from '@/lib/homeIntro';

// Reused every frame while the model follows the header logo / footer, instead of allocating new vectors
const _point = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _dockPos = new THREE.Vector3();
const _footerPos = new THREE.Vector3();
const _size = new THREE.Vector3();
const _worldScale = new THREE.Vector3();
const TURN = Math.PI * 2;
// Share of the header logo image's height that the headphones fill (the PNG has a little padding),
// so the docked 3D logo ends the same size as the flat one it cross-fades into
const DOCK_FILL = 0.86;
// The dock runs from this much of a screen's scroll to this much (fractions of the viewport height)
const DOCK_START = 0.1;
const DOCK_END = 0.9;
// Share of the dock after which the 3D logo cross-fades into the flat header logo
const DOCK_FADE_FROM = 0.88;

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
  const { scene } = useGLTF('/model/headphones.glb');
  const introRef = useRef();
  const groupRef = useRef();
  const spinRef = useRef();
  const { size, camera, gl, scene: rootScene } = useThree();

  // dockP: 0 in the hero, 1 once shrunk into the header's top-left corner
  const stateRef = useRef({ footerProgress: 0, dockP: 0, minimised: false });
  // The model's own height (before any scaling), measured once it is upright
  const modelHeightRef = useRef(0);
  const heroTlRef = useRef(null);
  const dockRef = useRef({ canvas: null, logo: null, footer: null, last: -1, drawing: true });
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerDown = (e) => {
      // Allow dragging everywhere
      isDragging.current = true;
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };
    const handlePointerUp = () => {
      isDragging.current = false;
    };
    const handlePointerMove = (e) => {
      // No dragging while it sits minimised in the corner
      if (isDragging.current && !stateRef.current.minimised) {
        const deltaX = e.clientX - previousMouse.current.x;
        targetRotation.current.y += deltaX * 0.01;
        previousMouse.current = { x: e.clientX, y: e.clientY };
      }
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
    // Hero intro (driven by Hero.jsx): rise from below, spin and settle into place
    if (introRef.current) {
      introRef.current.position.y = modelIntro.y;
      introRef.current.rotation.y = modelIntro.spin;
      introRef.current.rotation.x = modelIntro.tilt;
      introRef.current.scale.setScalar(modelIntro.scale);
    }

    const { footerProgress, dockP } = stateRef.current;
    const dock = dockRef.current;

    // 1. Shrink towards the dock logo in the header's top-left corner, then follow the footer div
    if (groupRef.current) {
      const pos = groupRef.current.position;

      // Docked spot (the centre of the header logo) and docked size (the logo's height on screen),
      // both blended in as the hero timeline scrolls
      _dockPos.set(0, 0, 0);
      let dockScale = 1;
      if (dockP > 0) {
        if (!dock.logo || !dock.logo.isConnected) dock.logo = document.getElementById('header-dock-logo');
        if (dock.logo) {
          elementToWorld(dock.logo, size, camera, _dockPos).multiplyScalar(dockP);

          // Measured once, upright (no intro tilt): the model's height in its own units
          if (!modelHeightRef.current && modelIntro.tilt === 0) {
            new THREE.Box3().setFromObject(scene).getSize(_size);
            scene.getWorldScale(_worldScale);
            modelHeightRef.current = _size.y / _worldScale.y;
          }
          // World units per screen pixel on the plane the model moves in (z = 0)
          const worldPerPx = (2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / size.height;
          const logoHeight = dock.logo.getBoundingClientRect().height;
          if (modelHeightRef.current && logoHeight) {
            dockScale = (logoHeight * worldPerPx * DOCK_FILL) / modelHeightRef.current;
          }
        } else {
          _dockPos.set(0, 3 * dockP, 0);
        }
      }
      pos.copy(_dockPos);

      // Shrink from the hero size to the header logo's size, evenly (by ratio, not by amount,
      // so it doesn't collapse at the start and crawl at the end). The footer timeline owns the
      // scale while it plays (it zooms the model up into the footer).
      if (footerProgress === 0) {
        groupRef.current.scale.setScalar(baseScale * Math.pow(dockScale / baseScale, dockP));
      }      if (footerProgress > 0) {
        if (!dock.footer || !dock.footer.isConnected) dock.footer = document.getElementById('footer-headphone');
        if (dock.footer) {
          const targetPos = elementToWorld(dock.footer, size, camera, _footerPos);

          // Eased progress for smooth transition matching GSAP
          const easeProgress = footerProgress < 0.5
            ? 2 * footerProgress * footerProgress
            : 1 - Math.pow(-2 * footerProgress + 2, 2) / 2;

          pos.lerp(targetPos, easeProgress);
        }
      }
    }

    // 2. Rotation
    if (spinRef.current) {
      // Minimised (shrinking into or sitting in the corner): stop spinning and settle facing front,
      // so it lines up with the flat header logo it cross-fades into
      const minimised = dockP > 0.02 && footerProgress === 0;
      if (minimised && !stateRef.current.minimised) {
        targetRotation.current.y = Math.round(spinRef.current.rotation.y / TURN) * TURN;
        isDragging.current = false;
      }
      stateRef.current.minimised = minimised;

      // Smoothly interpolate current rotation to target drag rotation
      spinRef.current.rotation.y = THREE.MathUtils.lerp(spinRef.current.rotation.y, targetRotation.current.y, 0.1);

      // Auto rotate locally when in hero and not dragging. The hero intro holds this at 0
      // (modelIntro.idle) so the logo lands and stays facing front, then eases it back in.
      if (!minimised && footerProgress === 0 && !isDragging.current) {
        // Capped so a long frame (or the first one after drawing resumes) never jumps the spin
        targetRotation.current.y += Math.min(delta, 0.1) * 0.5 * modelIntro.idle;
      }
    }
  });

  useEffect(() => {
    if (!groupRef.current) return;

    // 0. Dock: as the shrinking model reaches the top it cross-fades into the flat logo
    //    in the header's top-left corner, and comes back when the hero (or the footer) needs it.
    //    Driven by the scroll timelines below instead of every frame; while the canvas is fully
    //    faded out it stops drawing altogether (it covers the whole screen).
    const dock = dockRef.current;
    const updateDock = () => {
      if (!dock.canvas) dock.canvas = document.getElementById('hero-logo-canvas');
      if (!dock.logo || !dock.logo.isConnected) dock.logo = document.getElementById('header-dock-logo');
      if (!dock.canvas) return;

      const heroP = heroTlRef.current ? heroTlRef.current.progress() : 0;

      // While it travels to the corner the logo must pass over the page, not behind it: the hero's
      // tagline and button (z-20) scroll through the top-left right as it arrives. Lifted above the
      // content but under the header (z-50); back to its usual layer in the hero and the footer.
      const docking = heroP > 0.001 && stateRef.current.footerProgress === 0;
      const zIndex = docking ? '45' : '';
      if (dock.canvas.style.zIndex !== zIndex) dock.canvas.style.zIndex = zIndex;

      // Cross-fade only at the very end, once the 3D logo has reached the flat logo's size and spot
      const t = THREE.MathUtils.clamp((heroP - DOCK_FADE_FROM) / (1 - DOCK_FADE_FROM), 0, 1);
      const docked = t * t * (3 - 2 * t);
      const back = THREE.MathUtils.clamp(stateRef.current.footerProgress * 5, 0, 1);
      const logoOpacity = docked * (1 - back);
      const canvasOpacity = Math.max(1 - docked, back);

      if (Math.abs(logoOpacity - dock.last) > 0.001) {
        dock.last = logoOpacity;
        dock.canvas.style.opacity = String(canvasOpacity);
        if (dock.logo) {
          dock.logo.style.opacity = String(logoOpacity);
          dock.logo.style.visibility = logoOpacity > 0.01 ? 'visible' : 'hidden';
          dock.logo.style.pointerEvents = logoOpacity > 0.5 ? 'auto' : 'none';
        }
      }

      const drawing = canvasOpacity > 0.001;
      if (drawing !== dock.drawing) {
        dock.drawing = drawing;
        onDrawingChange?.(drawing);
      }
    };

    const ctx = gsap.context(() => {
      // Hero to Navbar timeline
      const tl = gsap.timeline({
        onUpdate: updateDock,
        // Spread over most of the hero's scroll, so the logo visibly travels up to the corner
        scrollTrigger: {
          trigger: document.body,
          start: () => window.innerHeight * DOCK_START,
          end: () => window.innerHeight * DOCK_END,
          invalidateOnRefresh: true,
          scrub: 1,
          onUpdate: (self) => {
            const canvasContainer = document.getElementById('3d-canvas-container');
            if (canvasContainer) {
              if (self.progress > 0.05 && stateRef.current.footerProgress === 0) {
                canvasContainer.style.pointerEvents = 'none';
              } else if (stateRef.current.footerProgress === 0) {
                canvasContainer.style.pointerEvents = 'auto';
              }
            }
          }
        }
      });

      heroTlRef.current = tl;
      // The move and the shrink happen every frame (useFrame), towards wherever the header logo is
      // and down to its size on screen
      tl.to(stateRef.current, { dockP: 1, ease: "power2.inOut" }, 0);

      // Footer timeline setup
      let mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const footerTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#footer",
            start: "top 15%",
            end: "top 0%",

            scrub: 1,
            onUpdate: (self) => {
              stateRef.current.footerProgress = self.progress;
              updateDock();
            }
          }
        });
        footerTl.to(groupRef.current.scale, { x: 25, y: 25, z: 25, ease: "power2.inOut" }, 0);
      });

      mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
        const footerTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#footer",
            start: "top 20%",
            end: "top 0%",
            scrub: 1,

            onUpdate: (self) => {
              stateRef.current.footerProgress = self.progress;
              updateDock();
            }
          }
        });
        footerTl.to(groupRef.current.scale, { x: 8, y: 8, z: 8, ease: "power2.inOut" }, 0);
      });

      mm.add("(max-width: 767px)", () => {
        const footerTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#footer",
            start: "top 20%",
            end: "top 0%",
            scrub: 1,

            onUpdate: (self) => {
              stateRef.current.footerProgress = self.progress;
              updateDock();
            }
          }
        });
        footerTl.to(groupRef.current.scale, { x: 15, y: 15, z: 15, ease: "power2.inOut" }, 0);
      });
    });

    updateDock();

    return () => {
      ctx.revert();
      if (!dock.drawing) {
        dock.drawing = true;
        onDrawingChange?.(true);
      }
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
  // False while the model is docked in the header and this canvas is fully faded out
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
    <div id="hero-logo-canvas" className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center">
      <div id="3d-canvas-container" className="w-full h-full pointer-events-auto">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          className="w-full h-full"
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
