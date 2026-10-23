"use client";

import React, { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { shaderMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useAfterIntro from "@/hooks/useAfterIntro";
import useInView from "@/hooks/useInView";
import useGpuWarmup from "@/hooks/useGpuWarmup";

gsap.registerPlugin(ScrollTrigger);

// =============================================
// Constants extracted from the reference code
// =============================================
const RADIUS = 12;
const SPIRAL_TURNS = 2;
const TWO_PI = 2 * Math.PI;
const TOTAL_ANGLE = TWO_PI * SPIRAL_TURNS; // 4π
const RISE_RATE = 28 / TOTAL_ANGLE; // b ≈ 2.228 — vertical rise per radian
const ARC_PER_RAD = Math.sqrt(RADIUS * RADIUS + RISE_RATE * RISE_RATE); // x ≈ 12.205
const TOTAL_ARC = TOTAL_ANGLE * ARC_PER_RAD; // y ≈ 153.3 — total spiral arc length

const NUM_CARDS = 13;
const CARD_SLOT_LENGTH = 5.8 * 1.15; // arc length each card's slot spans (the old landscape card width) — keeps spacing and timing
const CARD_SPACING = 6 * 1; // arc length between successive card starts — scaled to match
const CARD_ARC_LENGTH = 5; // portrait card width, centred in its slot
const CARD_ASPECT = 843 / 629; // poster ratio (height/width) of the 629×843 film posters
const CARD_HEIGHT = CARD_ARC_LENGTH * CARD_ASPECT; // ≈ 6.7
const TOTAL_CARDS_LENGTH = (NUM_CARDS - 1) * CARD_SPACING + CARD_SLOT_LENGTH; // 63.3
const SEGMENTS_X = 116; // horizontal subdivisions per card mesh

// Film posters (13 cards) — Kalicharan and Meri Jung aren't in compressed/, so they come from /img/films.
// WebP copies (web/ folders) of those JPEGs, at the same size
const images = [
  "/img/final/home/all/compressed/web/27_IQBAL_(2005).webp",
  "/img/final/home/all/compressed/web/25_AITRAAZ_(2004).webp",
  "/img/final/home/all/compressed/web/20_YAADEIN_(2001).webp",
  "/img/final/home/all/compressed/web/19_TAAL_(1999).webp",
  "/img/final/home/all/compressed/web/17_PARDES_(1997).webp",
  "/img/final/home/all/compressed/web/13_KHALNAYAK_(1993).webp",
  "/img/final/home/all/compressed/web/11_SAUDAGAR_(1991).webp",
  "/img/final/home/all/compressed/web/10_RAM_LAKHAN_(1987).webp",
  "/img/final/home/all/compressed/web/08_KARMA_(1986).webp",
  "/img/films/web/meri-jung.webp",
  "/img/final/home/all/compressed/web/06_HERO_(1982).webp",
  "/img/final/home/all/compressed/web/04_KARZ_(1980).webp",
  "/img/films/web/kalicharan.webp"
];

// =============================================
// Custom Shader Material
// SDF rounded corners + gl_FrontFacing backface
// =============================================
const CardShaderMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uSize: new THREE.Vector2(CARD_ARC_LENGTH, CARD_HEIGHT),
    uImageAspect: 629 / 843, // texture width/height, set per card
    uRadius: 0.0,
  },
  // Vertex Shader
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  /* glsl */ `
    uniform sampler2D uTexture;
    uniform vec2 uSize;
    uniform float uImageAspect;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;

      // Flip UV vertically so images appear right-side up
      uv.y = 1.0 - uv.y;

      // Flip UV horizontally on backface so the image isn't mirrored
      if (!gl_FrontFacing) {
        uv.x = 1.0 - uv.x;
      }

      // Cover-fit: crop the image to the card's shape instead of stretching it
      float cardAspect = uSize.x / uSize.y;
      if (uImageAspect > cardAspect) {
        uv.x = (uv.x - 0.5) * (cardAspect / uImageAspect) + 0.5;
      } else {
        uv.y = (uv.y - 0.5) * (uImageAspect / cardAspect) + 0.5;
      }

      vec4 tex = texture2D(uTexture, uv);
      gl_FragColor = tex;
    }
  `
);

extend({ CardShaderMaterial });

// =============================================
// Vertex-level spiral deformation
// Exactly replicates the reference SpiralScroll.js
// =============================================
function placeCardOnSpiral(geometry, arcPos, uvWrittenMap, cardIdx, scale = 1) {
  const positions = geometry.attributes.position;
  const uvs = geometry.attributes.uv;
  const scaledArc = CARD_ARC_LENGTH * scale;
  const scaledHeight = CARD_HEIGHT * scale;
  const halfH = scaledHeight * 0.5;
  // Center the card (and its hover scale) in its slot
  const startArc = arcPos + (CARD_SLOT_LENGTH - scaledArc) * 0.5;

  for (let col = 0; col <= SEGMENTS_X; col++) {
    const u = col / SEGMENTS_X; // 0 → 1 across card width
    const arcAtCol = startArc + u * scaledArc;
    const theta = arcAtCol / ARC_PER_RAD; // convert arc length → angle

    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    // Gaussian dip near the spiral midpoint (reference: V = 2π)
    const dt = (theta - TWO_PI) / 2;
    const gaussVal = 2.5 * Math.exp(-dt * dt);
    const gaussDeriv = -2 * dt / 2 * gaussVal; // = -dt * gaussVal

    // Spiral center point
    // Clockwise: negate sin for Z so cards rotate clockwise from above
    const cx = RADIUS * cosT;
    const cy = -16 + theta * RISE_RATE - gaussVal;
    const cz = RADIUS * sinT; // negated for clockwise

    // Cards stand perfectly vertical (like a cylinder)
    // Top and bottom edges are always horizontal — no tilt
    const bx = 0;
    const by = 1;
    const bz = 0;

    // PlaneGeometry(1,1,116,1) vertex layout:
    //   Row 0 (indices 0..116)      = top    (default y = +0.5)
    //   Row 1 (indices 117..233)     = bottom (default y = -0.5)

    // Top vertex (+halfH along Y)
    const topIdx = col;
    positions.setXYZ(
      topIdx,
      cx,
      cy + halfH,
      cz
    );

    // Bottom vertex (-halfH along Y)
    const botIdx = (SEGMENTS_X + 1) + col;
    positions.setXYZ(
      botIdx,
      cx,
      cy - halfH,
      cz
    );

    // Write UVs once
    if (!uvWrittenMap[cardIdx]) {
      uvs.setXY(topIdx, u, 0); // top row → bottom of texture (fixes Y inversion)
      uvs.setXY(botIdx, u, 1); // bottom row → top of texture
    }
  }

  positions.needsUpdate = true;
  if (!uvWrittenMap[cardIdx]) {
    uvs.needsUpdate = true;
    uvWrittenMap[cardIdx] = true;
  }
}

// =============================================
// SpiralCards — the 3D scene content
// =============================================
const SpiralCards = ({ progressRef, invalidateRef }) => {
  const meshRefs = useRef([]);
  const textures = useTexture(images);
  const uvWritten = useRef({});
  const smoothP = useRef(0);
  const hoverStates = useRef(new Array(NUM_CARDS).fill(false));
  const hoverScales = useRef(new Array(NUM_CARDS).fill(1));
  // Where each card was last laid along the spiral, and at what hover scale, so a card that hasn't
  // moved isn't rebuilt and sent to the GPU again
  const placed = useRef([]);
  // The nine posters go up to the GPU now, not on the first frame the spiral is scrolled to
  useGpuWarmup();

  // The canvas only draws when asked (frameloop "demand"): by the scroll (SpiralScene hands it this),
  // by a hover, and by itself while it is still easing after either. Coming back into view
  // ("never" to "demand") it draws once straight away.
  const invalidate = useThree((state) => state.invalidate);
  const frameloop = useThree((state) => state.frameloop);
  useEffect(() => {
    invalidateRef.current = invalidate;
    return () => {
      invalidateRef.current = null;
    };
  }, [invalidate, invalidateRef]);
  useEffect(() => {
    if (frameloop === "demand") invalidate();
  }, [frameloop, invalidate]);

  // Create one PlaneGeometry per card (shared would cause conflicts)
  const geometries = useMemo(() => {
    return images.map(() => {
      const geo = new THREE.PlaneGeometry(1, 1, SEGMENTS_X, 1);
      // Disable frustum culling by expanding bounds
      geo.boundingBox = new THREE.Box3(
        new THREE.Vector3(-1000, -1000, -1000),
        new THREE.Vector3(1000, 1000, 1000)
      );
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1000);
      return geo;
    });
  }, []);

  useFrame((state, delta) => {
    // Smooth interpolation of scroll progress; once it has caught up (well under a pixel) it lands
    // exactly and the canvas stops drawing until the scroll moves again
    const target = progressRef.current;
    smoothP.current += (target - smoothP.current) * 0.1;
    let easing = Math.abs(target - smoothP.current) > 1e-5;
    if (!easing) smoothP.current = target;
    const p = smoothP.current;

    // Reference formula for arc offset:
    //   offset = p * (TOTAL_ARC + TOTAL_CARDS_LENGTH) - TOTAL_CARDS_LENGTH + 25
    const arcOffset =
      p * (TOTAL_ARC + TOTAL_CARDS_LENGTH) - TOTAL_CARDS_LENGTH + 25;

    // Smoothly interpolate hover scales. The first frame after the canvas has been idle reports all
    // the time since its last one, so the step is capped or the hover would jump straight to full size.
    const lerpSpeed = 1 - Math.pow(0.001, Math.min(delta, 1 / 30));
    for (let i = 0; i < NUM_CARDS; i++) {
      const targetScale = hoverStates.current[i] ? 1.1 : 1;
      hoverScales.current[i] += (targetScale - hoverScales.current[i]) * lerpSpeed;
      if (Math.abs(targetScale - hoverScales.current[i]) > 1e-4) easing = true;
      else hoverScales.current[i] = targetScale;
    }
    if (easing) state.invalidate();

    for (let i = 0; i < NUM_CARDS; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;

      const cardArcPos = arcOffset + CARD_SPACING * i;
      const visible = p < 0.999 && cardArcPos > 0 && cardArcPos < TOTAL_ARC;

      mesh.visible = visible;
      if (!visible) continue;

      // Deform mesh vertices to follow the spiral (with hover scale), unless it is already there
      const arcPos = Math.min(cardArcPos, TOTAL_ARC - 0.001);
      const last = placed.current[i];
      if (!last || last.arcPos !== arcPos || last.scale !== hoverScales.current[i]) {
        placeCardOnSpiral(mesh.geometry, arcPos, uvWritten.current, i, hoverScales.current[i]);
        placed.current[i] = { arcPos, scale: hoverScales.current[i] };
      }

      // Set renderOrder higher for hovered cards so they appear on top
      mesh.renderOrder = hoverStates.current[i] ? 10 : 1;

      // Reset transform — vertex positions are already in world space
      mesh.position.set(0, 0, 0);
      mesh.rotation.set(0, 0, 0);
      mesh.scale.set(1, 1, 1);
    }
  });

  return (
    <group>
      {images.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          visible={false}
          frustumCulled={false}
          renderOrder={1}
          onPointerOver={(e) => {
            e.stopPropagation();
            hoverStates.current[i] = true;
            document.body.style.cursor = "pointer";
            invalidate();
          }}
          onPointerOut={() => {
            hoverStates.current[i] = false;
            document.body.style.cursor = "auto";
            invalidate();
          }}
        >
          <primitive object={geometries[i]} attach="geometry" />
          <cardShaderMaterial
            uTexture={textures[i]}
            uImageAspect={textures[i].image.width / textures[i].image.height}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

// =============================================
// Main exported component
// =============================================
export default function SpiralScene() {
  const containerRef = useRef(null);
  const progressRef = useRef(0);

  const timelineRef = useRef(null);
  // Asks the canvas for a frame (it only draws on demand); set by SpiralCards once it is up
  const invalidateRef = useRef(null);
  // The nine card textures load once the home intro has played; the canvas only draws near the screen
  const cardsOn = useAfterIntro();
  const inView = useInView(containerRef);

  useGSAP(
    () => {
      // Initial states
      gsap.set(".NAMEDIV2", { autoAlpha: 0, pointerEvents: "none" }); // Hide entirely initially
      gsap.set(".spiral-canvas", { pointerEvents: "auto" });
      gsap.set(".film-carousel-image", { y: "100vh" }); // Images outside screen
      gsap.set(".film-text-content", { opacity: 0 }); // Text opacity 0

      let filmsVisible = false;

      timelineRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom -120%",
          scrub: true,
          onUpdate: (self) => {
            // The spiral has moved on with the scroll: draw it
            invalidateRef.current?.();

            if (self.progress > 0.95 && !filmsVisible) {
              filmsVisible = true;

              // Show the section container and allow clicks
              gsap.set(".NAMEDIV2", { autoAlpha: 1, pointerEvents: "auto" });
              gsap.set(".spiral-canvas", { pointerEvents: "none" });

              // Force Embla carousel to recalculate dimensions after visibility change
              setTimeout(() => window.dispatchEvent(new Event('resize')), 50);

              // Animate images sliding up from outside the screen
              gsap.to(".film-carousel-image", {
                y: "0",
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out",
                overwrite: "auto"
              });

              // Animate text fading in
              gsap.to(".film-text-content", {
                opacity: 1,
                stagger: 0.1,
                duration: 0.8,
                delay: 0.3,
                ease: "power2.out",
                overwrite: "auto"
              });
            } else if (self.progress <= 0.95 && filmsVisible) {
              filmsVisible = false;

              // Reverse animations when scrolling back up
              gsap.to(".film-text-content", {
                opacity: 0,
                duration: 0.3,
                overwrite: "auto"
              });

              gsap.to(".film-carousel-image", {
                y: "100vh",
                duration: 0.5,
                ease: "power3.in",
                overwrite: "auto"
              });

              gsap.set(".NAMEDIV2", {
                autoAlpha: 0,
                pointerEvents: "none",
                delay: 0.5
              });

              gsap.set(".spiral-canvas", { pointerEvents: "auto", delay: 0.5 });
            }
          }
        },
      });

      // 1. First, animate the 3D spiral from start to finish
      // By tweening progressRef.current, the spiral completes before moving to the next animation.
      timelineRef.current.to(progressRef, {
        current: 1,
        duration: 1,
        ease: "none"
      }, 'a1');

      // 2. THEN, after the spiral is completely finished, run the next animation
      timelineRef.current.to(".NAMEDIV1", {
        opacity: 0,
        y: -50,
        duration: 0.5
      }, 'a1');
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-[400vh] relative bg-[white] "
    >

      <div className="sticky top-0 w-full h-screen overflow-hidden">

        <div className=" NAMEDIV1 absolute top-0 left-0 z-[-1]  w-full h-full flex justify-center items-center">
          {/* Word for word from the content doc; the bold runs are bold there too */}
          <h5 className="w-[90vw] sm:w-2/3 text-center font-['SwitzerR'] text-balance">
            Mukta Arts is the vision of Subhash Ghai, one of India's most celebrated filmmakers, who founded the company in 1978. What started with landmark films like Karz, Ram Lakhan, Khalnayak and Pardes has grown into an entertainment group spanning production, exhibition, animation and education. Through Whistling Woods International, Mukta A2 Cinemas and SGM Studios, the group continues to shape how stories are made, taught and experienced across India. 
          </h5>
        </div>

        <Canvas
          className="spiral-canvas relative z-[1]"
          // Only draws when the scroll or a hover changes something (see SpiralCards), not on every
          // frame while it sits still on screen: on a phone that was a full-screen redraw at 60fps
          // for nothing, competing with the scroll for the GPU
          frameloop={inView ? "demand" : "never"}
          // Full-screen canvas: capped at 1.5x it looks the same and draws ~45% fewer pixels than 2x
          dpr={[1, 1.5]}
          // R3F needn't measure it again after every scroll: nothing here uses where it sits on the page
          resize={{ scroll: false }}
          camera={{ position: [0, 0, 22], fov: 52 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            {cardsOn && <SpiralCards progressRef={progressRef} invalidateRef={invalidateRef} />}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
