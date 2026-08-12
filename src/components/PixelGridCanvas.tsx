"use client";

import { useEffect } from "react";
import { PixelGridEngine } from "@/modules/pixelGridEngine";

export function PixelGridCanvas() {
  useEffect(() => {
    const engine = new PixelGridEngine({
      cellSize: 6,
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
      scrollEase: 0.16,
    });

    engine.mount();
    return () => engine.destroy();
  }, []);

  return (
    <>
      <canvas className="pixel-canvas" data-grid="" aria-hidden="true" />
      <div className="scroll-progress" data-progress="" aria-hidden="true" />
    </>
  );
}
