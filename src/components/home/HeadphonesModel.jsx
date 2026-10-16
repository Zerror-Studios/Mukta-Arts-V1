"use client"
import React, { useRef, useEffect } from 'react';
import { useGLTF, Environment, Center } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
// The same GSAP + ScrollTrigger instance as the rest of the site, so these triggers update in
// step with Lenis instead of on a second, separate copy listening to the scroll on its own
import { gsap } from '@/lib/motion';
import { modelIntro, setModelReady } from '@/lib/homeIntro';

// Reused every frame while the model follows the header logo / footer, instead of allocating new vectors
const _point = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _dockPos = new THREE.Vector3();
const _footerPos = new THREE.Vector3();
const TURN = Math.PI * 2;

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

export function Model({ onDrawingChange, ...props }) {
  const { scene } = useGLTF('/model/headphones.glb');
  const introRef = useRef();
  const groupRef = useRef();
  const spinRef = useRef();
  const { size, camera, gl, scene: rootScene } = useThree();

  // dockP: 0 in the hero, 1 once shrunk into the header's top-left corner
  const stateRef = useRef({ footerProgress: 0, dockP: 0, minimised: false });
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

      // Docked spot (the centre of the header logo), blended in as the hero timeline scrolls
      _dockPos.set(0, 0, 0);
      if (dockP > 0) {
        if (!dock.logo || !dock.logo.isConnected) dock.logo = document.getElementById('header-dock-logo');
        if (dock.logo) elementToWorld(dock.logo, size, camera, _dockPos).multiplyScalar(dockP);
        else _dockPos.set(0, 3 * dockP, 0);
      }
      pos.copy(_dockPos);

      if (footerProgress > 0) {
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

      // Auto rotate locally when in hero and not dragging
      if (!minimised && footerProgress === 0 && !isDragging.current) {
        // Capped so a long frame (or the first one after drawing resumes) never jumps the spin
        targetRotation.current.y += Math.min(delta, 0.1) * 0.5;
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
      const t = THREE.MathUtils.clamp((heroP - 0.75) / 0.25, 0, 1);
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
        scrollTrigger: {
          trigger: document.body,
          start: "top -49%",
          end: "100vh top",
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
      tl.to(groupRef.current.scale, { x: 1, y: 1, z: 1, ease: "power2.inOut" }, 0);
      // The move itself happens every frame (useFrame), towards wherever the header logo is
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
        footerTl.to(groupRef.current.scale, { x: 20, y: 20, z: 20, ease: "power2.inOut" }, 0);
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
          <Center>
            <primitive object={scene} />
          </Center>
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
