"use client";

import { useEffect, useState } from "react";
import { whenIntroDone } from "@/lib/homeIntro";

/**
 * False until the home intro has played (true straight away on other pages), then the next
 * time the browser is idle. Gate heavy below-the-fold work (models, textures, video) on it so
 * none of it loads or decodes while the intro runs.
 */
export default function useAfterIntro() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId = null;
    const cancel = whenIntroDone(() => {
      if (!window.requestIdleCallback) return setReady(true);
      idleId = window.requestIdleCallback(() => setReady(true), { timeout: 1200 });
    });
    return () => {
      cancel();
      if (idleId !== null) window.cancelIdleCallback(idleId);
    };
  }, []);

  return ready;
}
