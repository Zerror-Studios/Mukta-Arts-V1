// "use client";
// import React, {
//   Suspense,
//   useCallback,
//   useEffect,
//   useLayoutEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import * as THREE from "three";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { useTexture } from "@react-three/drei";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// /* -------------------------------------------------------------------------- */
// /*  DATA                                                                      */
// /* -------------------------------------------------------------------------- */
// const programsData = [
//   {
//     id: "01",
//     title: "University Affiliation",
//     description:
//       "01",
//     mainImage:
//       "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200",
//     thumbImage:
//       "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=200",
//   },
//   {
//     id: "02",
//     title: "Global Partnerships",
//     description:
//       "02",
//     mainImage:
//       "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200",
//     thumbImage:
//       "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=200",
//   },
//   {
//     id: "03",
//     title: "Industry Integration",
//     description:
//       "03",
//     mainImage:
//       "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200",
//     thumbImage:
//       "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=200",
//   },
// ];

// const SECTION_LABEL = "Academic programs";
// const BG = "#f7f8f9"; // section background; title uses same colour + difference blend

// /* -------------------------------------------------------------------------- */
// /*  SHADERS                                                                   */
// /* -------------------------------------------------------------------------- */
// const vertexShader = /* glsl */ `
//   varying vec2 vUv;
//   uniform vec2 uMouse;
//   uniform float uHover;
//   uniform vec2 uPlane;

//   void main() {
//     vUv = uv;
//     vec3 pos = position;

//     // soft bulge that follows the cursor
//     vec2 d = (uv - uMouse) * vec2(uPlane.x / uPlane.y, 1.0);
//     pos.z += exp(-dot(d, d) * 14.0) * uHover * 0.14;

//     gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
//   }
// `;

// const fragmentShader = /* glsl */ `
//   precision highp float;

//   uniform sampler2D uTex0;
//   uniform sampler2D uTex1;
//   uniform vec2 uRes0;
//   uniform vec2 uRes1;
//   uniform vec2 uPlane;
//   uniform vec2 uMouse;
//   uniform float uMix;
//   uniform float uTime;
//   uniform float uHover;
//   uniform float uVel;

//   varying vec2 vUv;

//   float hash(vec2 p) {
//     return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
//   }

//   float noise(vec2 p) {
//     vec2 i = floor(p);
//     vec2 f = fract(p);
//     f = f * f * (3.0 - 2.0 * f);
//     return mix(
//       mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
//       mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
//       f.y
//     );
//   }

//   // object-fit: cover
//   vec2 cover(vec2 uv, vec2 img) {
//     float pr = uPlane.x / uPlane.y;
//     float ir = img.x / img.y;
//     vec2 s = pr > ir ? vec2(1.0, ir / pr) : vec2(pr / ir, 1.0);
//     return (uv - 0.5) * s + 0.5;
//   }

//   vec3 sampleBoth(vec2 u, float reveal) {
//     // outgoing image slowly zooms in, incoming image settles from a zoom
//     vec2 u0 = (u - 0.5) * (1.0 - 0.08 * uMix) + 0.5;
//     vec2 u1 = (u - 0.5) * (1.0 - 0.12 * (1.0 - uMix)) + 0.5;
//     vec3 a = texture2D(uTex0, cover(u0, uRes0)).rgb;
//     vec3 b = texture2D(uTex1, cover(u1, uRes1)).rgb;
//     return mix(a, b, reveal);
//   }

//   void main() {
//     vec2 uv = vUv;
//     float aspect = uPlane.x / uPlane.y;

//     /* ---------- mouse: ripple + lens pull + parallax ---------- */
//     vec2 toM = (uv - uMouse) * vec2(aspect, 1.0);
//     float dist = length(toM);
//     vec2 dir = dist > 0.0001 ? toM / dist : vec2(1.0, 0.0);

//     float influence = smoothstep(0.5, 0.0, dist) * uHover;
//     float ripple = sin(dist * 30.0 - uTime * 3.5) * exp(-dist * 5.0);

//     vec2 offset = dir * (influence * 0.04 + ripple * 0.014 * uHover * (0.35 + uVel));
//     offset /= vec2(aspect, 1.0);
//     uv -= offset;
//     uv -= (uMouse - 0.5) * 0.02 * uHover; // parallax

//     /* ---------- scroll transition: noisy wipe from the bottom ---------- */
//     float n = noise(uv * vec2(3.0, 2.0) + uTime * 0.15);
//     float pad = 0.35;
//     float w = 0.15;
//     float t = uMix * (1.0 + 2.0 * pad) - pad;
//     float coord = uv.y + (n - 0.5) * 0.2;

//     float reveal = 1.0 - smoothstep(t - w, t + w, coord);
//     float band = 1.0 - smoothstep(0.0, w * 1.5, abs(coord - t));

//     vec2 warp = vec2((n - 0.5) * 0.05, 0.05) * band;
//     vec2 uvw = uv + warp;

//     /* ---------- chromatic aberration ---------- */
//     float ca = influence * 0.006 + uVel * uHover * 0.004 + band * 0.01;
//     vec2 caDir = normalize(dir + vec2(0.0001));

//     float r = sampleBoth(uvw + caDir * ca, reveal).r;
//     float g = sampleBoth(uvw, reveal).g;
//     float b = sampleBoth(uvw - caDir * ca, reveal).b;

//     vec3 col = vec3(r, g, b);
//     col += band * 0.03; // faint glow on the wipe edge

//     gl_FragColor = vec4(col, 1.0);
//     #include <colorspace_fragment>
//   }
// `;

// /* -------------------------------------------------------------------------- */
// /*  WEBGL PLANE                                                               */
// /* -------------------------------------------------------------------------- */
// function ImagePlane({ urls, targetRef }) {
//   const meshRef = useRef(null);
//   const { viewport } = useThree();
//   const textures = useTexture(urls);

//   const state = useRef({
//     progress: 0,
//     from: -1,
//     hover: 0,
//     hoverTarget: 0,
//     vel: 0,
//     mouse: new THREE.Vector2(0.5, 0.5),
//     mouseTarget: new THREE.Vector2(0.5, 0.5),
//     prev: new THREE.Vector2(0.5, 0.5),
//   });

//   const material = useMemo(() => {
//     textures.forEach((t) => {
//       t.colorSpace = THREE.SRGBColorSpace;
//       t.anisotropy = 8;
//       t.needsUpdate = true;
//     });
//     const res = (t) => new THREE.Vector2(t.image.width, t.image.height);
//     return new THREE.ShaderMaterial({
//       vertexShader,
//       fragmentShader,
//       uniforms: {
//         uTex0: { value: textures[0] },
//         uTex1: { value: textures[1] ?? textures[0] },
//         uRes0: { value: res(textures[0]) },
//         uRes1: { value: res(textures[1] ?? textures[0]) },
//         uPlane: { value: new THREE.Vector2(1, 1) },
//         uMouse: { value: new THREE.Vector2(0.5, 0.5) },
//         uMix: { value: 0 },
//         uTime: { value: 0 },
//         uHover: { value: 0 },
//         uVel: { value: 0 },
//       },
//     });
//   }, [textures]);

//   useEffect(() => () => material.dispose(), [material]);

//   useFrame((_, delta) => {
//     const s = state.current;
//     const u = material.uniforms;
//     const n = textures.length;
//     const mesh = meshRef.current;
//     if (!mesh) return;

//     u.uTime.value += delta;
//     u.uPlane.value.set(viewport.width, viewport.height);

//     /* scroll progress -> which two textures + mix amount */
//     s.progress = THREE.MathUtils.damp(s.progress, targetRef.current, 5, delta);
//     const from = Math.max(0, Math.min(Math.floor(s.progress), n - 2));
//     const mix = n > 1 ? THREE.MathUtils.clamp(s.progress - from, 0, 1) : 0;

//     if (from !== s.from) {
//       s.from = from;
//       const a = textures[from];
//       const b = textures[Math.min(from + 1, n - 1)];
//       u.uTex0.value = a;
//       u.uTex1.value = b;
//       u.uRes0.value.set(a.image.width, a.image.height);
//       u.uRes1.value.set(b.image.width, b.image.height);
//     }
//     u.uMix.value = mix;

//     /* mouse smoothing + velocity */
//     s.prev.copy(s.mouse);
//     s.mouse.lerp(s.mouseTarget, 1 - Math.exp(-6 * delta));
//     const speed = s.mouse.distanceTo(s.prev) / Math.max(delta, 1e-4);
//     s.vel = THREE.MathUtils.damp(s.vel, Math.min(speed, 3), 4, delta);
//     s.hover = THREE.MathUtils.damp(s.hover, s.hoverTarget, 4, delta);

//     u.uMouse.value.copy(s.mouse);
//     u.uHover.value = s.hover;
//     u.uVel.value = s.vel;

//     /* gentle 3D tilt towards the cursor */
//     const mx = (s.mouse.x - 0.5) * 2;
//     const my = (s.mouse.y - 0.5) * 2;
//     mesh.rotation.x = THREE.MathUtils.damp(mesh.rotation.x, my * 0.08 * s.hover, 4, delta);
//     mesh.rotation.y = THREE.MathUtils.damp(mesh.rotation.y, -mx * 0.08 * s.hover, 4, delta);
//   });

//   const scale = 1.06; // slight overscan so tilt never exposes edges

//   return (
//     <mesh
//       ref={meshRef}
//       scale={[viewport.width * scale, viewport.height * scale, 1]}
//       onPointerMove={(e) => {
//         if (e.uv) state.current.mouseTarget.copy(e.uv);
//       }}
//       onPointerOver={() => (state.current.hoverTarget = 1)}
//       onPointerOut={() => (state.current.hoverTarget = 0)}
//     >
//       <planeGeometry args={[1, 1, 32, 32]} />
//       <primitive object={material} attach="material" />
//     </mesh>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*  SECTION                                                                   */
// /* -------------------------------------------------------------------------- */
// export default function WWAcademicPrograms() {
//   const sectionRef = useRef(null);
//   const stRef = useRef(null);
//   const targetRef = useRef(0); // float 0 .. n-1, driven by scroll
//   const prevActive = useRef(0);
//   const [active, setActive] = useState(0);

//   const numItems = programsData.length;
//   const urls = useMemo(() => programsData.map((p) => p.mainImage), []);

//   /* ---- initial states ---- */
//   useLayoutEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.set(".t-word", { yPercent: 110 });
//       gsap.set(".t-word-0", { yPercent: 0 });
//       gsap.set(".d-item", { autoAlpha: 0, y: 20 });
//       gsap.set(".d-item-0", { autoAlpha: 1, y: 0 });
//     }, sectionRef);
//     return () => ctx.revert();
//   }, []);

//   /* ---- pin + scrub ---- */
//   useLayoutEffect(() => {
//     const ctx = gsap.context(() => {
//       stRef.current = ScrollTrigger.create({
//         trigger: sectionRef.current,
//         start: "top top",
//         end: () => `+=${window.innerHeight * numItems}`,
//         pin: true,
//         scrub: 1,
//         invalidateOnRefresh: true,
//         snap: {
//           snapTo: 1 / (numItems - 1),
//           delay: 0.1,
//           duration: { min: 0.3, max: 0.8 },
//           ease: "power2.inOut",
//         },
//         onUpdate: (self) => {
//           const p = self.progress * (numItems - 1);
//           targetRef.current = p;
//           setActive(Math.round(p));
//         },
//       });
//     }, sectionRef);
//     return () => ctx.revert();
//   }, [numItems]);

//   /* ---- text transitions when the active item changes ---- */
//   useEffect(() => {
//     const prev = prevActive.current;
//     if (prev === active) return;
//     const dir = active > prev ? 1 : -1;
//     const q = gsap.utils.selector(sectionRef);

//     gsap.to(q(`.t-word-${prev}`), {
//       yPercent: -110 * dir,
//       duration: 0.6,
//       stagger: 0.04,
//       ease: "power3.in",
//       overwrite: "auto",
//     });
//     gsap.fromTo(
//       q(`.t-word-${active}`),
//       { yPercent: 110 * dir },
//       {
//         yPercent: 0,
//         duration: 0.9,
//         stagger: 0.06,
//         delay: 0.25,
//         ease: "power3.out",
//         overwrite: "auto",
//       }
//     );

//     gsap.to(q(`.d-item-${prev}`), {
//       autoAlpha: 0,
//       y: -20 * dir,
//       duration: 0.4,
//       ease: "power2.in",
//       overwrite: "auto",
//     });
//     gsap.fromTo(
//       q(`.d-item-${active}`),
//       { autoAlpha: 0, y: 20 * dir },
//       {
//         autoAlpha: 1,
//         y: 0,
//         duration: 0.7,
//         delay: 0.3,
//         ease: "power3.out",
//         overwrite: "auto",
//       }
//     );

//     prevActive.current = active;
//   }, [active]);

//   const goTo = useCallback(
//     (i) => {
//       const st = stRef.current;
//       if (!st) return;
//       const y = st.start + (i / (numItems - 1)) * (st.end - st.start);
//       window.scrollTo({ top: y, behavior: "smooth" });
//     },
//     [numItems]
//   );

//   return (
//     <section
//       ref={sectionRef}
//       className="relative h-screen w-full overflow-hidden text-black"
//       style={{ backgroundColor: BG }}
//     >
//       {/* ---------------- Left: index ---------------- */}
//       {/* <ol className="absolute left-[0.8vw] top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 md:flex">
//         {programsData.map((item, i) => {
//           const on = i === active;
//           return (
//             <li key={item.id}>
//               <button
//                 type="button"
//                 onClick={() => goTo(i)}
//                 aria-label={`Go to ${item.title}`}
//                 className="flex items-center gap-3 font-serif text-[11px] italic"
//               >
//                 <span
//                   className={`w-3 transition-all duration-500 ${on ? "font-bold text-black" : "text-gray-400"
//                     }`}
//                 >
//                   {i + 1}
//                 </span>
//                 <span
//                   className={`h-px bg-black transition-all duration-500 ${on ? "w-5 opacity-100" : "w-0 opacity-0"
//                     }`}
//                 />
//                 <span
//                   className={`whitespace-nowrap font-bold transition-all duration-500 ${on ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
//                     }`}
//                 >
//                   {SECTION_LABEL}
//                 </span>
//               </button>
//             </li>
//           );
//         })}
//       </ol> */}

//       {/* ---------------- Center: WebGL image ---------------- */}
//       <div className="absolute left-1/2 top-1/2 z-10 aspect-[1.28/1] w-[78vw] max-h-[76vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden shadow-2xl md:w-[41vw]">
//         <Canvas
//           dpr={[1, 2]}
//           camera={{ position: [0, 0, 5], fov: 35 }}
//           gl={{ antialias: true, alpha: true }}
//           style={{ background: "#e5e7eb" }}
//         >
//           <Suspense fallback={null}>
//             <ImagePlane urls={urls} targetRef={targetRef} />
//           </Suspense>
//         </Canvas>
//       </div>

//       {/* ---------------- Title (overlaps image, difference blend) ---------------- */}


//       <div className="w-[20%] h-fit absolute bottom-20 left-10">
//       <h6 className=" text-[2.1vw] ">
//         University Affiliation
//       </h6>
//       <div className="w-full h-px my-4 bg-black">
//       </div>

//       <p className="">
//         Partnered with Tata Institute of Social Sciences (TISS) (a Category 1 University) to offer accredited Bachelor's and Master's degrees across 1 to 4-year programs
//       </p>
//       </div>

//       {/* ---------------- Right: description ---------------- */}
//       <div className="absolute bottom-[6%] left-[6vw] right-[6vw] z-20 md:bottom-auto md:left-auto md:right-[7vw] md:top-1/2 md:w-[17vw] md:-translate-y-1/2">
//         <div className="grid">
//           {programsData.map((item, i) => (
//             <p
//               key={`desc-${item.id}`}
//               className={`d-item d-item-${i}  flex justify-end items-end col-start-1 row-start-1 text-sm font-medium leading-snug text-black`}
//             >
//               {item.description}
//             </p>
//           ))}
//         </div>
//       </div>

//       {/* ---------------- Far right: thumbnail rail ---------------- */}
//       <div className="absolute right-[1.5vw] top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 md:flex">
//         {programsData.map((item, i) => {
//           const on = i === active;
//           return (
//             <button
//               key={`thumb-${item.id}`}
//               type="button"
//               onClick={() => goTo(i)}
//               aria-label={`Show ${item.title}`}
//               className="flex items-center justify-end gap-3"
//             >
//               <span
//                 className={`h-px bg-black transition-all duration-500 ${on ? "w-5 opacity-100" : "w-0 opacity-0"
//                   }`}
//               />
//               <span
//                 className={`block h-7 w-[42px] overflow-hidden transition-opacity duration-500 ${on ? "opacity-100" : "opacity-50 hover:opacity-80"
//                   }`}
//               >
//                 <img
//                   src={item.thumbImage}
//                   alt=""
//                   className="h-full w-full object-cover"
//                 />
//               </span>
//             </button>
//           );
//         })}
//       </div>
//     </section>
//   );
// }


"use client";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/*  DATA                                                                      */
/* -------------------------------------------------------------------------- */
const programsData = [
  {
    id: "01",
    title: "University Affiliation",
    description: "01",
    mainImage:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200",
    thumbImage:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "02",
    title: "Global Partnerships",
    description: "02",
    mainImage:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200",
    thumbImage:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "03",
    title: "Industry Integration",
    description: "03",
    mainImage:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200",
    thumbImage:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=200",
  },
];

const BG = "#f7f8f9";

/* -------------------------------------------------------------------------- */
/*  RIPPLE SETTINGS                                                           */
/* -------------------------------------------------------------------------- */
const RIPPLE_COUNT = 40; // max simultaneous rings (ring buffer)
const RIPPLE_SPACING = 0.025; // distance the cursor travels between rings
const DEFAULT_INTENSITY = 1; // 0 = off, 1 = default, 3 = very strong

/* -------------------------------------------------------------------------- */
/*  SHADERS                                                                   */
/* -------------------------------------------------------------------------- */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  #define RIPPLE_COUNT ${RIPPLE_COUNT}
  #define RIPPLE_LIFE 3.0
  #define RIPPLE_SPEED 0.32

  uniform sampler2D uTex0;
  uniform sampler2D uTex1;
  uniform vec2 uRes0;
  uniform vec2 uRes1;
  uniform vec2 uPlane;
  uniform float uMix;
  uniform float uTime;
  uniform float uIntensity;
  uniform vec4 uRipples[RIPPLE_COUNT]; // x, y, startTime, amplitude

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  // object-fit: cover
  vec2 cover(vec2 uv, vec2 img) {
    float pr = uPlane.x / uPlane.y;
    float ir = img.x / img.y;
    vec2 s = pr > ir ? vec2(1.0, ir / pr) : vec2(pr / ir, 1.0);
    return (uv - 0.5) * s + 0.5;
  }

  vec3 sampleBoth(vec2 u, float reveal) {
    vec2 u0 = (u - 0.5) * (1.0 - 0.08 * uMix) + 0.5;
    vec2 u1 = (u - 0.5) * (1.0 - 0.12 * (1.0 - uMix)) + 0.5;
    vec3 a = texture2D(uTex0, cover(u0, uRes0)).rgb;
    vec3 b = texture2D(uTex1, cover(u1, uRes1)).rgb;
    return mix(a, b, reveal);
  }

  // Sum of all expanding ring waves -> UV offset + height
  vec2 waterRipples(vec2 uv, float aspect, out float height) {
    vec2 offset = vec2(0.0);
    height = 0.0;

    for (int i = 0; i < RIPPLE_COUNT; i++) {
      vec4 r = uRipples[i];
      float age = uTime - r.z;
      if (age < 0.0 || age > RIPPLE_LIFE) continue;

      vec2 delta = (uv - r.xy) * vec2(aspect, 1.0);
      float d = length(delta);
      float x = d - age * RIPPLE_SPEED;           // distance from wave front

      float envelope = exp(-x * x * 260.0);        // narrow band around front
      float fade = exp(-age * 1.5) * (1.0 - exp(-age * 12.0));
      float w = sin(x * 75.0) * envelope * fade * r.w;

      vec2 dir = delta / max(d, 0.0001);
      offset += dir * w / vec2(aspect, 1.0);
      height += w;
    }
    return offset;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uPlane.x / uPlane.y;

    /* ---------- water ripples ---------- */
    float h;
    vec2 rOff = waterRipples(uv, aspect, h);
    uv += rOff * 0.035 * uIntensity;

    /* ---------- scroll transition: noisy wipe from the bottom ---------- */
    float n = noise(uv * vec2(3.0, 2.0) + uTime * 0.15);
    float pad = 0.35;
    float w = 0.15;
    float t = uMix * (1.0 + 2.0 * pad) - pad;
    float coord = uv.y + (n - 0.5) * 0.2;

    float reveal = 1.0 - smoothstep(t - w, t + w, coord);
    float band = 1.0 - smoothstep(0.0, w * 1.5, abs(coord - t));

    vec2 warp = vec2((n - 0.5) * 0.05, 0.05) * band;
    vec2 uvw = uv + warp;

    /* ---------- chromatic aberration (stronger on ripples) ---------- */
    float ca = abs(h) * 0.008 * uIntensity + band * 0.01;
    vec2 caDir = normalize(rOff + vec2(0.0001));

    float r = sampleBoth(uvw + caDir * ca, reveal).r;
    float g = sampleBoth(uvw, reveal).g;
    float b = sampleBoth(uvw - caDir * ca, reveal).b;

    vec3 col = vec3(r, g, b);

    /* ---------- water highlight on crests ---------- */
    col += h * 0.10 * uIntensity;

    col += band * 0.03;

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

/* -------------------------------------------------------------------------- */
/*  WEBGL PLANE                                                               */
/* -------------------------------------------------------------------------- */
function ImagePlane({ urls, targetRef, intensityRef }) {
  const meshRef = useRef(null);
  const { viewport, gl } = useThree();
  const textures = useTexture(urls);

  const state = useRef({
    progress: 0,
    from: -1,
    inside: false,
    hasLast: false,
    mouse: new THREE.Vector2(0.5, 0.5), // raw cursor in UV space (no smoothing)
    last: new THREE.Vector2(0.5, 0.5), // last position a ripple was spawned
    ringIndex: 0,
    intensity: DEFAULT_INTENSITY,
  });

  const material = useMemo(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.needsUpdate = true;
    });
    const res = (t) => new THREE.Vector2(t.image.width, t.image.height);
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTex0: { value: textures[0] },
        uTex1: { value: textures[1] ?? textures[0] },
        uRes0: { value: res(textures[0]) },
        uRes1: { value: res(textures[1] ?? textures[0]) },
        uPlane: { value: new THREE.Vector2(1, 1) },
        uMix: { value: 0 },
        uTime: { value: 0 },
        uIntensity: { value: DEFAULT_INTENSITY },
        uRipples: {
          value: Array.from(
            { length: RIPPLE_COUNT },
            () => new THREE.Vector4(0, 0, -100, 0)
          ),
        },
      },
    });
  }, [textures]);

  // Uniforms are mutated every frame, so they're reached through the state ref
  // rather than the memoised material (keeps react-hooks/immutability happy).
  useEffect(() => {
    state.current.uniforms = material.uniforms;
    return () => material.dispose();
  }, [material]);

  /* spawn one ripple into the ring buffer */
  const spawn = useCallback((x, y, amp) => {
    const s = state.current;
    const u = s.uniforms;
    if (!u) return;
    const slot = u.uRipples.value[s.ringIndex];
    slot.set(x, y, u.uTime.value, amp);
    s.ringIndex = (s.ringIndex + 1) % RIPPLE_COUNT;
  }, []);

  /* ---- precise cursor tracking straight from the canvas DOM rect ---- */
  useEffect(() => {
    const el = gl.domElement;
    const s = state.current;

    const toUV = (e) => {
      const rect = el.getBoundingClientRect();
      s.mouse.set(
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height
      );
    };

    const onEnter = (e) => {
      toUV(e);
      s.last.copy(s.mouse);
      s.inside = true;
      s.hasLast = true;
    };
    const onMove = (e) => {
      toUV(e);
      s.inside = true;
      if (!s.hasLast) {
        s.last.copy(s.mouse);
        s.hasLast = true;
      }
    };
    const onLeave = () => {
      s.inside = false;
      s.hasLast = false;
    };
    const onDown = (e) => {
      toUV(e);
      spawn(s.mouse.x, s.mouse.y, 2.0); // bigger "drop" on click
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointercancel", onLeave);
    el.addEventListener("pointerdown", onDown);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointercancel", onLeave);
      el.removeEventListener("pointerdown", onDown);
    };
  }, [gl, spawn]);

  useFrame((_, delta) => {
    const s = state.current;
    const u = s.uniforms;
    if (!u) return;
    const n = textures.length;

    u.uTime.value += delta;
    u.uPlane.value.set(viewport.width, viewport.height);

    /* intensity (smoothed so slider changes feel nice) */
    s.intensity = THREE.MathUtils.damp(s.intensity, intensityRef.current, 8, delta);
    u.uIntensity.value = s.intensity;

    /* scroll progress -> which two textures + mix amount */
    s.progress = THREE.MathUtils.damp(s.progress, targetRef.current, 5, delta);
    const from = Math.max(0, Math.min(Math.floor(s.progress), n - 2));
    const mix = n > 1 ? THREE.MathUtils.clamp(s.progress - from, 0, 1) : 0;

    if (from !== s.from) {
      s.from = from;
      const a = textures[from];
      const b = textures[Math.min(from + 1, n - 1)];
      u.uTex0.value = a;
      u.uTex1.value = b;
      u.uRes0.value.set(a.image.width, a.image.height);
      u.uRes1.value.set(b.image.width, b.image.height);
    }
    u.uMix.value = mix;

    /* ---- emit ripples along the cursor path ---- */
    if (s.inside && s.hasLast) {
      const aspect = viewport.width / viewport.height;
      const dx = (s.mouse.x - s.last.x) * aspect;
      const dy = s.mouse.y - s.last.y;
      const dist = Math.hypot(dx, dy);

      if (dist > RIPPLE_SPACING) {
        const speed = dist / Math.max(delta, 1e-4);
        const amp = THREE.MathUtils.clamp(0.45 + speed * 0.12, 0.45, 1.3);
        const steps = Math.min(Math.floor(dist / RIPPLE_SPACING), 6);

        for (let k = 1; k <= steps; k++) {
          const t = k / steps;
          spawn(
            THREE.MathUtils.lerp(s.last.x, s.mouse.x, t),
            THREE.MathUtils.lerp(s.last.y, s.mouse.y, t),
            amp
          );
        }
        s.last.copy(s.mouse);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={[viewport.width, viewport.height, 1]}
    >
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*  SECTION                                                                   */
/* -------------------------------------------------------------------------- */
export default function WWAcademicPrograms({
  rippleIntensity = DEFAULT_INTENSITY, // initial intensity
  showControls = true, // show the slider under the image
}) {
  const sectionRef = useRef(null);
  const stRef = useRef(null);
  const targetRef = useRef(0); // float 0 .. n-1, driven by scroll
  const prevActive = useRef(0);
  const [active, setActive] = useState(0);

  const [intensity, setIntensity] = useState(rippleIntensity);
  const intensityRef = useRef(rippleIntensity);
  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  const numItems = programsData.length;
  const urls = useMemo(() => programsData.map((p) => p.mainImage), []);

  /* ---- initial states ---- */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".t-word", { yPercent: 110 });
      gsap.set(".t-word-0", { yPercent: 0 });
      gsap.set(".d-item", { autoAlpha: 0, y: 20 });
      gsap.set(".d-item-0", { autoAlpha: 1, y: 0 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* ---- pin + scrub ---- */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      stRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * numItems}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / (numItems - 1),
          delay: 0.1,
          duration: { min: 0.3, max: 0.8 },
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const p = self.progress * (numItems - 1);
          targetRef.current = p;
          setActive(Math.round(p));
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [numItems]);

  /* ---- text transitions when the active item changes ---- */
  useEffect(() => {
    const prev = prevActive.current;
    if (prev === active) return;
    const dir = active > prev ? 1 : -1;
    const q = gsap.utils.selector(sectionRef);

    gsap.to(q(`.t-word-${prev}`), {
      yPercent: -110 * dir,
      duration: 0.6,
      stagger: 0.04,
      ease: "power3.in",
      overwrite: "auto",
    });
    gsap.fromTo(
      q(`.t-word-${active}`),
      { yPercent: 110 * dir },
      {
        yPercent: 0,
        duration: 0.9,
        stagger: 0.06,
        delay: 0.25,
        ease: "power3.out",
        overwrite: "auto",
      }
    );

    gsap.to(q(`.d-item-${prev}`), {
      autoAlpha: 0,
      y: -20 * dir,
      duration: 0.4,
      ease: "power2.in",
      overwrite: "auto",
    });
    gsap.fromTo(
      q(`.d-item-${active}`),
      { autoAlpha: 0, y: 20 * dir },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        delay: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      }
    );

    prevActive.current = active;
  }, [active]);

  const goTo = useCallback(
    (i) => {
      const st = stRef.current;
      if (!st) return;
      const y = st.start + (i / (numItems - 1)) * (st.end - st.start);
      window.scrollTo({ top: y, behavior: "smooth" });
    },
    [numItems]
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex h-svh w-full flex-col justify-center gap-5 overflow-hidden px-5 text-black sm:gap-6 sm:px-8 md:block md:h-screen md:p-0"
      style={{ backgroundColor: BG }}
    >
      {/* ---------------- Center: WebGL image ---------------- */}
      {/* mobile: in-flow card between header + text | md+: absolutely centered */}
      <div className="relative order-2 z-10 aspect-4/5 max-h-[52svh] w-full shrink-0 overflow-hidden shadow-2xl sm:aspect-[1.28/1] md:absolute md:left-1/2 md:top-1/2 md:max-h-[76vh] md:w-[41vw] md:-translate-x-1/2 md:-translate-y-1/2">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 5], fov: 35 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "#e5e7eb" }}
        >
          <Suspense fallback={null}>
            <ImagePlane
              urls={urls}
              targetRef={targetRef}
              intensityRef={intensityRef}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ---------------- Ripple intensity control ---------------- */}
      {/* {showControls && (
        <div className="absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/80 px-4 py-2 text-xs shadow-md backdrop-blur">
          <label htmlFor="ripple-intensity" className="whitespace-nowrap font-medium">
            Ripple intensity
          </label>
          <input
            id="ripple-intensity"
            type="range"
            min="0"
            max="3"
            step="0.05"
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
            className="w-32 accent-black"
          />
          <span className="w-8 text-right tabular-nums">
            {intensity.toFixed(2)}
          </span>
        </div>
      )} */}

      {/* ---------------- Left: text block ---------------- */}
      <div className="relative order-3 z-20 h-fit w-full md:absolute md:bottom-20 md:left-10 md:w-[24%] lg:w-[20%]">
        <h6 className="text-2xl leading-tight sm:text-3xl md:text-[max(1.25rem,2.1vw)]">
          University Affiliation
        </h6>
        <div className="my-3 h-px w-full bg-black md:my-4"></div>
        <p className="text-sm leading-relaxed sm:text-base md:text-sm lg:text-base max-md:text-[15px]! max-md:leading-relaxed!">
          Partnered with Tata Institute of Social Sciences (TISS) (a Category 1
          University) to offer accredited Bachelor&apos;s and Master&apos;s degrees across
          1 to 4-year programs
        </p>
      </div>

      {/* ---------------- Right: description ---------------- */}
      {/* mobile: header row above the image (progress + number) | md+: right of image */}
      <div className="pointer-events-none relative order-1 z-20 flex w-full items-center justify-between md:absolute md:right-[7vw] md:top-1/2 md:block md:w-[17vw] md:-translate-y-1/2">
        {/* mobile progress (thumbnail rail is hidden below md) */}
        <div className="pointer-events-auto flex items-center gap-1 md:hidden">
          {programsData.map((item, i) => (
            <button
              key={`dot-${item.id}`}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${item.title}`}
              className="px-0.5 py-3"
            >
              <span
                className={`block h-0.5 transition-all duration-500 ${
                  i === active ? "w-8 bg-black" : "w-4 bg-black/25"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="grid">
          {programsData.map((item, i) => (
            <p
              key={`desc-${item.id}`}
              className={`d-item d-item-${i} col-start-1 row-start-1 flex items-end justify-end text-sm font-medium leading-snug text-black`}
            >
              {item.description}
            </p>
          ))}
        </div>
      </div>

      {/* ---------------- Far right: thumbnail rail ---------------- */}
      <div className="absolute right-[1.5vw] top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 md:flex">
        {programsData.map((item, i) => {
          const on = i === active;
          return (
            <button
              key={`thumb-${item.id}`}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${item.title}`}
              className="flex items-center justify-end gap-3"
            >
              <span
                className={`h-px bg-black transition-all duration-500 ${
                  on ? "w-5 opacity-100" : "w-0 opacity-0"
                }`}
              />
              <span
                className={`block h-7 w-[42px] overflow-hidden transition-opacity duration-500 ${
                  on ? "opacity-100" : "opacity-50 hover:opacity-80"
                }`}
              >
                <img
                  src={item.thumbImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}