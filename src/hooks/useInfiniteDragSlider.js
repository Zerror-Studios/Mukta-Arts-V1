"use client";

import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import { gsap, MOTION_OK, MOTION_REDUCED } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

// How quickly the strip catches up with the pointer while dragging (higher = tighter)
const DRAG_FOLLOW = 14;
// How quickly a throw eases back into the auto speed after release (lower = longer glide)
const SETTLE = 2;
// Fastest throw carried after release, in pixels per second
const MAX_THROW = 3000;

/**
 * An endless image strip that scrolls on its own and can be dragged.
 * One frame loop drives both: while dragging the strip glides after the pointer, and on release
 * it carries the throw and eases back into the auto speed, so there is never a sudden stop or start.
 * With reduced motion it only moves when dragged.
 *
 *   containerRef  the element that takes the drag
 *   trackRef      the moving row; it must hold the items twice, back to back
 *   itemCount     how many items one set has (the row holds 2 × itemCount children)
 *   loopSeconds   seconds for the strip to scroll one full set on its own
 */
export default function useInfiniteDragSlider(containerRef, trackRef, { itemCount, loopSeconds }) {
  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, reduced: MOTION_REDUCED }, (context) => {
        const { reduced } = context.conditions;

        // One set's width is a seamless loop
        let setWidth = 1;
        let wrapX = gsap.utils.wrap(-1, 0);
        const measure = () => {
          const first = track.children[0];
          const twin = track.children[itemCount];
          if (!first || !twin) return;
          setWidth = Math.max(1, twin.offsetLeft - first.offsetLeft);
          wrapX = gsap.utils.wrap(-setWidth, 0);
        };
        measure();
        const resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(track);

        // Pixels per second, right to left
        const autoVelocity = () => (reduced ? 0 : -setWidth / loopSeconds);

        const setX = gsap.quickSetter(track, "x", "px");
        let x = 0;
        let velocity = autoVelocity();
        let dragging = false;
        let dragTarget = 0;
        let dragOrigin = 0;
        let pointerOrigin = 0;

        const tick = (time, deltaMs) => {
          // Capped so a long frame (or the first after the tab comes back) never jumps
          const dt = Math.min(deltaMs, 50) / 1000;
          if (dragging) {
            const prev = x;
            x += (dragTarget - x) * (1 - Math.exp(-dt * DRAG_FOLLOW));
            velocity = dt > 0 ? (x - prev) / dt : velocity;
          } else {
            velocity += (autoVelocity() - velocity) * (1 - Math.exp(-dt * SETTLE));
            x += velocity * dt;
          }
          // Kept within one loop so the numbers never grow; a drag in progress shifts with it
          const wrapped = wrapX(x);
          if (wrapped !== x) {
            const shift = wrapped - x;
            dragTarget += shift;
            dragOrigin += shift;
            x = wrapped;
          }
          setX(x);
        };
        gsap.ticker.add(tick);

        const [drag] = Draggable.create(document.createElement("div"), {
          trigger: containerRef.current,
          type: "x",
          onPress() {
            dragging = true;
            dragOrigin = x;
            dragTarget = x;
            pointerOrigin = this.x;
          },
          onDrag() {
            dragTarget = dragOrigin + (this.x - pointerOrigin);
          },
          onRelease() {
            dragging = false;
            velocity = gsap.utils.clamp(-MAX_THROW, MAX_THROW, velocity);
          },
        });

        return () => {
          gsap.ticker.remove(tick);
          resizeObserver.disconnect();
          drag?.kill();
        };
      });
    },
    { scope: containerRef, dependencies: [itemCount, loopSeconds] }
  );
}
