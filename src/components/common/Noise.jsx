"use client";

import { useEffect, useRef } from "react";

export default function Noise({
  opacity = 0.09,      // overlay strength (0–1)
  speed = 30,          // how often the grain pattern refreshes (ms)
  patternSize = 200,   // size of the tileable noise tile (px)
  blendMode = "overlay", // try "overlay", "screen", "soft-light", etc.
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationId;
    let lastDraw = 0;

    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;
    const patternCtx = patternCanvas.getContext("2d");
    const patternData = patternCtx.createImageData(patternSize, patternSize);

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function generateNoise() {
      const buffer = patternData.data;
      const len = buffer.length;
      for (let i = 0; i < len; i += 4) {
        const value = Math.random() * 255;
        buffer[i] = value;
        buffer[i + 1] = value;
        buffer[i + 2] = value;
        buffer[i + 3] = 255;
      }
      patternCtx.putImageData(patternData, 0, 0);

      const pattern = ctx.createPattern(patternCanvas, "repeat");
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function loop(timestamp) {
      if (timestamp - lastDraw >= speed) {
        generateNoise();
        lastDraw = timestamp;
      }
      animationId = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener("resize", resize);
    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [speed, patternSize]);

  return (
    <div className="w-full h-full fixed top-0 left-0 z-9999999 pointer-events-none overflow-hidden">


      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          opacity,
          mixBlendMode: blendMode,
          zIndex: 9999,
        }}
      />
    </div>
  );
}