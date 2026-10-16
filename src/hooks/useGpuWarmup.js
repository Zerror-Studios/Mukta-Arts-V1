"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

// Runs `fn` when the browser has a quiet moment (or after `timeout` ms at the latest)
const whenIdle = (fn, timeout = 1500) =>
  window.requestIdleCallback
    ? window.cancelIdleCallback.bind(window, window.requestIdleCallback(fn, { timeout }))
    : clearTimeout.bind(window, setTimeout(fn, 32));

/**
 * Gets a scene onto the GPU before it is scrolled into view: compiles its shaders without
 * blocking, uploads its textures one per idle moment, then draws one unseen frame so the
 * geometry is uploaded too. Without this, all of that lands on the first frame the section
 * appears, which is the stutter you feel mid-scroll. Call it from a component that only mounts
 * once its assets have loaded (inside the Canvas's Suspense).
 */
export default function useGpuWarmup() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    let cancelled = false;
    let cancelStep = () => {};

    const textures = new Set();
    const hidden = [];
    scene.traverse((obj) => {
      // Hidden meshes (cards waiting their turn) still need their shaders ready
      if (!obj.visible) {
        hidden.push(obj);
        obj.visible = true;
      }
      if (!obj.material) return;
      [].concat(obj.material).forEach((material) => {
        Object.values(material).forEach((value) => value?.isTexture && textures.add(value));
        Object.values(material.uniforms ?? {}).forEach(({ value }) => value?.isTexture && textures.add(value));
      });
    });
    if (gl.compileAsync) gl.compileAsync(scene, camera).catch(() => {});
    else gl.compile(scene, camera);
    hidden.forEach((obj) => (obj.visible = false));

    const queue = [...textures];
    const step = () => {
      if (cancelled) return;
      if (queue.length) {
        gl.initTexture(queue.shift());
        cancelStep = whenIdle(step);
        return;
      }
      // Geometry buffers upload on first draw. The frame shows exactly what the next one would
      // (and nothing at all while the canvas is off screen)
      gl.render(scene, camera);
    };
    cancelStep = whenIdle(step);

    return () => {
      cancelled = true;
      cancelStep();
    };
  }, [gl, scene, camera]);
}
