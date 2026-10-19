"use client";

import { useEffect } from "react";
import { PixelGridEngine } from "@/modules/pixelGridEngine";

export function PixelGridCanvas() {
  useEffect(() => {
    const engine = new PixelGridEngine({
      cellSize: 4,
      renderScope: "display",
      typeIn: true,
      wireRender: "cells",
      palette: "violet",
      accentColor: "#8B5CF6",
      brush: "radial-dither",
      brushRadius: 3,
      paintFade: 500,
      accumulate: false,
      clickPaint: false,
      portraitMode: "faint-hover",
    });

    engine.mount();
    return () => engine.destroy();
  }, []);

  return (
    <>
      <div
        className="pixel-grid-background"
        data-grid-background=""
        aria-hidden="true"
      />
      <canvas
        className="pointer-events-none fixed inset-0 z-0 block h-full w-full"
        data-grid=""
        aria-hidden="true"
      />
      <div
        className="fixed top-0 left-0 z-[100] h-0.5 w-full origin-left bg-[var(--accent)]"
        style={{ scale: "0 1" }}
        data-progress=""
        aria-hidden="true"
      />
    </>
  );
}
