import assert from "node:assert/strict";
import test from "node:test";
import { PixelGridEngine } from "../src/modules/pixelGridEngine.js";
import { createPortrait } from "../src/modules/portraitRenderer.js";

function style() {
  return {
    setProperty(name, value) { this[name] = value; },
    removeProperty(name) { delete this[name]; },
    getPropertyValue(name) { return this[name] ?? ""; },
  };
}

function element(rect = { left: 0, top: 0, width: 390, height: 800 }) {
  const attributes = new Map();
  const classes = new Set();
  const node = {
    style: style(),
    dataset: {},
    children: [],
    offsetTop: rect.top,
    offsetLeft: rect.left,
    offsetHeight: rect.height,
    offsetWidth: rect.width,
    scrollHeight: rect.height,
    textContent: "",
    classList: {
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
      contains: (name) => classes.has(name),
    },
    getBoundingClientRect: () => ({
      ...rect,
      right: rect.left + rect.width,
      bottom: rect.top + rect.height,
    }),
    setAttribute: (name, value) => attributes.set(name, value),
    getAttribute: (name) => attributes.get(name) ?? null,
    hasAttribute: (name) => attributes.has(name),
    removeAttribute: (name) => attributes.delete(name),
    append(child) { child.parentElement = this; this.children.push(child); },
    appendChild(child) { this.append(child); return child; },
    remove() {
      if (this.parentElement) {
        const siblings = this.parentElement.children;
        siblings.splice(siblings.indexOf(this), 1);
        this.parentElement = null;
      }
    },
    querySelector: () => null,
    querySelectorAll: () => [],
  };
  return node;
}

function canvas(rect) {
  const node = element(rect);
  const noop = () => {};
  const context = {
    setTransform: noop, clearRect: noop, scale: noop, fillText: noop,
    strokeText: noop, beginPath: noop, rect: noop, fill: noop,
    drawImage: noop, fillRect: noop, save: noop, restore: noop,
    measureText: () => ({ fontBoundingBoxAscent: 16, fontBoundingBoxDescent: 4 }),
    getImageData: (_x, _y, width, height) => ({
      data: new Uint8ClampedArray(width * height * 4).fill(255),
    }),
  };
  node.getContext = () => context;
  return node;
}

function browser(t, { coarsePointer = false, reducedMotion = false, schedulerYield } = {}) {
  const viewport = { left: 0, top: 0, width: 390, height: 800 };
  const grid = canvas(viewport);
  const wrapper = element({ left: 0, top: 0, width: 390, height: 2400 });
  const progress = element();
  const root = element();
  root.scrollHeight = 2400;
  root.clientHeight = 800;
  const selectors = new Map([
    ["[data-grid]", grid], ["[data-smooth]", wrapper],
    ["[data-progress]", progress],
  ]);
  const collections = new Map();
  const document = Object.assign(new EventTarget(), {
    hidden: false,
    documentElement: root,
    body: element(),
    fonts: { ready: Promise.resolve() },
    querySelector: (selector) => selectors.get(selector) ?? null,
    querySelectorAll: (selector) => collections.get(selector) ?? [],
    createElement: (tag) => tag === "canvas" ? canvas() : element(),
  });
  const frames = new Map();
  let nextFrame = 0;
  const observers = [];
  class Observer {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
    unobserve() {}
    disconnect() { this.disconnected = true; }
  }
  const mediaQueries = new Map();
  const window = Object.assign(new EventTarget(), {
    innerWidth: 390,
    innerHeight: 800,
    devicePixelRatio: 2,
    scrollY: 0,
    ResizeObserver: Observer,
    IntersectionObserver: Observer,
    matchMedia(query) {
      if (!mediaQueries.has(query)) {
        mediaQueries.set(query, Object.assign(new EventTarget(), {
          matches: query.includes("prefers-reduced-motion") ? reducedMotion : coarsePointer,
        }));
      }
      return mediaQueries.get(query);
    },
  });
  const replacements = {
    window, document,
    ResizeObserver: Observer,
    IntersectionObserver: Observer,
    requestAnimationFrame: (callback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
    getComputedStyle: () => ({
      fontSize: "20px", lineHeight: "24px", fontStyle: "normal",
      fontWeight: "400", fontFamily: "sans-serif", letterSpacing: "0px",
      paddingLeft: "0px", paddingTop: "0px", textAlign: "left",
      position: "static",
    }),
  };
  if (schedulerYield) replacements.scheduler = { yield: schedulerYield };
  const originals = new Map();
  const engines = [];
  for (const [key, value] of Object.entries(replacements)) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, key);
    originals.set(key, previous);
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  t.after(() => {
    try {
      for (const engine of engines) engine.destroy();
    } finally {
      for (const [key, previous] of originals) {
        if (previous) Object.defineProperty(globalThis, key, previous);
        else delete globalThis[key];
      }
    }
  });
  return { window, document, viewport, grid, wrapper, progress, root,
    selectors, collections, frames, observers,
    createEngine(config) {
      const engine = new PixelGridEngine(config);
      engines.push(engine);
      return engine;
    },
    runFrame(time) {
      const [id, callback] = frames.entries().next().value ?? [];
      assert.ok(callback, "an animation frame should be scheduled");
      frames.delete(id);
      callback(time);
    },
  };
}

function revealingTarget(overrides = {}) {
  return {
    element: element(), canvas: canvas(), x: 0, y: 0, width: 120,
    maxColumn: 20, reveal: true, startedAt: 100, complete: false,
    visibleWidth: 0, ...overrides,
  };
}

test("a reveal that scrolls out of view finishes and releases the animation loop", () => {
  const engine = new PixelGridEngine();
  engine.height = 800;
  engine.cell = 6;
  engine.currentY = 3000;
  const target = revealingTarget();
  engine.textTargets = [target];

  assert.equal(engine.needsAnotherFrame(200, 3000), true);
  engine.updateTextReveals(1000);

  assert.equal(target.complete, true);
  assert.equal(target.visibleWidth, target.width);
  assert.equal(engine.needsAnotherFrame(1000, 3000), false);
});

test("headings below the viewport do not start or keep requesting frames", () => {
  const engine = new PixelGridEngine();
  engine.height = 800;
  engine.cell = 6;
  engine.currentY = 0;
  const target = revealingTarget({ y: 3000, startedAt: 0 });
  engine.textTargets = [target];

  engine.updateTextReveals(1000);

  assert.equal(target.startedAt, 0);
  assert.equal(target.visibleWidth, 0);
  assert.equal(engine.needsAnotherFrame(1000, 0), false);
});

for (const coarsePointer of [true, false]) {
  test(`${coarsePointer ? "touch" : "mouse"} devices keep page content attached to native scrolling`, async (t) => {
    const environment = browser(t, { coarsePointer });
    const engine = environment.createEngine();
    engine.mount();
    await Promise.resolve();

    environment.window.scrollY = 640;
    environment.runFrame(1000);

    assert.equal(engine.smooth, false);
    assert.equal(engine.currentY, 640);
    assert.equal(environment.wrapper.style.transform, "none");
  });
}

test("reduced motion displays pixel headings fully without a type-in animation", async (t) => {
  const environment = browser(t, { reducedMotion: true });
  const heading = element({ left: 0, top: 0, width: 120, height: 24 });
  heading.textContent = "HELLO";
  heading.setAttribute("data-cell-reveal", "");
  environment.collections.set("[data-cell]", [heading]);
  const engine = environment.createEngine();
  engine.mount();
  await Promise.resolve();
  const target = engine.textTargets[0];

  assert.ok(target);
  assert.equal(target.complete, true);
  assert.equal(target.visibleWidth, target.width);
});

test("live reduced-motion changes reveal content, clear pointer effects and clean up listeners", async (t) => {
  const environment = browser(t);
  const heading = element({ left: 0, top: 3000, width: 120, height: 24 });
  heading.textContent = "HELLO";
  heading.setAttribute("data-cell-reveal", "");
  const block = element({ left: 0, top: 3000, width: 390, height: 100 });
  environment.collections.set("[data-cell]", [heading]);
  environment.collections.set("[data-reveal]", [block]);
  const engine = environment.createEngine();
  engine.mount();
  await Promise.resolve();
  const target = engine.textTargets[0];
  const revealObserver = engine.revealObserver;
  assert.equal(target.complete, false);
  assert.equal(block.style.opacity, "0");
  engine.pointer = { x: 10, y: 20 };
  engine.heat.set("1,1", { time: 1000, level: 2 });
  engine.hoverElement = element();
  engine.hoverHistory.set(engine.hoverElement, 1000);

  const preference = environment.window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.matches = true;
  preference.dispatchEvent(new Event("change"));
  environment.runFrame(1000);

  assert.equal(engine.reducedMotion, true);
  assert.equal(target.complete, true);
  assert.equal(target.visibleWidth, target.width);
  assert.equal(target.canvas.style.clipPath, "none");
  assert.equal(block.style.opacity, "1");
  assert.equal(block.style.transition, "none");
  assert.equal(revealObserver.disconnected, true);
  assert.equal(engine.pointer, null);
  assert.equal(engine.heat.size, 0);
  assert.equal(engine.hoverHistory.size, 0);
  assert.equal(engine.needsAnotherFrame(1000, 0), false);

  preference.matches = false;
  preference.dispatchEvent(new Event("change"));
  environment.runFrame(1100);
  assert.equal(target.complete, true, "restoring motion must not hide finished content");
  assert.equal(block.style.opacity, "1");

  engine.destroy();
  preference.matches = true;
  preference.dispatchEvent(new Event("change"));
  assert.equal(engine.reducedMotion, false, "destroy must detach media preference listeners");
});

test("progress reaches the end using the same CSS scale property as its initial state", (t) => {
  const environment = browser(t);
  const engine = new PixelGridEngine();
  engine.progress = environment.progress;
  engine.progress.style.scale = "0 1";
  engine.currentY = 1600;
  engine.scrollMaximum = 1600;

  engine.updateChrome(1000);

  assert.equal(engine.progress.style.scale, "1 1");
});

test("progress uses normal-flow content height despite inflated document overflow", (t) => {
  const environment = browser(t);
  const engine = new PixelGridEngine();
  engine.wrapper = environment.wrapper;
  environment.wrapper.offsetHeight = 5000;
  environment.root.scrollHeight = 5500;

  engine.updateScrollMaximum();

  assert.equal(engine.scrollMaximum, 4200);
});

test("mobile browser chrome height changes retain existing text and portrait rasters", async (t) => {
  const environment = browser(t, { coarsePointer: true });
  const engine = environment.createEngine();
  engine.mount();
  await Promise.resolve();
  const target = revealingTarget({ complete: true, visibleWidth: 120 });
  const portrait = { canvas: canvas() };
  engine.textTargets = [target];
  engine.portrait = portrait;
  environment.viewport.height = 700;
  environment.window.innerHeight = 700;

  engine.resize();

  assert.equal(engine.height, 700);
  assert.equal(engine.width, 390);
  assert.equal(engine.textTargets[0], target);
  assert.equal(engine.portrait, portrait);
});

test("a width change invalidates rasters so wrapping and portrait resolution can update", async (t) => {
  const environment = browser(t, { coarsePointer: true });
  const engine = environment.createEngine();
  engine.mount();
  await Promise.resolve();
  const oldTarget = revealingTarget({ complete: true, visibleWidth: 120 });
  const oldPortrait = { canvas: canvas() };
  engine.textTargets = [oldTarget];
  engine.portrait = oldPortrait;
  environment.viewport.width = 430;
  environment.window.innerWidth = 430;

  engine.resize();

  assert.equal(engine.width, 430);
  assert.equal(engine.height, 800);
  assert.equal(engine.textTargets.includes(oldTarget), false);
  assert.equal(engine.portrait, null);
});

test("the pointer overlay saves mobile memory and restores its resolution for a fine pointer", async (t) => {
  const environment = browser(t, { coarsePointer: true });
  const heading = element({ left: 0, top: 0, width: 120, height: 24 });
  heading.textContent = "HELLO";
  environment.collections.set("[data-cell]", [heading]);
  const engine = environment.createEngine();
  engine.mount();
  await Promise.resolve();
  const target = engine.textTargets[0];
  const textSize = [target.canvas.width, target.canvas.height];
  const portrait = { canvas: canvas() };
  engine.portrait = portrait;
  assert.deepEqual([engine.width, engine.height], [390, 800]);
  assert.deepEqual([engine.canvas.width, engine.canvas.height], [1, 1]);

  const preference = environment.window.matchMedia("(hover: none), (pointer: coarse)");
  preference.matches = false;
  preference.dispatchEvent(new Event("change"));
  environment.runFrame(1000);

  assert.deepEqual([engine.canvas.width, engine.canvas.height], [780, 1600]);
  assert.equal(engine.textTargets[0], target);
  assert.deepEqual([target.canvas.width, target.canvas.height], textSize);
  assert.equal(engine.portrait, portrait);

  preference.matches = true;
  preference.dispatchEvent(new Event("change"));
  environment.runFrame(1100);

  assert.deepEqual([engine.canvas.width, engine.canvas.height], [1, 1]);
  assert.equal(engine.textTargets[0], target);
  assert.equal(engine.portrait, portrait);
});

test("destroy cancels frames, disconnects observers and removes attached text canvases", async (t) => {
  const environment = browser(t, { coarsePointer: true });
  const heading = element({ left: 0, top: 0, width: 120, height: 24 });
  heading.textContent = "HELLO";
  environment.collections.set("[data-cell]", [heading]);
  const engine = environment.createEngine();
  engine.mount();
  await Promise.resolve();
  const attachedCanvas = engine.textTargets[0]?.canvas;

  assert.ok(attachedCanvas);
  assert.equal(attachedCanvas.parentElement, heading);
  assert.ok(environment.frames.size > 0);
  engine.destroy();

  assert.equal(environment.frames.size, 0);
  assert.ok(environment.observers.length > 0);
  assert.ok(environment.observers.every((observer) => observer.disconnected));
  assert.equal(engine.abortController.signal.aborted, true);
  assert.equal(engine.textTargets.length, 0);
  assert.equal(heading.children.includes(attachedCanvas), false);
  assert.equal(environment.root.classList.contains("pixel-grid-ready"), false);
});

test("portrait construction yields before raster work and honors cancellation while waiting", async (t) => {
  let release;
  const environment = browser(t, {
    schedulerYield: () => new Promise((resolve) => { release = resolve; }),
  });
  let allocations = 0;
  const createElement = environment.document.createElement;
  environment.document.createElement = (tag) => {
    allocations += 1;
    return createElement(tag);
  };
  const controller = new AbortController();
  const pending = createPortrait({
    portraitData: { cols: 4, rows: 4, pivot: 0.5, data: "A".repeat(16) },
    width: 12, cell: 2, dpr: 1,
    ramp: ["#000", "#111", "#222", "#333", "#444"],
    signal: controller.signal,
  });

  assert.equal(typeof release, "function");
  assert.equal(allocations, 0);
  controller.abort();
  release();

  await assert.rejects(pending, { name: "AbortError" });
  assert.equal(allocations, 0);
});
