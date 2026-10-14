"use client"
import React, { useRef, useEffect } from 'react';
import { useGLTF, Environment, Center } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function Model(props) {
  const { scene } = useGLTF('/model/headphones.glb');
  const groupRef = useRef();
  const spinRef = useRef();
  const { size, camera } = useThree();

  const stateRef = useRef({ footerProgress: 0 });
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
      if (isDragging.current) {
        const deltaX = e.clientX - previousMouse.current.x;
        targetRotation.current.y += deltaX * 0.01;
        previousMouse.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  useFrame((state, delta) => {
    // 1. Follow the footer div position
    if (groupRef.current) {
      const footerProgress = stateRef.current.footerProgress;

      if (footerProgress > 0) {
        const targetDiv = document.getElementById('footer-headphone');
        if (targetDiv) {
          const rect = targetDiv.getBoundingClientRect();
          // Map center of the div in screen coordinates (-1 to 1)
          const x = ((rect.left + rect.width / 2) / size.width) * 2 - 1;
          const y = -((rect.top + rect.height / 2) / size.height) * 2 + 1;

          // Unproject to 3D space
          const vector = new THREE.Vector3(x, y, 0);
          vector.unproject(camera);
          const dir = vector.sub(camera.position).normalize();
          const distance = -camera.position.z / dir.z;
          const targetPos = camera.position.clone().add(dir.multiplyScalar(distance));

          const startX = 0;
          const startY = 3;

          // Eased progress for smooth transition matching GSAP
          const easeProgress = footerProgress < 0.5
            ? 2 * footerProgress * footerProgress
            : 1 - Math.pow(-2 * footerProgress + 2, 2) / 2;

          groupRef.current.position.x = startX + (targetPos.x - startX) * easeProgress;
          groupRef.current.position.y = startY + (targetPos.y - startY) * easeProgress;
          groupRef.current.position.z = targetPos.z * easeProgress;
        }
      }
    }

    // 2. Mouse Rotation
    if (spinRef.current) {
      // Smoothly interpolate current rotation to target drag rotation
      spinRef.current.rotation.y = THREE.MathUtils.lerp(spinRef.current.rotation.y, targetRotation.current.y, 0.1);

      // Auto rotate locally when in hero and not dragging
      if (stateRef.current.footerProgress === 0 && !isDragging.current) {
        targetRotation.current.y += delta * 0.5;
      }
    }
  });

  useEffect(() => {
    if (!groupRef.current) return;

    const ctx = gsap.context(() => {
      // Hero to Navbar timeline
      const tl = gsap.timeline({
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

      tl.to(groupRef.current.scale, { x: 1, y: 1, z: 1, ease: "power2.inOut" }, 0);
      tl.to(groupRef.current.position, { y: 3, ease: "power2.inOut" }, 0);

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
            }
          }
        });
        footerTl.to(groupRef.current.scale, { x: 15, y: 15, z: 15, ease: "power2.inOut" }, 0);
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <group ref={groupRef} {...props}>
      <group ref={spinRef}>
        <Center>
          <primitive object={scene} />
        </Center>
      </group>
    </group>
  );
}

useGLTF.preload('/model/headphones.glb');

export default function HeadphonesCanvas() {
  const [modelScale, setModelScale] = React.useState(30);

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
    <div className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center">
      <div id="3d-canvas-container" className="w-full h-full pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} className="w-full h-full">
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 5]} intensity={0} />
          <directionalLight position={[-10, -10, -5]} intensity={0} />
          <Environment preset="city" />
          <Model position={[0, 0, 0]} scale={modelScale} />
        </Canvas>
      </div>
    </div>
  );
}
