import { portraitData } from "@/data/portrait";

const DEFAULTS = {
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
};

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
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
    this.portraitLit = new Set();
    this.textTargets = [];
    this.revealBlocks = [];
    this.nodeStates = new WeakMap();
    this.pointer = null;
    this.previousPointer = null;
    this.hoverElement = null;
    this.portrait = null;
    this.pattern = null;
    this.lastPointerAt = 0;
    this.lastScrollAt = 0;
    this.wireInProgress = false;
    this.wireAnimatingUntil = 0;
    this.ready = false;
  }

  mount() {
    if (this.mounted) return;

    this.canvas = document.querySelector("[data-grid]");
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
    this.smooth = !this.reducedMotion;
    this.currentY = window.scrollY;
    this.targetY = this.currentY;
    this.brushRadius = this.config.brushRadius;
    this.ramp = this.buildRamp(this.config.accentColor);
    document.documentElement.style.setProperty("--accent", this.ramp[3]);

    if (this.spacer) this.spacer.style.display = "none";
    if (this.smooth) this.wrapper.style.willChange = "transform";

    this.bind();
    this.setupReveals();
    this.resize();

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    Promise.resolve(fontsReady).then(() => {
      if (!this.mounted) return;
      this.measureTextTargets();
      this.draw(performance.now());
      document.documentElement.classList.add("pixel-grid-ready");
      this.ready = true;
      this.requestFrame();
    });
  }

  destroy() {
    if (!this.mounted) return;
    this.mounted = false;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.abortController?.abort();
    this.resizeObserver?.disconnect();
    document.documentElement.classList.remove("pixel-grid-ready");

    if (this.wrapper) {
      this.wrapper.style.transform = "none";
      this.wrapper.style.willChange = "auto";
    }
    if (this.spacer) this.spacer.style.display = "";
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
        this.resize();
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
        if (this.coarsePointer || this.reducedMotion) return;
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
        if (this.coarsePointer || this.reducedMotion) return;
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
          this.raf = 0;
        } else {
          this.requestFrame();
        }
      },
      { signal },
    );

    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        const rect = this.canvas.getBoundingClientRect();
        const width = Math.round(rect.width);
        const height = Math.round(rect.height);
        if (width && height && (width !== this.width || height !== this.height)) {
          this.resize();
          this.requestFrame();
        }
      });
      this.resizeObserver.observe(this.canvas);
    }
  }

  setupReveals() {
    this.revealBlocks = [...document.querySelectorAll("[data-reveal]")];
    for (const block of this.revealBlocks) {
      if (this.reducedMotion) {
        block.style.opacity = "1";
        block.style.transform = "none";
        continue;
      }
      if (block.dataset.pixelReveal) continue;
      block.dataset.pixelReveal = "pending";
      block.style.opacity = "0";
      block.style.transform = "translateY(24px)";
      block.style.transition =
        "opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1)";
    }
  }

  runReveals() {
    if (this.reducedMotion || this.revealBlocks.length === 0) return;
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

  resize() {
    if (!this.mounted) return;
    this.viewportWidth = window.innerWidth;
    this.cell =
      this.viewportWidth < 760
        ? Math.max(4, Math.round(this.config.cellSize * 0.75))
        : this.config.cellSize;
    this.gap = this.cell >= 7 ? 2 : 1;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.round(rect.width) || window.innerWidth;
    this.height = Math.round(rect.height) || window.innerHeight;
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.pattern = null;
    this.portrait = null;
    this.measureTextTargets();
  }

  measureTextTargets() {
    if (!this.mounted) return;
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

    const maxColumn = cells.reduce(
      (maximum, cell) => Math.max(maximum, cell.column),
      1,
    );
    return {
      element,
      x: Math.round(rect.left / this.cell) * this.cell,
      y: Math.round((rect.top + this.currentY) / this.cell) * this.cell,
      cells,
      maxColumn,
      reveal: element.hasAttribute("data-cell-reveal"),
      startedAt: 0,
      complete: !element.hasAttribute("data-cell-reveal") || !this.config.typeIn,
    };
  }

  requestFrame() {
    if (!this.mounted || document.hidden || this.raf) return;
    this.raf = requestAnimationFrame((time) => this.frame(time));
  }

  frame(now) {
    this.raf = 0;
    if (!this.mounted) return;

    const scrollY = window.scrollY;
    if (this.smooth) {
      const difference = scrollY - this.currentY;
      this.currentY +=
        Math.abs(difference) < 0.08
          ? difference
          : difference * this.config.scrollEase;
      this.wrapper.style.transform = `translate3d(0,${(
        scrollY - this.currentY
      ).toFixed(2)}px,0)`;
    } else {
      this.currentY = scrollY;
      this.wrapper.style.transform = "none";
    }

    this.runReveals();
    this.updatePointer(now);
    this.draw(now);
    this.updateChrome(now);

    if (this.needsAnotherFrame(now, scrollY)) this.requestFrame();
  }

  needsAnotherFrame(now, scrollY) {
    const easing = this.smooth && Math.abs(scrollY - this.currentY) > 0.08;
    // Do not keep the animation loop alive for headings that have not entered
    // the viewport yet. A scroll event will schedule the frame that starts them.
    const typing = this.textTargets.some(
      (target) => target.startedAt > 0 && !target.complete,
    );
    const pointerActive = this.pointer && now - this.lastPointerAt < 120;
    return Boolean(
      easing ||
        typing ||
        pointerActive ||
        this.heat.size ||
        this.hoverHistory.size ||
        this.wireInProgress ||
        now < this.wireAnimatingUntil ||
        now - this.lastScrollAt < 180,
    );
  }

  updatePointer(now) {
    if (!this.pointer || this.coarsePointer || this.reducedMotion) return;
    // Once movement stops, let existing heat finish its configured fade instead
    // of renewing it on every animation frame.
    if (now - this.lastPointerAt > 80) return;
    const portraitRect = this.portraitHost?.getBoundingClientRect();
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
    const cellSize = this.cell * scale;
    const square = Math.max(1, (this.cell - this.gap) * scale);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.pattern) {
      const tile = document.createElement("canvas");
      tile.width = Math.round(cellSize);
      tile.height = Math.round(cellSize);
      const tileContext = tile.getContext("2d");
      tileContext.fillStyle = this.ramp[0];
      tileContext.fillRect(0, 0, square, square);
      this.pattern = context.createPattern(tile, "repeat");
    }

    const offsetY = -Math.round((this.currentY * scale) % Math.round(cellSize));
    context.save();
    context.translate(0, offsetY);
    context.fillStyle = this.pattern;
    context.fillRect(0, 0, this.canvas.width, this.canvas.height + cellSize);
    context.restore();

    this.drawText(now, square);
    this.drawWire(now, square);
    this.drawHeat(now, square);
    this.drawHoveredLinks(now, square);
    this.drawPortrait(square);
  }

  drawText(now, square) {
    const context = this.context;
    const scale = this.dpr;
    for (const target of this.textTargets) {
      const viewportY = target.y - this.currentY;
      if (viewportY > this.height + 160 || viewportY < -400) continue;
      if (target.reveal && !target.startedAt && viewportY < this.height * 0.94) {
        target.startedAt = now;
      }
      let visibleColumn = Number.POSITIVE_INFINITY;
      if (target.reveal && target.startedAt && !target.complete) {
        const raw = Math.min(1, (now - target.startedAt) / 760);
        const eased = raw * (2 - raw);
        visibleColumn = target.maxColumn * eased;
        if (raw >= 1) target.complete = true;
      } else if (target.reveal && !target.startedAt) {
        visibleColumn = -1;
      }

      for (const cell of target.cells) {
        if (cell.column > visibleColumn) continue;
        const x = (target.x + cell.column * this.cell) * scale;
        const y = (viewportY + cell.row * this.cell) * scale;
        context.fillStyle = this.ramp[cell.level];
        context.fillRect(Math.round(x), Math.round(y), square, square);
      }
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
      const bordered = Number.parseFloat(getComputedStyle(element).borderTopWidth) > 0;
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

  drawWire(now, square) {
    const track = document.querySelector("[data-wire-track]");
    if (!track) return;
    const line = document.querySelector("[data-wire-line]");
    const fill = document.querySelector("[data-wire-fill]");
    const cellMode = this.config.wireRender === "cells";
    if (line) line.style.opacity = cellMode ? "0" : "1";
    if (fill) fill.style.opacity = cellMode ? "0" : "1";
    if (!cellMode) return;

    const context = this.context;
    const scale = this.dpr;
    const trackRect = track.getBoundingClientRect();
    const lineRect = line?.getBoundingClientRect();
    const wireX = lineRect?.width
      ? lineRect.left + lineRect.width / 2
      : trackRect.left + 8;
    const column = Math.round(wireX / this.cell);
    const top = trackRect.top + this.currentY;
    const startRow = Math.floor(top / this.cell);
    const endRow = Math.ceil((top + trackRect.height) / this.cell);
    const wireHeadViewportRatio = 0.55;
    const nodeActivationViewportRatio = 0.62;
    const progress = Math.max(
      0,
      Math.min(
        1,
        (this.height * wireHeadViewportRatio - trackRect.top) /
          Math.max(1, trackRect.height),
      ),
    );
    this.wireInProgress = progress > 0.001 && progress < 0.999;
    const head = startRow + Math.round((endRow - startRow) * progress);

    const putCell = (cellColumn, cellRow, level) => {
      if (!level) return;
      const y = cellRow * this.cell - this.currentY;
      if (y < -this.cell || y > this.height + this.cell) return;
      context.fillStyle = this.ramp[Math.min(4, level)];
      context.fillRect(
        Math.round(cellColumn * this.cell * scale),
        Math.round(y * scale),
        square,
        square,
      );
    };

    for (let row = startRow; row <= endRow; row += 1) {
      const hash = this.hash(column, row);
      let level = row <= head ? (hash % 7 < 5 ? 3 : 2) : hash % 6 < 4 ? 1 : 0;
      const distance = Math.abs(row - head);
      if (distance < 3) level = Math.max(level, 4 - distance);
      putCell(column, row, level);
    }

    // The head keeps shedding a deterministic spray for the entire active
    // portion of the trace. The Page Visibility handler pauses the rAF loop
    // when the tab is hidden and resumes it when the page becomes visible.
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

    for (const node of document.querySelectorAll("[data-node]")) {
      const nodeRect = node.getBoundingClientRect();
      const dot = node.querySelector("[data-dot]");
      const stub = node.querySelector("[data-stub]");
      if (dot) dot.style.opacity = "0";
      if (stub) stub.style.opacity = "0";
      if (!dot) continue;
      const dotRect = dot.getBoundingClientRect();
      const centerRow = Math.round(
        (dotRect.top + dotRect.height / 2 + this.currentY) / this.cell,
      );
      const nodeRadius = 2;
      const nodeColumns = nodeRadius * 2 + 1;
      const columnDuration = 32;
      const nodeDuration = nodeColumns * columnDuration;
      const branchDuration = 220;
      const totalDuration = nodeDuration + branchDuration;
      // Match the reference's timing: nodes begin slightly ahead of the wire
      // head (62% versus 55% of the viewport), leaving time for the discrete
      // column fill before the trace has travelled toward the next project.
      const reached = dotRect.top < this.height * nodeActivationViewportRatio;
      const viewportY = centerRow * this.cell - this.currentY;
      let state = this.nodeStates.get(node);
      if (!state) {
        state = {
          progress: reached && viewportY < -this.cell * 6 ? 1 : 0,
          lastTime: now,
        };
        this.nodeStates.set(node, state);
      }

      const target = reached ? 1 : 0;
      const frameDelta = Math.min(64, Math.max(0, now - state.lastTime));
      state.lastTime = now;
      if (state.progress < target) {
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
      const endColumn = Math.max(startColumn, Math.floor(nodeRect.left / this.cell));
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

  buildPortrait() {
    if (!this.portraitHost) return null;
    const hostRect = this.portraitHost.getBoundingClientRect();
    if (!hostRect.width || !hostRect.height) return null;

    let portraitCell = this.cell;
    while (
      Math.floor(hostRect.width / portraitCell) < 150 &&
      portraitCell > 1.5
    ) {
      portraitCell /= 2;
    }
    const columns = Math.floor(hostRect.width / portraitCell);
    const rows = Math.round(columns * portraitData.rows / portraitData.cols);
    const sourceLength = portraitData.cols * portraitData.rows;
    const sourceLuminance = new Float32Array(sourceLength);
    const sourceMask = new Uint8Array(sourceLength);
    for (let index = 0; index < sourceLength; index += 1) {
      const encoded = Math.max(0, ALPHABET.indexOf(portraitData.data[index]));
      if (encoded > 0) {
        sourceMask[index] = 1;
        sourceLuminance[index] = (encoded - 1) / 62;
      }
    }

    const luminance = new Float32Array(columns * rows);
    const occupied = new Uint8Array(columns * rows);
    for (let row = 0; row < rows; row += 1) {
      const sourceTop = Math.floor((row * portraitData.rows) / rows);
      const sourceBottom = Math.max(
        Math.floor(((row + 1) * portraitData.rows) / rows),
        sourceTop + 1,
      );
      for (let column = 0; column < columns; column += 1) {
        const sourceLeft = Math.floor(
          (column * portraitData.cols) / columns,
        );
        const sourceRight = Math.max(
          Math.floor(((column + 1) * portraitData.cols) / columns),
          sourceLeft + 1,
        );
        let sum = 0;
        let hits = 0;
        let samples = 0;
        for (let sourceY = sourceTop; sourceY < sourceBottom; sourceY += 1) {
          for (
            let sourceX = sourceLeft;
            sourceX < sourceRight;
            sourceX += 1
          ) {
            const sourceIndex = sourceY * portraitData.cols + sourceX;
            samples += 1;
            if (sourceMask[sourceIndex]) {
              sum += sourceLuminance[sourceIndex];
              hits += 1;
            }
          }
        }
        const index = row * columns + column;
        occupied[index] = hits / samples >= 0.5 ? 1 : 0;
        luminance[index] = hits ? sum / hits : 0;
      }
    }

    const blurred = new Float32Array(luminance.length);
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        let total = 0;
        let count = 0;
        for (let dy = -2; dy <= 2; dy += 1) {
          for (let dx = -2; dx <= 2; dx += 1) {
            const x = column + dx;
            const y = row + dy;
            if (x < 0 || x >= columns || y < 0 || y >= rows) continue;
            total += luminance[y * columns + x];
            count += 1;
          }
        }
        blurred[row * columns + column] = total / count;
      }
    }

    const diffusion = new Float32Array(luminance.length);
    for (let index = 0; index < diffusion.length; index += 1) {
      const value =
        luminance[index] + 0.55 * (luminance[index] - blurred[index]);
      diffusion[index] = Math.max(
        0,
        Math.min(1, 0.5 + (value - portraitData.pivot) * 1.7),
      );
    }

    const levels = new Uint8Array(luminance.length);
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        if (!occupied[index]) continue;
        const value = Math.max(0, Math.min(1, diffusion[index]));
        const level = Math.max(1, Math.min(4, Math.round(value * 3) + 1));
        levels[index] = level;
        const quantized = (level - 1) / 3;
        const difference = value - quantized;
        const push = (dx, dy, factor) => {
          const x = column + dx;
          const y = row + dy;
          if (x >= 0 && x < columns && y >= 0 && y < rows) {
            const target = y * columns + x;
            if (occupied[target]) diffusion[target] += difference * factor;
          }
        };
        push(1, 0, 7 / 16);
        push(-1, 1, 3 / 16);
        push(0, 1, 5 / 16);
        push(1, 1, 1 / 16);
      }
    }

    const scale = this.dpr;
    const scaledCell = portraitCell * scale;
    const portraitGap =
      portraitCell >= 6 ? 2 : portraitCell >= 3 ? 1 : 0.5;
    const square = Math.max(1, (portraitCell - portraitGap) * scale);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(columns * scaledCell);
    canvas.height = Math.round(rows * scaledCell);
    const context = canvas.getContext("2d");
    if (!context) return null;

    for (let level = 1; level <= 4; level += 1) {
      context.fillStyle = this.ramp[level];
      context.beginPath();
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          if (levels[row * columns + column] !== level) continue;
          context.rect(
            Math.round(column * scaledCell),
            Math.round(row * scaledCell),
            square,
            square,
          );
        }
      }
      context.fill();
    }

    this.portraitHost.style.height = `${rows * portraitCell}px`;
    this.portraitHost.style.aspectRatio = "auto";

    return {
      canvas,
      columns,
      rows,
      levels,
      cell: portraitCell,
    };
  }

  drawPortrait() {
    if (!this.portraitHost) return;
    if (!this.portrait) this.portrait = this.buildPortrait();
    if (!this.portrait) return;
    const rect = this.portraitHost.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > this.height) return;
    const context = this.context;
    const scale = this.dpr;
    const portrait = this.portrait;

    context.save();
    context.globalAlpha = 0.22;
    context.drawImage(
      portrait.canvas,
      Math.round(rect.left * scale),
      Math.round(rect.top * scale),
    );
    context.restore();

    context.save();
    context.globalCompositeOperation = "lighter";
    context.globalAlpha = 0.4;
    for (const index of this.portraitLit) {
      const row = Math.floor(index / portrait.columns);
      const column = index % portrait.columns;
      const level = portrait.levels[index];
      if (!level) continue;
      const y = rect.top + row * portrait.cell;
      if (y > this.height || y + portrait.cell < 0) continue;
      const portraitGap =
        portrait.cell >= 6 ? 2 : portrait.cell >= 3 ? 1 : 0.5;
      context.fillStyle = this.ramp[level];
      context.fillRect(
        Math.round((rect.left + column * portrait.cell) * scale),
        Math.round(y * scale),
        Math.max(1, (portrait.cell - portraitGap) * scale),
        Math.max(1, (portrait.cell - portraitGap) * scale),
      );
    }
    context.restore();
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
        if (portrait.levels[index]) this.portraitLit.add(index);
      }
    }
  }

  updateChrome(now) {
    const maximum = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    if (this.progress) {
      this.progress.style.width = `${Math.min(100, (this.currentY / maximum) * 100)}%`;
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
