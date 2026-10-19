const DEFAULTS = {
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
};

// Interactive fills use only the three intermediate violet levels: every cell
// is active, while neither the background nor maximum-white level can be
// selected. Repetition preserves the reference button's 2/7, 3/7, 2/7 mix.
const INTERACTIVE_HOVER_LEVELS = [3, 3, 2, 2, 2, 1, 1];

export class PixelGridEngine {
  constructor(config = {}) {
    this.config = { ...DEFAULTS, ...config };
    this.mounted = false;
    this.raf = 0;
    this.heat = new Map();
    this.hoverHistory = new Map();
    this.hoverBordered = new WeakMap();
    this.portraitLit = new Set();
    this.textTargets = [];
    this.revealedText = new WeakSet();
    this.revealBlocks = [];
    this.wireNodes = [];
    this.wireTiles = [];
    this.nodeStates = new WeakMap();
    this.pointer = null;
    this.previousPointer = null;
    this.hoverElement = null;
    this.portrait = null;
    this.portraitLoading = null;
    this.lastPointerAt = 0;
    this.lastScrollAt = 0;
    this.wireInProgress = false;
    this.wireAnimatingUntil = 0;
    this.ready = false;
  }

  mount() {
    if (this.mounted) return;

    this.canvas = document.querySelector("[data-grid]");
    this.gridBackground = document.querySelector("[data-grid-background]");
    this.wrapper = document.querySelector("[data-smooth]");
    this.spacer = document.querySelector("[data-spacer]");
    this.progress = document.querySelector("[data-progress]");
    this.portraitHost = document.querySelector("[data-portrait]");
    this.context = this.canvas?.getContext("2d", { alpha: true });
    if (!this.canvas || !this.context || !this.wrapper) return;

    this.mounted = true;
    this.abortController = new AbortController();
    this.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    this.coarsePointer = window.matchMedia(
      "(hover: none), (pointer: coarse)",
    ).matches;
    this.calmMotion = this.reducedMotion || this.coarsePointer;
    // Content and its pixel layers scroll together on the browser's compositor.
    this.smooth = false;
    this.currentY = window.scrollY;
    this.targetY = this.currentY;
    this.brushRadius = this.config.brushRadius;
    this.ramp = this.buildRamp(this.config.accentColor);
    document.documentElement.style.setProperty("--accent", this.ramp[3]);

    if (this.spacer) this.spacer.style.display = "none";
    this.wrapper.style.transform = "none";
    this.wrapper.style.willChange = "auto";

    this.bind();
    this.setupReveals();
    this.setupWire();
    this.resize();

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    Promise.resolve(fontsReady).then(() => {
      if (!this.mounted) return;
      this.measureTextTargets();
      this.measureWireGeometry();
      this.updateScrollMaximum();
      this.updateTextReveals(performance.now());
      this.draw(performance.now());
      document.documentElement.classList.add("pixel-grid-ready");
      this.ready = true;
      this.setupPortraitObserver();
      this.requestFrame();
    });
  }

  destroy() {
    if (!this.mounted) return;
    this.mounted = false;
    cancelAnimationFrame(this.raf);
    clearTimeout(this.animationTimer);
    this.raf = 0;
    this.abortController?.abort();
    this.resizeObserver?.disconnect();
    this.contentResizeObserver?.disconnect();
    this.revealObserver?.disconnect();
    this.portraitObserver?.disconnect();
    document.documentElement.classList.remove("pixel-grid-ready");
    this.clearTextTargets();
    this.clearPortrait();
    this.clearWireCanvases();
    for (const element of [this.wireLine, this.wireFill, ...this.wireNodes.flatMap(({ dot, stub }) => [dot, stub])]) {
      if (element) element.style.opacity = "";
    }

    if (this.wrapper) {
      this.wrapper.style.transform = "none";
      this.wrapper.style.willChange = "auto";
    }
    if (this.spacer) this.spacer.style.display = "";
    if (this.gridBackground) this.gridBackground.style.transform = "none";
    if (this.progress) this.progress.style.scale = "0 1";
    if (this.portraitHost) {
      this.portraitHost.style.height = "";
      this.portraitHost.style.aspectRatio = "";
    }
    for (const block of document.querySelectorAll("[data-reveal]")) {
      block.style.opacity = "";
      block.style.transform = "";
      block.style.transition = "";
      delete block.dataset.pixelReveal;
    }
    if (this.canvas && this.context) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  bind() {
    const signal = this.abortController.signal;

    window.addEventListener(
      "resize",
      () => {
        this.resizePending = true;
        this.requestFrame();
      },
      { signal, passive: true },
    );
    window.addEventListener(
      "scroll",
      () => {
        this.lastScrollAt = performance.now();
        this.requestFrame();
      },
      { signal, passive: true },
    );
    window.addEventListener(
      "pointermove",
      (event) => {
        if (this.calmMotion || event.pointerType === "touch") return;
        this.previousPointer = this.pointer;
        this.pointer = { x: event.clientX, y: event.clientY };
        this.lastPointerAt = performance.now();
        const candidate = event.target?.closest?.("a, button") ?? null;
        this.hoverElement = candidate;
        if (candidate) this.hoverHistory.set(candidate, this.lastPointerAt);
        this.requestFrame();
      },
      { signal, passive: true },
    );
    window.addEventListener(
      "pointerleave",
      () => {
        this.pointer = null;
        this.previousPointer = null;
        this.hoverElement = null;
        this.requestFrame();
      },
      { signal, passive: true },
    );
    document.addEventListener(
      "pointerover",
      (event) => {
        if (this.calmMotion || event.pointerType === "touch") return;
        const candidate = event.target?.closest?.("a, button") ?? null;
        this.hoverElement = candidate;
        if (candidate) this.hoverHistory.set(candidate, performance.now());
        this.requestFrame();
      },
      { signal, passive: true },
    );
    document.addEventListener(
      "pointerout",
      (event) => {
        const leaving = event.target?.closest?.("a, button") ?? null;
        if (leaving && leaving === this.hoverElement) {
          this.hoverHistory.set(leaving, performance.now());
          this.hoverElement = null;
          this.requestFrame();
        }
      },
      { signal, passive: true },
    );
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) {
          cancelAnimationFrame(this.raf);
          clearTimeout(this.animationTimer);
          this.raf = 0;
        } else {
          this.requestFrame();
        }
      },
      { signal },
    );

    for (const query of ["(prefers-reduced-motion: reduce)", "(hover: none), (pointer: coarse)"]) {
      window.matchMedia(query).addEventListener("change", () => this.updateMotionPreferences(), { signal });
    }

    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        const rect = this.canvas.getBoundingClientRect();
        const width = Math.round(rect.width);
        const height = Math.round(rect.height);
        if (width && height && (width !== this.width || height !== this.height)) {
          this.resizePending = true;
          this.requestFrame();
        }
      });
      this.resizeObserver.observe(this.canvas);

      this.contentResizeObserver = new ResizeObserver(() => {
        this.geometryPending = true;
        this.requestFrame();
      });
      this.contentResizeObserver.observe(this.wrapper);
    }
  }

  updateMotionPreferences() {
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    this.calmMotion = this.reducedMotion || this.coarsePointer;
    this.pointer = null;
    this.hoverElement = null;
    this.heat.clear();
    this.hoverHistory.clear();
    this.setupReveals();
    this.resizePending = true;
    this.requestFrame();
  }

  setupReveals() {
    this.revealObserver?.disconnect();
    this.revealObserver = null;
    this.revealBlocks = [...document.querySelectorAll("[data-reveal]")];
    for (const block of this.revealBlocks) {
      if (this.calmMotion) {
        block.style.opacity = "1";
        block.style.transform = "none";
        block.style.transition = "none";
        block.dataset.pixelReveal = "visible";
        continue;
      }
      if (block.dataset.pixelReveal) continue;
      block.dataset.pixelReveal = "pending";
      block.style.opacity = "0";
      block.style.transform = "none";
      block.style.transition = "opacity .25s ease-out";
    }

    this.revealBlocks = this.revealBlocks.filter((block) => block.dataset.pixelReveal !== "visible");
    if (this.calmMotion || !window.IntersectionObserver) return;
    this.revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const block = entry.target;
          block.style.opacity = "1";
          block.style.transform = "none";
          block.dataset.pixelReveal = "visible";
          this.revealObserver.unobserve(block);
          const index = this.revealBlocks.indexOf(block);
          if (index >= 0) this.revealBlocks.splice(index, 1);
        }
      },
      { rootMargin: `0px 0px -${Math.round(window.innerHeight * 0.08)}px 0px` },
    );
    for (const block of this.revealBlocks) this.revealObserver.observe(block);
  }

  runReveals() {
    if (
      this.reducedMotion ||
      this.revealObserver ||
      this.revealBlocks.length === 0
    ) {
      return;
    }
    for (let index = this.revealBlocks.length - 1; index >= 0; index -= 1) {
      const block = this.revealBlocks[index];
      const rect = block.getBoundingClientRect();
      if (rect.top < this.height * 0.92 && rect.bottom > -80) {
        block.style.opacity = "1";
        block.style.transform = "none";
        block.dataset.pixelReveal = "visible";
        this.revealBlocks.splice(index, 1);
      }
    }
  }

  setupWire() {
    this.wireTrack = document.querySelector("[data-wire-track]");
    this.wireLine = document.querySelector("[data-wire-line]");
    this.wireFill = document.querySelector("[data-wire-fill]");
    this.wireNodes = [...document.querySelectorAll("[data-node]")].map(
      (node) => ({
        node,
        dot: node.querySelector("[data-dot]"),
        stub: node.querySelector("[data-stub]"),
      }),
    );

    const cellMode = this.config.wireRender === "cells";
    if (this.wireLine) this.wireLine.style.opacity = cellMode ? "0" : "1";
    if (this.wireFill) this.wireFill.style.opacity = cellMode ? "0" : "1";
    for (const { dot, stub } of this.wireNodes) {
      if (dot) dot.style.opacity = cellMode ? "0" : "1";
      if (stub) stub.style.opacity = cellMode ? "0" : "1";
    }
  }

  measureWireGeometry() {
    if (!this.wireTrack) {
      this.wireGeometry = null;
      return;
    }
    const trackRect = this.wireTrack.getBoundingClientRect();
    const lineRect = this.wireLine?.getBoundingClientRect();
    this.wireGeometry = {
      top: trackRect.top + this.currentY,
      height: trackRect.height,
      left: trackRect.left,
      wireX: lineRect?.width
        ? lineRect.left + lineRect.width / 2
        : trackRect.left + 8,
    };
    for (const item of this.wireNodes) {
      if (!item.dot) continue;
      const nodeRect = item.node.getBoundingClientRect();
      const dotRect = item.dot.getBoundingClientRect();
      item.left = nodeRect.left;
      item.dotTop = dotRect.top + this.currentY;
      item.centerRow = Math.round(
        (item.dotTop + dotRect.height / 2) / this.cell,
      );
    }
    this.setupWireCanvases();
  }

  clearWireCanvases() {
    for (const tile of this.wireTiles) tile.canvas.remove();
    this.wireTiles = [];
    this.wireCacheKey = null;
  }

  setupWireCanvases() {
    if (this.config.wireRender !== "cells") return;
    const geometry = this.wireGeometry;
    const firstRow = Math.floor(geometry.top / this.cell) - 4;
    const lastRow = Math.ceil((geometry.top + geometry.height) / this.cell) + 4;
    const left = (Math.floor(geometry.wireX / this.cell) - 4) * this.cell;
    const right = Math.max(geometry.wireX + this.cell * 4, ...this.wireNodes.map((item) => item.left || 0));
    const width = Math.ceil((right - left) / this.cell + 1) * this.cell;
    const key = [geometry.top, geometry.left, firstRow, lastRow, left, width, this.cell, this.dpr].join(":");
    if (key === this.wireCacheKey) return;
    this.clearWireCanvases();
    this.wireCacheKey = key;
    // Small document-attached tiles avoid both scroll lag and mobile canvas
    // dimension limits as the timeline grows.
    const tileRows = 128;
    for (let row = firstRow; row <= lastRow; row += tileRows) {
      const rows = Math.min(tileRows, lastRow - row + 1);
      const canvas = document.createElement("canvas");
      canvas.className = "pixel-wire-cache";
      canvas.setAttribute("aria-hidden", "true");
      canvas.width = Math.ceil(width * this.dpr);
      canvas.height = Math.ceil(rows * this.cell * this.dpr);
      canvas.style.cssText = `left:${left - geometry.left}px;top:${row * this.cell - geometry.top}px;width:${width}px;height:${rows * this.cell}px`;
      const context = canvas.getContext("2d");
      if (!context) continue;
      this.wireTrack.append(canvas);
      this.wireTiles.push({ canvas, context, left, row, rows });
    }
    this.drawWire(performance.now(), Math.max(1, (this.cell - this.gap) * this.dpr), true);
  }

  resize() {
    if (!this.mounted) return;
    this.resizePending = false;
    this.currentY = window.scrollY;
    const previousWidth = this.width;
    const previousDpr = this.dpr;
    const previousCell = this.cell;
    const previousHeight = this.height;
    this.viewportWidth = window.innerWidth;
    this.cell =
      this.viewportWidth < 760
        ? Math.max(3, Math.round(this.config.cellSize * 0.75))
        : this.config.cellSize;
    // Keep finer lettering dense enough to read at smaller display sizes.
    this.gap = this.cell >= 7 ? 2 : this.cell >= 5 ? 1 : 0.5;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.round(rect.width) || window.innerWidth;
    this.height = Math.round(rect.height) || window.innerHeight;
    const widthChanged = previousWidth !== this.width || previousDpr !== this.dpr || previousCell !== this.cell;
    const overlayEnabled = !this.calmMotion;
    if (widthChanged || previousHeight !== this.height || overlayEnabled !== this.overlayEnabled) {
      this.canvas.width = overlayEnabled ? Math.round(this.width * this.dpr) : 1;
      this.canvas.height = overlayEnabled ? Math.round(this.height * this.dpr) : 1;
      this.overlayEnabled = overlayEnabled;
    }
    if (widthChanged) this.clearPortrait();
    this.updateGridMetrics();
    if (widthChanged) this.measureWireGeometry();
    this.updateScrollMaximum();
    if (this.ready) {
      if (widthChanged) this.measureTextTargets();
      if (previousHeight !== this.height) this.setupReveals();
      this.setupPortraitObserver();
    }
  }

  updateGridMetrics() {
    if (!this.gridBackground) return;
    this.gridBackground.style.setProperty("--grid-cell", `${this.cell}px`);
    this.gridBackground.style.setProperty("--grid-gap", `${this.gap}px`);
    this.gridBackground.style.setProperty("--grid-color", this.ramp[0]);
  }

  updateScrollMaximum() {
    this.scrollMaximum = Math.max(
      1,
      this.wrapper.offsetTop + this.wrapper.offsetHeight - window.innerHeight,
    );
  }

  clearTextTargets() {
    for (const target of this.textTargets) {
      if (target.complete || target.startedAt) this.revealedText.add(target.element);
      target.canvas.remove();
      delete target.element.dataset.pixelText;
    }
    this.textTargets = [];
  }

  measureTextTargets() {
    if (!this.mounted) return;
    this.clearTextTargets();
    const elements =
      this.config.renderScope === "display"
        ? [...document.querySelectorAll("[data-cell]")]
        : [...document.querySelectorAll("[data-smooth] *")].filter(
            (element) =>
              element.children.length === 0 && element.textContent?.trim(),
          );

    this.textTargets = elements
      .map((element) => this.rasterizeText(element))
      .filter(Boolean);
  }

  rasterizeText(element) {
    const rect = element.getBoundingClientRect();
    const width = Math.ceil(rect.width);
    const height = Math.ceil(rect.height);
    const text = element.innerText || element.textContent || "";
    if (!width || !height || !text.trim()) return null;

    const style = getComputedStyle(element);
    const fontSize = Number.parseFloat(style.fontSize) || 16;
    const lineHeight = Number.parseFloat(style.lineHeight) || fontSize * 1.25;
    const scale = Math.min(2, Math.max(1, 8 / this.cell));
    const offscreen = document.createElement("canvas");
    offscreen.width = Math.ceil(width * scale);
    offscreen.height = Math.ceil(height * scale);
    const context = offscreen.getContext("2d", { willReadFrequently: true });
    if (!context) return null;

    context.scale(scale, scale);
    context.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
    context.textBaseline = "alphabetic";
    context.fillStyle = "#fff";
    context.strokeStyle = "#fff";
    context.lineJoin = "round";
    context.lineWidth = Math.max(1, fontSize * 0.035);
    if ("letterSpacing" in context) context.letterSpacing = style.letterSpacing;

    const lines = text.split(/\n/).map((line) => line.trim());
    const metrics = context.measureText("Hxg");
    const ascent = metrics.fontBoundingBoxAscent || fontSize * 0.82;
    const descent = metrics.fontBoundingBoxDescent || fontSize * 0.22;
    const baseline = (lineHeight - (ascent + descent)) / 2 + ascent;
    const paddingLeft = Number.parseFloat(style.paddingLeft) || 0;
    const paddingTop = Number.parseFloat(style.paddingTop) || 0;

    lines.forEach((line, index) => {
      let x = paddingLeft;
      if (style.textAlign === "center") x = width / 2;
      if (style.textAlign === "right") x = width;
      context.textAlign = style.textAlign || "left";
      const y = paddingTop + index * lineHeight + baseline;
      if (element.hasAttribute("data-cell-outline")) {
        context.strokeText(line, x, y);
      } else {
        context.fillText(line, x, y);
      }
    });

    const pixels = context.getImageData(
      0,
      0,
      offscreen.width,
      offscreen.height,
    ).data;
    const cells = [];
    const columns = Math.ceil(width / this.cell);
    const rows = Math.ceil(height / this.cell);
    const step = Math.max(1, Math.round((this.cell * scale) / 4));

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const x0 = Math.floor(column * this.cell * scale);
        const x1 = Math.min(
          offscreen.width,
          Math.ceil((column + 1) * this.cell * scale),
        );
        const y0 = Math.floor(row * this.cell * scale);
        const y1 = Math.min(
          offscreen.height,
          Math.ceil((row + 1) * this.cell * scale),
        );
        let sum = 0;
        let count = 0;
        for (let y = y0; y < y1; y += step) {
          for (let x = x0; x < x1; x += step) {
            sum += pixels[(y * offscreen.width + x) * 4 + 3];
            count += 1;
          }
        }
        const alpha = count ? sum / count / 255 : 0;
        let level = alpha > 0.7 ? 4 : alpha > 0.46 ? 3 : alpha > 0.24 ? 2 : alpha > 0.08 ? 1 : 0;
        if (level === 1 && this.hash(column, row) % 100 < 34) level = 0;
        if (level) cells.push({ column, row, level });
      }
    }

    if (!cells.length) return null;
    const minColumn = Math.min(...cells.map((cell) => cell.column));
    const maxColumn = Math.max(...cells.map((cell) => cell.column));
    const minRow = Math.min(...cells.map((cell) => cell.row));
    const maxRow = Math.max(...cells.map((cell) => cell.row));
    const documentTop = rect.top + this.currentY;
    const snappedX = (Math.round(rect.left / this.cell) + minColumn) * this.cell;
    const snappedY = (Math.round(documentTop / this.cell) + minRow) * this.cell;
    const cacheWidth = (maxColumn - minColumn + 1) * this.cell;
    const cacheHeight = (maxRow - minRow + 1) * this.cell;
    const cache = document.createElement("canvas");
    cache.width = Math.ceil(cacheWidth * this.dpr);
    cache.height = Math.ceil(cacheHeight * this.dpr);
    const cacheContext = cache.getContext("2d");
    if (!cacheContext) return null;
    const square = Math.max(1, (this.cell - this.gap) * this.dpr);
    for (let level = 1; level <= 4; level += 1) {
      cacheContext.fillStyle = this.ramp[level];
      cacheContext.beginPath();
      for (const cell of cells) {
        if (cell.level !== level) continue;
        cacheContext.rect(
          Math.round((cell.column - minColumn) * this.cell * this.dpr),
          Math.round((cell.row - minRow) * this.cell * this.dpr),
          square,
          square,
        );
      }
      cacheContext.fill();
    }

    const reveal = element.hasAttribute("data-cell-reveal") && this.config.typeIn && !this.calmMotion && !this.revealedText.has(element);
    cache.className = "pixel-text-cache";
    cache.setAttribute("aria-hidden", "true");
    cache.style.cssText = `left:${snappedX - rect.left}px;top:${snappedY - documentTop}px;width:${cacheWidth}px;height:${cacheHeight}px`;
    cache.style.clipPath = reveal ? "inset(0 100% 0 0)" : "none";
    element.append(cache);
    element.dataset.pixelText = "";
    return {
      element,
      canvas: cache,
      x: snappedX,
      width: cacheWidth,
      y: snappedY,
      maxColumn: maxColumn - minColumn,
      reveal,
      startedAt: 0,
      complete: !reveal,
      visibleWidth: reveal ? 0 : cacheWidth,
    };
  }

  requestFrame() {
    if (!this.mounted || document.hidden || this.raf) return;
    clearTimeout(this.animationTimer);
    this.raf = requestAnimationFrame((time) => this.frame(time));
  }

  frame(now) {
    this.raf = 0;
    if (!this.mounted) return;

    const scrollY = window.scrollY;
    this.currentY = scrollY;
    if (this.resizePending) this.resize();
    if (this.geometryPending) {
      this.geometryPending = false;
      this.measureWireGeometry();
      this.measurePortraitGeometry();
      this.updateScrollMaximum();
      // Local canvases stay attached to their elements when other content moves.
      for (const target of this.textTargets) {
        target.y = target.element.getBoundingClientRect().top + scrollY;
      }
    }

    this.runReveals();
    this.updateTextReveals(now);
    this.updatePointer(now);
    this.draw(now);
    this.updateChrome(now);

    if (this.needsAnotherFrame(now, scrollY)) {
      this.requestFrame();
    } else if (this.wireInProgress || this.hoverElement) {
      // Only changing decorative cells need a timer while the page is at rest.
      this.animationTimer = setTimeout(() => this.requestFrame(), this.wireInProgress ? 90 : 120);
    }
  }

  needsAnotherFrame(now, scrollY) {
    // Do not keep the animation loop alive for headings that have not entered
    // the viewport yet. A scroll event will schedule the frame that starts them.
    const typing = this.textTargets.some(
      (target) => target.startedAt > 0 && !target.complete,
    );
    const pointerActive = this.pointer && now - this.lastPointerAt < 120;
    return Boolean(
      typing ||
        pointerActive ||
        this.heat.size ||
        [...this.hoverHistory.keys()].some((element) => element !== this.hoverElement) ||
        now < this.wireAnimatingUntil,
    );
  }

  updatePointer(now) {
    if (!this.pointer || this.coarsePointer || this.reducedMotion) return;
    // Once movement stops, let existing heat finish its configured fade instead
    // of renewing it on every animation frame.
    if (now - this.lastPointerAt > 80) return;
    const geometry = this.portraitGeometry;
    const portraitRect = geometry && {
      ...geometry,
      top: geometry.top - this.currentY,
      bottom: geometry.top + geometry.height - this.currentY,
      right: geometry.left + geometry.width,
    };
    const overPortrait =
      portraitRect &&
      this.pointer.x >= portraitRect.left &&
      this.pointer.x <= portraitRect.right &&
      this.pointer.y >= portraitRect.top &&
      this.pointer.y <= portraitRect.bottom;
    const targetRadius = this.hoverElement
      ? Math.max(0.8, this.config.brushRadius * 0.32)
      : overPortrait
        ? this.config.brushRadius * 2.1
        : this.config.brushRadius;
    this.brushRadius += (targetRadius - this.brushRadius) * 0.16;
    this.stampHeat(this.pointer.x, this.pointer.y + this.currentY, now);
    if (overPortrait) this.rememberPortraitCells(portraitRect);
  }

  stampHeat(x, documentY, now) {
    const centerColumn = Math.floor(x / this.cell);
    const centerRow = Math.floor(documentY / this.cell);
    const radius = this.brushRadius;
    const span = Math.ceil(radius) + 3;

    for (let dy = -span; dy <= span; dy += 1) {
      for (let dx = -span; dx <= span; dx += 1) {
        const distance = Math.hypot(dx, dy);
        if (distance > radius + 1.2) continue;
        const falloff = Math.max(0, 1 - distance / (radius + 1.2));
        const random = (this.hash(centerColumn + dx, centerRow + dy) % 1000) / 1000;
        if (falloff < 0.55 && random > falloff + 0.2) continue;
        const level = Math.max(1, Math.min(4, Math.ceil(falloff * 4)));
        const key = `${centerColumn + dx},${centerRow + dy}`;
        const previous = this.heat.get(key);
        if (!previous || previous.level <= level) {
          this.heat.set(key, { time: now, level });
        } else {
          previous.time = now;
        }
      }
    }

    if (this.heat.size > 6000) {
      const overflow = this.heat.size - 5000;
      for (const key of this.heat.keys()) {
        this.heat.delete(key);
        if (this.heat.size <= 5000 || this.heat.size <= overflow) break;
      }
    }
  }

  draw(now) {
    const context = this.context;
    const scale = this.dpr;
    const square = Math.max(1, (this.cell - this.gap) * scale);
    this.drawWire(now, square);
    if (this.heat.size || this.hoverHistory.size || this.overlayDirty) {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawHeat(now, square);
      this.drawHoveredLinks(now, square);
      this.overlayDirty = this.heat.size > 0 || this.hoverHistory.size > 0;
    }
    if (!this.portraitObserver && !this.portrait) this.drawPortrait();
  }

  updateTextReveals(now) {
    for (const target of this.textTargets) {
      const viewportY = target.y - this.currentY;
      if (this.calmMotion || this.reducedMotion) {
        target.complete = true;
        target.visibleWidth = target.width;
      }
      if (target.reveal && !target.complete && !target.startedAt && viewportY < this.height * 0.94 && viewportY > -400) {
        target.startedAt = now;
      }
      if (target.reveal && target.startedAt && !target.complete) {
        const raw = Math.min(1, (now - target.startedAt) / 480);
        const eased = raw * (2 - raw);
        const visibleColumn = Math.floor(target.maxColumn * eased);
        const visibleWidth = Math.min(
          target.width,
          (visibleColumn + 1) * this.cell,
        );
        target.visibleWidth = visibleWidth;
        if (raw >= 1) {
          target.complete = true;
          target.visibleWidth = target.width;
        }
      }
      if (target.canvas && target.lastVisibleWidth !== target.visibleWidth) {
        target.canvas.style.clipPath = target.complete ? "none" : `inset(0 ${Math.max(0, target.width - target.visibleWidth)}px 0 0)`;
        target.lastVisibleWidth = target.visibleWidth;
      }
      if (target.complete && target.element) this.revealedText.add(target.element);
    }
  }

  drawHeat(now, square) {
    const context = this.context;
    const scale = this.dpr;
    for (const [key, value] of this.heat) {
      const age = now - value.time;
      if (age >= this.config.paintFade) {
        this.heat.delete(key);
        continue;
      }
      const comma = key.indexOf(",");
      const column = Number(key.slice(0, comma));
      const row = Number(key.slice(comma + 1));
      const level = Math.max(
        1,
        Math.ceil(value.level * (1 - age / this.config.paintFade)),
      );
      const y = row * this.cell - this.currentY;
      if (y < -this.cell || y > this.height + this.cell) continue;
      context.fillStyle = this.ramp[level];
      context.fillRect(
        Math.round(column * this.cell * scale),
        Math.round(y * scale),
        square,
        square,
      );
    }
  }

  drawHoveredLinks(now, square) {
    if (this.hoverElement) this.hoverHistory.set(this.hoverElement, now);
    const context = this.context;
    const scale = this.dpr;
    const tick = Math.floor(now / 120);

    for (const [element, lastSeen] of this.hoverHistory) {
      if (!element.isConnected) {
        this.hoverHistory.delete(element);
        continue;
      }
      const active = element === this.hoverElement;
      const age = active ? 0 : now - lastSeen;
      if (!active && age > 300) {
        this.hoverHistory.delete(element);
        continue;
      }
      const alpha = active ? 1 : Math.max(0, 1 - age / 300);
      const rect = element.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > this.height) continue;
      if (!this.hoverBordered.has(element)) {
        this.hoverBordered.set(
          element,
          Number.parseFloat(getComputedStyle(element).borderTopWidth) > 0,
        );
      }
      const bordered = this.hoverBordered.get(element);
      const paddingX = bordered ? 0 : this.cell * 3;
      const paddingY = bordered ? 0 : this.cell;
      const left = rect.left - paddingX;
      const right = rect.right + paddingX;
      const top = rect.top - paddingY;
      const bottom = rect.bottom + paddingY;
      const startColumn = Math.floor(left / this.cell);
      const endColumn = Math.ceil(right / this.cell);
      const startRow = Math.floor((top + this.currentY) / this.cell);
      const endRow = Math.ceil((bottom + this.currentY) / this.cell);

      context.save();
      context.globalAlpha = alpha;
      if (bordered) {
        context.beginPath();
        context.rect(
          rect.left * scale,
          rect.top * scale,
          rect.width * scale,
          rect.height * scale,
        );
        context.clip();
      }
      for (let row = startRow; row < endRow; row += 1) {
        for (let column = startColumn; column < endColumn; column += 1) {
          if (!bordered) {
            const x =
              ((column + 0.5) * this.cell - (rect.left + rect.width / 2)) /
              (rect.width / 2 + paddingX);
            const y =
              (row * this.cell -
                this.currentY +
                this.cell / 2 -
                (rect.top + rect.height / 2)) /
              (rect.height / 2 + paddingY);
            if (x * x + y * y > 1) continue;
          }
          const random = (this.hash(column + tick, row - tick) + tick) % 7;
          const level = INTERACTIVE_HOVER_LEVELS[random];
          context.fillStyle = this.ramp[level];
          context.fillRect(
            Math.round(column * this.cell * scale),
            Math.round((row * this.cell - this.currentY) * scale),
            square,
            square,
          );
        }
      }
      context.restore();
    }
  }

  drawWire(now, square, paintAll = false) {
    const geometry = this.wireGeometry;
    if (!geometry) return;
    const cellMode = this.config.wireRender === "cells";
    if (!cellMode) return;

    const scale = this.dpr;
    const column = Math.round(geometry.wireX / this.cell);
    const trackTop = geometry.top - this.currentY;
    const startRow = Math.floor(geometry.top / this.cell);
    const endRow = Math.ceil(
      (geometry.top + geometry.height) / this.cell,
    );
    const wireHeadViewportRatio = 0.55;
    const nodeActivationViewportRatio = 0.62;
    const progress = Math.max(
      0,
      Math.min(
        1,
        (this.height * wireHeadViewportRatio - trackTop) /
          Math.max(1, geometry.height),
      ),
    );
    this.wireInProgress = !this.calmMotion && progress > 0.001 && progress < 0.999 && now - this.lastScrollAt < 180;
    const head = startRow + Math.round((endRow - startRow) * progress);
    const drawKey = [head, Math.floor(this.currentY / (this.cell * 128)), this.calmMotion, this.wireInProgress ? Math.floor(now / 90) : 0, now < this.wireAnimatingUntil ? Math.floor(now / 16) : 0].join(":");
    if (!paintAll && drawKey === this.wireDrawKey) return;
    this.wireDrawKey = drawKey;
    const activeTiles = this.wireTiles.filter((tile) => paintAll || (
      (tile.row + tile.rows) * this.cell > this.currentY - this.cell * 128 &&
      tile.row * this.cell < this.currentY + this.height + this.cell * 128
    ));
    const dirtyTiles = new Set(activeTiles);
    for (const tile of activeTiles) tile.context.clearRect(0, 0, tile.canvas.width, tile.canvas.height);

    const putCell = (cellColumn, cellRow, level) => {
      if (!level) return;
      const first = this.wireTiles[0];
      if (!first) return;
      const tile = this.wireTiles[Math.floor((cellRow - first.row) / 128)];
      if (!tile || !dirtyTiles.has(tile)) return;
      const context = tile.context;
      context.fillStyle = this.ramp[Math.min(4, level)];
      context.fillRect(
        Math.round((cellColumn * this.cell - tile.left) * scale),
        Math.round((cellRow - tile.row) * this.cell * scale),
        square,
        square,
      );
    };

    const firstVisibleRow = activeTiles[0]?.row ?? endRow;
    const lastTile = activeTiles.at(-1);
    const lastVisibleRow = lastTile ? lastTile.row + lastTile.rows : startRow;
    for (let row = Math.max(startRow, firstVisibleRow); row <= Math.min(endRow, lastVisibleRow); row += 1) {
      const hash = this.hash(column, row);
      let level = row <= head ? (hash % 7 < 5 ? 3 : 2) : hash % 6 < 4 ? 1 : 0;
      const distance = Math.abs(row - head);
      if (distance < 3) level = Math.max(level, 4 - distance);
      putCell(column, row, level);
    }

    // A short spray responds to scrolling, then settles instead of looping.
    if (this.wireInProgress) {
      const phase = Math.floor(now / 90);
      for (let dy = -3; dy <= 3; dy += 1) {
        for (let dx = -3; dx <= 3; dx += 1) {
          if (!dx && !dy) continue;
          const distance = Math.hypot(dx, dy);
          if ((this.hash(column + dx, head + dy) + phase) % 13 >= 2) continue;
          putCell(column + dx, head + dy, distance < 2 ? 3 : 1);
        }
      }
    }

    for (const item of this.wireNodes) {
      if (!item.dot || item.centerRow == null) continue;
      const centerRow = item.centerRow;
      const nodeRadius = 2;
      const nodeColumns = nodeRadius * 2 + 1;
      const columnDuration = 32;
      const nodeDuration = nodeColumns * columnDuration;
      const branchDuration = 220;
      const totalDuration = nodeDuration + branchDuration;
      // Match the reference's timing: nodes begin slightly ahead of the wire
      // head (62% versus 55% of the viewport), leaving time for the discrete
      // column fill before the trace has travelled toward the next node.
      const reached =
        item.dotTop - this.currentY <
        this.height * nodeActivationViewportRatio;
      const viewportY = centerRow * this.cell - this.currentY;
      let state = this.nodeStates.get(item.node);
      if (!state) {
        state = {
          progress: reached && viewportY < -this.cell * 6 ? 1 : 0,
          lastTime: now,
        };
        this.nodeStates.set(item.node, state);
      }

      const target = reached ? 1 : 0;
      const frameDelta = Math.min(64, Math.max(0, now - state.lastTime));
      state.lastTime = now;
      const visible = viewportY >= -this.cell * 6 && viewportY <= this.height + this.cell * 6;
      if (this.calmMotion || !visible) {
        state.progress = target;
      } else if (state.progress < target) {
        state.progress = Math.min(target, state.progress + frameDelta / totalDuration);
      } else if (state.progress > target) {
        state.progress = Math.max(target, state.progress - frameDelta / totalDuration);
      }
      if (Math.abs(state.progress - target) > 0.0001) {
        this.wireAnimatingUntil = Math.max(this.wireAnimatingUntil, now + 80);
      }

      const elapsed = state.progress * totalDuration;
      const filledColumns = Math.min(
        nodeColumns,
        Math.ceil(Math.min(nodeDuration, elapsed) / columnDuration),
      );
      const branchProgress = Math.min(
        1,
        Math.max(0, elapsed - nodeDuration) / branchDuration,
      );

      // A fixed 5×5 grid node stays symmetric regardless of the DOM element's
      // fractional position. Its columns fill left-to-right as the head crosses
      // it and clear right-to-left when the wire recedes. The branch extends
      // after the node fills and retracts before the node begins clearing.
      for (let dy = -nodeRadius; dy <= nodeRadius; dy += 1) {
        for (let dx = -nodeRadius; dx <= nodeRadius; dx += 1) {
          const edge = Math.abs(dx) === nodeRadius || Math.abs(dy) === nodeRadius;
          const columnIndex = dx + nodeRadius;
          const columnFilled = columnIndex < filledColumns;
          if (!columnFilled && !edge) continue;
          const level = columnFilled
            ? dx === 0 && dy === 0
              ? 4
              : edge
                ? 3
                : 2
            : 1;
          putCell(column + dx, centerRow + dy, level);
        }
      }

      const startColumn = column + nodeRadius + 1;
      const endColumn = Math.max(
        startColumn,
        Math.floor(item.left / this.cell),
      );
      const filledThrough = startColumn +
        Math.round((endColumn - startColumn) * branchProgress);
      for (let current = startColumn; current <= endColumn; current += 1) {
        putCell(
          current,
          centerRow,
          branchProgress > 0 && current <= filledThrough
            ? current === filledThrough
              ? 4
              : 3
            : 1,
        );
      }
    }
  }

  clearPortrait() {
    this.portraitBuildController?.abort();
    this.portraitBuildController = null;
    this.portraitLoading = null;
    this.portrait?.canvas?.remove();
    this.portrait = null;
    this.portraitLit.clear();
  }

  measurePortraitGeometry() {
    if (!this.portraitHost) return;
    const rect = this.portraitHost.getBoundingClientRect();
    this.portraitGeometry = {
      left: rect.left,
      top: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    };
  }

  setupPortraitObserver() {
    this.portraitObserver?.disconnect();
    this.portraitObserver = null;
    this.measurePortraitGeometry();
    if (!this.portraitHost || this.portrait) return;
    if (window.IntersectionObserver) {
      this.portraitObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) this.drawPortrait();
      }, { rootMargin: `${this.height * 2}px 0px` });
      this.portraitObserver.observe(this.portraitHost);
    } else {
      this.drawPortrait();
    }
  }

  drawPortrait() {
    const geometry = this.portraitGeometry;
    if (!this.portraitHost || !geometry || !geometry.width || this.portrait || this.portraitLoading || this.portraitFailed) return;
    const scrollY = window.scrollY;
    if (geometry.top - scrollY > this.height * 3 || geometry.top + geometry.height - scrollY < -this.height * 2) return;
    const controller = new AbortController();
    this.portraitBuildController = controller;
    // Loading and processing both happen outside frame(). The DOM reserves the
    // final aspect ratio from the first paint, including while loading fails.
    this.portraitAssets ??= Promise.all([
      import("@/data/portrait"),
      import("./portraitRenderer.js"),
    ]);
    this.portraitLoading = this.portraitAssets
      .then(([{ portraitData }, { createPortrait }]) => {
        if (!this.mounted || controller.signal.aborted) return null;
        return createPortrait({
          portraitData,
          width: geometry.width,
          cell: this.cell,
          dpr: this.dpr,
          ramp: this.ramp,
          signal: controller.signal,
        });
      })
      .then((portrait) => {
        if (!portrait || !this.mounted || controller.signal.aborted) return;
        portrait.canvas.style.width = "100%";
        portrait.canvas.style.height = "100%";
        this.portrait = portrait;
        this.portraitHost.append(portrait.canvas);
        this.portraitObserver?.disconnect();
      })
      .catch((error) => {
        if (error.name !== "AbortError") this.portraitFailed = true;
      })
      .finally(() => {
        if (this.portraitBuildController === controller) this.portraitLoading = null;
      });
  }

  paintPortraitCell(index) {
    const portrait = this.portrait;
    if (!portrait) return;
    const level = portrait.levels[index];
    if (!level) return;
    const row = Math.floor(index / portrait.columns);
    const column = index % portrait.columns;
    const portraitGap =
      portrait.cell >= 6 ? 2 : portrait.cell >= 3 ? 1 : 0.5;
    const square = Math.max(
      1,
      (portrait.cell - portraitGap) * this.dpr,
    );
    portrait.context.save();
    portrait.context.globalCompositeOperation = "lighter";
    portrait.context.globalAlpha = 0.4;
    portrait.context.fillStyle = this.ramp[level];
    portrait.context.fillRect(
      Math.round(column * portrait.cell * this.dpr),
      Math.round(row * portrait.cell * this.dpr),
      square,
      square,
    );
    portrait.context.restore();
  }

  rememberPortraitCells(rect) {
    if (!this.portrait || !this.pointer) return;
    const portrait = this.portrait;
    const column = Math.floor(
      ((this.pointer.x - rect.left) / rect.width) * portrait.columns,
    );
    const row = Math.floor(
      ((this.pointer.y - rect.top) / rect.height) * portrait.rows,
    );
    const radius = Math.max(2, Math.round(this.brushRadius));
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (Math.hypot(dx, dy) > radius + 0.35) continue;
        const x = column + dx;
        const y = row + dy;
        if (x < 0 || x >= portrait.columns || y < 0 || y >= portrait.rows) continue;
        const index = y * portrait.columns + x;
        if (portrait.levels[index] && !this.portraitLit.has(index)) {
          this.portraitLit.add(index);
          this.paintPortraitCell(index);
        }
      }
    }
  }

  updateChrome(now) {
    if (this.progress) {
      const progress = Math.max(
        0,
        Math.min(1, this.currentY / this.scrollMaximum),
      );
      if (progress !== this.progressValue) {
        this.progressValue = progress;
        this.progress.style.scale = `${progress} 1`;
      }
    }
    if (this.hoverElement) this.hoverHistory.set(this.hoverElement, now);
  }

  buildRamp(accent) {
    if (accent.toLowerCase() === "#8b5cf6") {
      return ["#161124", "#35255A", "#593C9C", "#8B5CF6", "#BFA5FA"];
    }
    const background = "#08080A";
    return [
      this.mix(background, accent, 0.11),
      this.mix(background, accent, 0.34),
      this.mix(background, accent, 0.62),
      accent,
      this.mix(accent, "#FFFFFF", 0.45),
    ];
  }

  mix(first, second, amount) {
    const parse = (value) => {
      const hex = value.replace("#", "");
      return [
        Number.parseInt(hex.slice(0, 2), 16),
        Number.parseInt(hex.slice(2, 4), 16),
        Number.parseInt(hex.slice(4, 6), 16),
      ];
    };
    const start = parse(first);
    const end = parse(second);
    return `#${start
      .map((value, index) =>
        Math.round(value + (end[index] - value) * amount)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")}`;
  }

  hash(x, y) {
    let value = Math.imul(x ^ 0x9e3779b9, 0x85ebca6b);
    value = Math.imul(value ^ y, 0xc2b2ae35);
    value ^= value >>> 16;
    return value >>> 0;
  }
}
