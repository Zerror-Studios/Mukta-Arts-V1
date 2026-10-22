"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { getImageProps } from "next/image";
import useGpuWarmup from "@/hooks/useGpuWarmup";

/* -------------------------------------------------------------------------- */
/*  RIPPLE SETTINGS                                                           */
/* -------------------------------------------------------------------------- */
const RIPPLE_COUNT = 40; // max simultaneous rings (ring buffer)
const RIPPLE_SPACING = 0.025; // distance the cursor travels between rings
const RIPPLE_LIFE = 3; // seconds a ring lasts before the shader drops it

/* -------------------------------------------------------------------------- */
/*  DRAWING                                                                   */
/* -------------------------------------------------------------------------- */
const MAX_DPR = 2;
// The widest image. A screen narrower than this crops the sides (object-fit: cover),
// so the texture has to be wider than the screen to stay sharp
const COVER_ASPECT = 16 / 9;
// The scroll wipe's edge drifts with time while it crosses the plane. Within this much of
// either image it is off the plane and the frame is still:
// (pad 0.35 - noise 0.1 - band 0.225) / 1.7, from the shader below
const WIPE_STILL = 0.014;
// Drawing on demand, the first frame after a still spell reports the whole pause as its delta
const MAX_DELTA = 0.1;

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
  #define RIPPLE_LIFE ${RIPPLE_LIFE.toFixed(1)}
  #define RIPPLE_SPEED 0.32

  uniform sampler2D uTex0;
  uniform sampler2D uTex1;
  uniform vec2 uRes0;
  uniform vec2 uRes1;
  uniform vec2 uPlane;
  uniform float uMix;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uRippleOn; // 0 once every ring has faded out
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
    // With no live rings the loop adds nothing, so it is skipped (the same for every pixel)
    float h = 0.0;
    vec2 rOff = vec2(0.0);
    if (uRippleOn > 0.5) rOff = waterRipples(uv, aspect, h);
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
/*  TEXTURE SIZE                                                              */
/* -------------------------------------------------------------------------- */
// Some sources are 8000px wide: far past any screen, slow to decode and ~190MB of GPU memory
// each. Next's image optimiser serves them at the smallest configured width that still
// covers this screen. getImageProps hands back its 2x candidate as `src`, hence the halving
function textureUrls(images) {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const need = Math.max(window.innerWidth, window.innerHeight * COVER_ASPECT) * dpr;
  const width = Math.ceil(need / 2);
  return images.map(
    (src) => getImageProps({ src, alt: "", width, height: Math.ceil(width / COVER_ASPECT) }).props.src
  );
}

/* -------------------------------------------------------------------------- */
/*  WEBGL PLANE                                                               */
/* -------------------------------------------------------------------------- */
function ImagePlane({ urls, intensity, targetRef }) {
  const viewport = useThree((s) => s.viewport);
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const textures = useTexture(urls); // also uploads every texture to the GPU up front
  useGpuWarmup();

  const state = useRef({
    progress: 0,
    from: -1,
    inside: false,
    hasLast: false,
    mouse: new THREE.Vector2(0.5, 0.5), // raw cursor in UV space (no smoothing)
    last: new THREE.Vector2(0.5, 0.5), // last position a ripple was spawned
    ringIndex: 0,
    lastRipple: -Infinity, // uTime of the newest ring
  });

  const material = useMemo(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
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
        uIntensity: { value: 0 },
        uRippleOn: { value: 0 },
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
    invalidate();
    return () => material.dispose();
  }, [material, invalidate]);

  /* spawn one ripple into the ring buffer */
  const spawn = useCallback((x, y, amp) => {
    const s = state.current;
    const u = s.uniforms;
    if (!u) return;
    const slot = u.uRipples.value[s.ringIndex];
    slot.set(x, y, u.uTime.value, amp);
    s.ringIndex = (s.ringIndex + 1) % RIPPLE_COUNT;
    s.lastRipple = u.uTime.value;
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
      invalidate(); // the next frame lays rings along the path
    };
    const onLeave = () => {
      s.inside = false;
      s.hasLast = false;
    };
    const onDown = (e) => {
      toUV(e);
      spawn(s.mouse.x, s.mouse.y, 2.0); // bigger "drop" on click
      invalidate();
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
  }, [gl, spawn, invalidate]);

  useFrame((_, rawDelta) => {
    const s = state.current;
    const u = s.uniforms;
    if (!u) return;
    const delta = Math.min(rawDelta, MAX_DELTA);
    const n = textures.length;
    const target = targetRef.current;

    u.uTime.value += delta;
    u.uPlane.value.set(viewport.width, viewport.height);
    u.uIntensity.value = intensity;

    /* scroll progress -> which two textures + mix amount */
    s.progress = THREE.MathUtils.damp(s.progress, target, 5, delta);
    const settling = Math.abs(target - s.progress) > 1e-4;
    if (!settling) s.progress = target;
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

    const rippling = u.uTime.value - s.lastRipple <= RIPPLE_LIFE;
    u.uRippleOn.value = rippling ? 1 : 0;

    // Ask for another frame only while something on the plane is still moving
    if (settling || rippling || (mix > WIPE_STILL && mix < 1 - WIPE_STILL)) invalidate();
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*  CANVAS                                                                    */
/* -------------------------------------------------------------------------- */
// Draws on demand: scroll (through `onReady`'s invalidate), the cursor and running
// animations ask for frames, so a still section costs nothing
export default function ProgramsCanvas({ images, intensity, targetRef, onReady }) {
  // Sized once, for this screen
  const urls = useMemo(() => textureUrls(images), [images]);

  return (
    <Canvas
      dpr={[1, MAX_DPR]}
      frameloop="demand"
      camera={{ position: [0, 0, 5], fov: 35 }}
      // One full-screen quad: no edges to antialias and nothing to depth-test
      gl={{ antialias: false, depth: false, alpha: true }}
      onCreated={(state) => onReady?.(state.invalidate)}
    >
      <Suspense fallback={null}>
        <ImagePlane urls={urls} intensity={intensity} targetRef={targetRef} />
      </Suspense>
    </Canvas>
  );
}
