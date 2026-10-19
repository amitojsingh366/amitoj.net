const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
const WORK_BUDGET_MS = 3;
const PAINT_ROWS_PER_BATCH = 4;
const decodedSources = new WeakMap();

function checkAbort(signal) {
  if (signal?.aborted) {
    throw new DOMException("Portrait rendering was cancelled", "AbortError");
  }
}

async function yieldToMain(signal) {
  checkAbort(signal);
  if (globalThis.scheduler?.yield) {
    await globalThis.scheduler.yield();
  } else {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  checkAbort(signal);
}

/**
 * Builds an unattached portrait in short tasks. The caller owns cancellation,
 * mounting the completed canvas, and reserving its space in the document.
 */
export async function createPortrait({
  portraitData,
  width,
  cell,
  dpr,
  ramp,
  signal,
}) {
  // Even the first batch must start outside the animation callback that asked
  // for the portrait, so approaching the contact section never blocks a frame.
  await yieldToMain(signal);
  let deadline = performance.now() + WORK_BUDGET_MS;
  const needsYield = () => {
    checkAbort(signal);
    return performance.now() >= deadline;
  };
  const resume = async () => {
    await yieldToMain(signal);
    deadline = performance.now() + WORK_BUDGET_MS;
  };

  let portraitCell = cell;
  while (Math.floor(width / portraitCell) < 150 && portraitCell > 1.5) {
    portraitCell /= 2;
  }
  const columns = Math.floor(width / portraitCell);
  const rows = Math.round(columns * portraitData.rows / portraitData.cols);
  if (columns <= 0 || rows <= 0) return null;

  let source = decodedSources.get(portraitData);
  if (!source) {
    const length = portraitData.cols * portraitData.rows;
    source = {
      luminance: new Float32Array(length),
      mask: new Uint8Array(length),
      nextRow: 0,
    };
    decodedSources.set(portraitData, source);
  }
  // Completed rows survive cancellation and resizing. Concurrent builds also
  // share progress: each row is committed before another task can resume.
  while (source.nextRow < portraitData.rows) {
    const start = source.nextRow * portraitData.cols;
    const end = start + portraitData.cols;
    for (let index = start; index < end; index += 1) {
      const encoded = Math.max(0, ALPHABET.indexOf(portraitData.data[index]));
      if (encoded > 0) {
        source.mask[index] = 1;
        source.luminance[index] = (encoded - 1) / 62;
      }
    }
    source.nextRow += 1;
    if (needsYield()) await resume();
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
      const sourceLeft = Math.floor((column * portraitData.cols) / columns);
      const sourceRight = Math.max(
        Math.floor(((column + 1) * portraitData.cols) / columns),
        sourceLeft + 1,
      );
      let sum = 0;
      let hits = 0;
      let samples = 0;
      for (let sourceY = sourceTop; sourceY < sourceBottom; sourceY += 1) {
        for (let sourceX = sourceLeft; sourceX < sourceRight; sourceX += 1) {
          const sourceIndex = sourceY * portraitData.cols + sourceX;
          samples += 1;
          if (source.mask[sourceIndex]) {
            sum += source.luminance[sourceIndex];
            hits += 1;
          }
        }
      }
      const index = row * columns + column;
      occupied[index] = hits / samples >= 0.5 ? 1 : 0;
      luminance[index] = hits ? sum / hits : 0;
    }
    if (needsYield()) await resume();
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
    if (needsYield()) await resume();
  }

  const diffusion = new Float32Array(luminance.length);
  for (let row = 0; row < rows; row += 1) {
    const end = (row + 1) * columns;
    for (let index = row * columns; index < end; index += 1) {
      const value = luminance[index] + 0.55 * (luminance[index] - blurred[index]);
      diffusion[index] = Math.max(
        0,
        Math.min(1, 0.5 + (value - portraitData.pivot) * 1.7),
      );
    }
    if (needsYield()) await resume();
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
    if (needsYield()) await resume();
  }

  const scaledCell = portraitCell * dpr;
  const portraitGap = portraitCell >= 6 ? 2 : portraitCell >= 3 ? 1 : 0.5;
  const square = Math.max(1, (portraitCell - portraitGap) * dpr);
  const canvas = document.createElement("canvas");
  canvas.className = "pixel-portrait-cache";
  canvas.setAttribute("aria-hidden", "true");
  canvas.width = Math.round(columns * scaledCell);
  canvas.height = Math.round(rows * scaledCell);
  canvas.style.width = `${columns * portraitCell}px`;
  canvas.style.height = `${rows * portraitCell}px`;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.globalAlpha = 0.22;
  for (let level = 1; level <= 4; level += 1) {
    context.fillStyle = ramp[level];
    for (let startRow = 0; startRow < rows; startRow += PAINT_ROWS_PER_BATCH) {
      context.beginPath();
      const endRow = Math.min(rows, startRow + PAINT_ROWS_PER_BATCH);
      for (let row = startRow; row < endRow; row += 1) {
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
      // Flush small paths too; yielding while collecting one enormous path
      // would still leave a single expensive canvas fill at the end.
      context.fill();
      if (needsYield()) await resume();
    }
  }
  context.globalAlpha = 1;
  checkAbort(signal);

  return { canvas, context, columns, rows, levels, cell: portraitCell };
}
