"use client";

import { useEffect, useState } from "react";

/**
 * Whether `ref`'s element is on screen, or within `margin` of it. Use it to stop a
 * WebGL canvas drawing while it is out of view: <Canvas frameloop={inView ? "always" : "never"}>.
 */
export default function useInView(ref, margin = "200px") {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: `${margin} 0px`,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, margin]);

  return inView;
}
