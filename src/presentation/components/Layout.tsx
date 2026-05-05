import { raw } from "hono/html";
import type { Child } from "hono/jsx";
import type { SiteConfig } from "../../config/site.config";
import { createMetadata, type PageMetadata } from "../../seo/metadata";
import { createOpenGraphMetadata } from "../../seo/openGraph";
import { withBasePath } from "../../shared/path";
import { Footer } from "./Footer";
import { Header } from "./Header";

type LayoutProps = {
  children: Child;
  description?: string;
  metadata?: PageMetadata;
  siteConfig: SiteConfig;
  structuredData?: unknown;
  title?: string;
};

export const Layout = ({
  children,
  description,
  metadata,
  siteConfig,
  structuredData,
  title,
}: LayoutProps) => {
  const pageMetadata =
    metadata ??
    createMetadata(siteConfig, {
      description,
      path: "/",
      title,
    });
  const openGraph = createOpenGraphMetadata(siteConfig, pageMetadata);
  const socialMetaTags = createSocialMetaTags(openGraph);
  const jsonLd = structuredData
    ? JSON.stringify(structuredData).replaceAll("<", "\\u003c")
    : undefined;
  const themeScript = `(() => {
  const storedTheme = localStorage.getItem("theme");
  const preference = storedTheme === "light" || storedTheme === "dark" ? storedTheme : "system";
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  const resolveTheme = () => preference === "system" && query.matches ? "dark" : preference === "system" ? "light" : preference;
  document.documentElement.dataset.theme = resolveTheme();
})();`;
  const themeToggleScript = `(() => {
  const button = document.querySelector("[data-theme-toggle]");
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  const getStoredTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "light" || storedTheme === "dark" ? storedTheme : "system";
  };
  const resolveTheme = (preference) => preference === "system" && query.matches ? "dark" : preference === "system" ? "light" : preference;
  const applyTheme = (preference) => {
    const theme = resolveTheme(preference);
    document.documentElement.dataset.theme = theme;
    if (button) {
      button.textContent = theme === "dark" ? "Light" : "Dark";
      button.setAttribute("aria-pressed", String(theme === "dark"));
    }
  };
  button?.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  });
  query.addEventListener("change", () => applyTheme(getStoredTheme()));
  applyTheme(getStoredTheme());
})();`;
  const ambientFieldScript = `(() => {
  const FLOW_FIELD_SEED = 0x6c7a31;
  const VISUAL_GRID_SIZE = 8;
  const FLOW_FIELD_FADE = 0.985;
  const CANVAS_TRAIL_ALPHA = 0.22;
  const ALPHA_BUCKET_COUNT = 8;
  const AMBIENT_DENSITY_MIN = 0.018;
  const AMBIENT_DENSITY_MAX = 0.14;
  const FLOW_NODE_COUNT_RANGE = { min: 2, max: 3 };
  const VORTEX_RADIUS_RANGE = { min: 18, max: 34 };
  const EMITTER_SPREAD_RANGE = { min: 180, max: 320 };
  const INTERACTION_RIPPLE_DURATION = 1800;
  const INTERACTION_RIPPLE_RADIUS = 34;
  const INTERACTION_RIPPLE_WIDTH = 8;
  const INTERACTION_RIPPLE_STRENGTH = 0.24;
  const INTERACTION_RIPPLE_MAX_COUNT = 5;
  const QUALITY_PROFILES = {
    high: { dprCap: 2, fps: 30, gridSize: VISUAL_GRID_SIZE, name: "high" },
    balanced: { dprCap: 1, fps: 24, gridSize: VISUAL_GRID_SIZE, name: "balanced" },
    low: { dprCap: 1, fps: 18, gridSize: VISUAL_GRID_SIZE + 2, name: "low" }
  };
  const canvas = document.querySelector("[data-ambient-field]");
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }

  const context = createCanvasContext(canvas);
  if (!context) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const state = {
    columnDriftY: new Float32Array(0),
    densityField: new Float32Array(0),
    dotPositionsX: new Uint16Array(0),
    dotPositionsY: new Uint16Array(0),
    dpr: 1,
    dprCap: QUALITY_PROFILES.high.dprCap,
    fieldColumns: 0,
    fieldRows: 0,
    flowFieldConfig: null,
    frameInterval: 1000 / QUALITY_PROFILES.high.fps,
    frameNodes: { emitters: [], vortices: [] },
    height: 0,
    interactionRipples: [],
    lastFrame: 0,
    nextDensityField: new Float32Array(0),
    paletteRgb: {
      bg: [244, 244, 241],
      noise: [13, 13, 15]
    },
    rafId: 0,
    resizeRafId: 0,
    rowDriftX: new Float32Array(0),
    running: false,
    width: 0
  };

  function createCanvasContext(canvasElement) {
    try {
      const alphaContext = canvasElement.getContext("2d", { alpha: true });
      if (alphaContext) {
        return alphaContext;
      }
    } catch (error) {
      // Fall through for browsers that reject context attributes.
    }

    try {
      return canvasElement.getContext("2d");
    } catch (error) {
      return null;
    }
  }

  const parseRgbTriplet = (value) => value
    .trim()
    .split(/\\s+/)
    .slice(0, 3)
    .map((channel) => Number(channel));

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const lerp = (start, end, amount) => start + (end - start) * amount;
  const smoothstep = (edge0, edge1, value) => {
    const normalized = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return normalized * normalized * (3 - 2 * normalized);
  };
  const fieldIndex = (x, y) => y * state.fieldColumns + x;
  const formatCanvasRgba = (rgb, alpha) => {
    const [red, green, blue] = rgb.map((channel) => Math.round(clamp(channel, 0, 255)));
    return \`rgba(\${red}, \${green}, \${blue}, \${clamp(alpha, 0, 1)})\`;
  };
  const createSeededRandom = (seed) => {
    let value = Number.isFinite(seed) ? seed >>> 0 : 0;
    return () => {
      value = (value + 0x6d2b79f5) >>> 0;
      let mixed = value;
      mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
      mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
      return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
    };
  };
  const randomBetween = (min, max, randomValue) => lerp(min, max, randomValue());
  const randomIntBetween = (min, max, randomValue) => Math.floor(randomBetween(min, max + 1, randomValue));

  const readPalette = () => {
    const styles = getComputedStyle(document.documentElement);
    const bg = parseRgbTriplet(styles.getPropertyValue("--bg-rgb"));
    const noise = parseRgbTriplet(
      styles.getPropertyValue("--noise-rgb") ||
        styles.getPropertyValue("--dot-rgb") ||
        styles.getPropertyValue("--fg-rgb")
    );
    if (bg.every(Number.isFinite)) {
      state.paletteRgb.bg = bg;
    }
    if (noise.every(Number.isFinite)) {
      state.paletteRgb.noise = noise;
    }
  };

  function createFlowNodes(count, buildNode) {
    const nodes = [];
    for (let index = 0; index < count; index += 1) {
      nodes.push(buildNode(index, count));
    }
    return nodes;
  }

  function createFlowFieldConfig(randomValue = Math.random) {
    const vortexCount = randomIntBetween(FLOW_NODE_COUNT_RANGE.min, FLOW_NODE_COUNT_RANGE.max, randomValue);
    const emitterCount = randomIntBetween(FLOW_NODE_COUNT_RANGE.min, FLOW_NODE_COUNT_RANGE.max, randomValue);

    return {
      vortices: createFlowNodes(vortexCount, (index, count) => {
        const anchorX = clamp(lerp(0.2, 0.8, (index + 1) / (count + 1)) + randomBetween(-0.08, 0.08, randomValue), 0.12, 0.88);
        return {
          anchorX,
          anchorY: randomBetween(0.24, 0.76, randomValue),
          orbitAmplitudeX: randomBetween(0.05, 0.14, randomValue),
          orbitAmplitudeY: randomBetween(0.05, 0.16, randomValue),
          orbitSpeedX: randomBetween(0.65, 1.25, randomValue),
          orbitSpeedY: randomBetween(0.7, 1.35, randomValue),
          phaseX: randomBetween(0, Math.PI * 2, randomValue),
          phaseY: randomBetween(0, Math.PI * 2, randomValue),
          radius: randomBetween(VORTEX_RADIUS_RANGE.min, VORTEX_RADIUS_RANGE.max, randomValue),
          strength: (index % 2 === 0 ? 1 : -1) * randomBetween(1.8, 2.8, randomValue)
        };
      }),
      emitters: createFlowNodes(emitterCount, (index, count) => {
        const anchorX = clamp(lerp(0.22, 0.78, (index + 1) / (count + 1)) + randomBetween(-0.1, 0.1, randomValue), 0.1, 0.9);
        return {
          anchorX,
          anchorY: randomBetween(0.28, 0.72, randomValue),
          orbitAmplitudeX: randomBetween(0.05, 0.16, randomValue),
          orbitAmplitudeY: randomBetween(0.05, 0.16, randomValue),
          orbitSpeedX: randomBetween(0.7, 1.3, randomValue),
          orbitSpeedY: randomBetween(0.7, 1.3, randomValue),
          phaseX: randomBetween(0, Math.PI * 2, randomValue),
          phaseY: randomBetween(0, Math.PI * 2, randomValue),
          spread: randomBetween(EMITTER_SPREAD_RANGE.min, EMITTER_SPREAD_RANGE.max, randomValue),
          intensity: randomBetween(0.052, 0.084, randomValue)
        };
      })
    };
  }

  function createStableFlowFieldConfig(seed = FLOW_FIELD_SEED) {
    return createFlowFieldConfig(createSeededRandom(seed));
  }

  function sampleDensityField(field, columns, rows, x, y) {
    if (!field || columns <= 0 || rows <= 0 || field.length < columns * rows) {
      return 0;
    }

    const maxX = columns - 1;
    const maxY = rows - 1;
    const sampleX = clamp(x, 0, maxX);
    const sampleY = clamp(y, 0, maxY);
    const x0 = Math.floor(sampleX);
    const y0 = Math.floor(sampleY);
    const x1 = Math.min(x0 + 1, maxX);
    const y1 = Math.min(y0 + 1, maxY);
    const tx = sampleX - x0;
    const ty = sampleY - y0;
    const top = lerp(field[y0 * columns + x0], field[y0 * columns + x1], tx);
    const bottom = lerp(field[y1 * columns + x0], field[y1 * columns + x1], tx);
    return lerp(top, bottom, ty);
  }

  function resizeDensityField(previousField, previousColumns, previousRows, nextColumns, nextRows) {
    const nextField = new Float32Array(nextColumns * nextRows);
    if (!previousField || previousColumns <= 0 || previousRows <= 0 || nextColumns <= 0 || nextRows <= 0) {
      return nextField;
    }

    const scaleX = nextColumns > 1 ? (previousColumns - 1) / (nextColumns - 1) : 0;
    const scaleY = nextRows > 1 ? (previousRows - 1) / (nextRows - 1) : 0;
    for (let row = 0; row < nextRows; row += 1) {
      for (let column = 0; column < nextColumns; column += 1) {
        nextField[row * nextColumns + column] = sampleDensityField(
          previousField,
          previousColumns,
          previousRows,
          column * scaleX,
          row * scaleY
        );
      }
    }
    return nextField;
  }

  function seedAmbientDensityField() {
    const size = state.fieldColumns * state.fieldRows;
    state.densityField = new Float32Array(size);
    state.nextDensityField = new Float32Array(size);

    for (let y = 0; y < state.fieldRows; y += 1) {
      for (let x = 0; x < state.fieldColumns; x += 1) {
        const rawNoise = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        const noise = rawNoise - Math.floor(rawNoise);
        const sparseDot = smoothstep(0.82, 1, noise);
        const softVariation = (Math.sin(x * 0.37) + Math.cos(y * 0.41)) * 0.004;
        const density = AMBIENT_DENSITY_MIN + softVariation + sparseDot * (AMBIENT_DENSITY_MAX - AMBIENT_DENSITY_MIN);
        state.densityField[fieldIndex(x, y)] = clamp(density, 0, AMBIENT_DENSITY_MAX);
      }
    }
  }

  function initializeGridGeometry() {
    const size = state.fieldColumns * state.fieldRows;
    const offset = state.gridSize * 0.5;
    state.dotPositionsX = new Uint16Array(size);
    state.dotPositionsY = new Uint16Array(size);
    state.rowDriftX = new Float32Array(state.fieldRows);
    state.columnDriftY = new Float32Array(state.fieldColumns);

    for (let row = 0; row < state.fieldRows; row += 1) {
      for (let column = 0; column < state.fieldColumns; column += 1) {
        const index = fieldIndex(column, row);
        state.dotPositionsX[index] = Math.round(column * state.gridSize + offset);
        state.dotPositionsY[index] = Math.round(row * state.gridSize + offset);
      }
    }
  }

  function populateDriftTables(time) {
    for (let row = 0; row < state.fieldRows; row += 1) {
      state.rowDriftX[row] = Math.sin(time * 0.00018 + row * 0.08) * 0.35;
    }
    for (let column = 0; column < state.fieldColumns; column += 1) {
      state.columnDriftY[column] = Math.cos(time * 0.00016 + column * 0.07) * 0.3;
    }
  }

  function resolveOrbitPosition(node, orbit, width, height) {
    return {
      x: width * (node.anchorX + Math.cos(orbit * node.orbitSpeedX + node.phaseX) * node.orbitAmplitudeX),
      y: height * (node.anchorY + Math.sin(orbit * node.orbitSpeedY + node.phaseY) * node.orbitAmplitudeY)
    };
  }

  function resolveFrameNodes(time) {
    const vortexOrbit = time * 0.00022;
    const emitterOrbit = time * 0.00028;

    return {
      vortices: state.flowFieldConfig.vortices.map((vortex) => {
        const center = resolveOrbitPosition(vortex, vortexOrbit, state.fieldColumns, state.fieldRows);
        const radiusSquared = vortex.radius * vortex.radius;
        return {
          x: center.x,
          y: center.y,
          radiusSquared,
          inverseRadiusSquared: 1 / radiusSquared,
          cutoffDistanceSquared: radiusSquared * 9,
          strength: vortex.strength
        };
      }),
      emitters: state.flowFieldConfig.emitters.map((emitter) => {
        const center = resolveOrbitPosition(emitter, emitterOrbit, state.fieldColumns, state.fieldRows);
        const inverseSpread = 1 / emitter.spread;
        return {
          x: center.x,
          y: center.y,
          inverseSpread,
          cutoffDistanceSquared: 9 / inverseSpread,
          intensity: emitter.intensity
        };
      })
    };
  }

  function pruneExpiredInteractionRipples(time) {
    if (!Array.isArray(state.interactionRipples) || state.interactionRipples.length === 0) {
      return [];
    }

    const activeRipples = state.interactionRipples.filter((ripple) => {
      const age = time - ripple.startTime;
      return Number.isFinite(age) && age >= 0 && age <= INTERACTION_RIPPLE_DURATION;
    });
    if (activeRipples.length !== state.interactionRipples.length) {
      state.interactionRipples = activeRipples;
    }
    return state.interactionRipples;
  }

  function queueInteractionRipple(clientX, clientY, time = performance.now()) {
    if (state.fieldColumns <= 0 || state.fieldRows <= 0 || state.gridSize <= 0 || !Number.isFinite(clientX) || !Number.isFinite(clientY)) {
      return false;
    }

    state.interactionRipples.push({
      x: clamp(clientX / state.gridSize, 0, state.fieldColumns - 1),
      y: clamp(clientY / state.gridSize, 0, state.fieldRows - 1),
      startTime: Number.isFinite(time) ? time : performance.now()
    });

    if (state.interactionRipples.length > INTERACTION_RIPPLE_MAX_COUNT) {
      state.interactionRipples.splice(0, state.interactionRipples.length - INTERACTION_RIPPLE_MAX_COUNT);
    }
    return true;
  }

  function interactionDensityAt(x, y, time, ripples) {
    let density = 0;
    for (const ripple of ripples) {
      const age = time - ripple.startTime;
      if (!Number.isFinite(age) || age < 0 || age > INTERACTION_RIPPLE_DURATION) {
        continue;
      }

      const progress = age / INTERACTION_RIPPLE_DURATION;
      const waveRadius = progress * INTERACTION_RIPPLE_RADIUS;
      const distance = Math.hypot(x - ripple.x, y - ripple.y);
      const crest = 1 - smoothstep(0, INTERACTION_RIPPLE_WIDTH, Math.abs(distance - waveRadius));
      const fadeOut = 1 - smoothstep(0.72, 1, progress);
      density = Math.max(density, crest * fadeOut * INTERACTION_RIPPLE_STRENGTH);
    }
    return density;
  }

  function stepFluidField(time, dt, frameNodes) {
    const scaledDt = Math.min(dt, 0.033) * 60;
    const columns = state.fieldColumns;
    const rows = state.fieldRows;
    const currentField = state.densityField;
    const nextField = state.nextDensityField;
    const maxX = columns - 1;
    const maxY = rows - 1;
    const ripples = pruneExpiredInteractionRipples(time);

    populateDriftTables(time);

    for (let y = 0; y < rows; y += 1) {
      const rowOffset = y * columns;
      const upOffset = (y === 0 ? 0 : y - 1) * columns;
      const downOffset = (y === rows - 1 ? rows - 1 : y + 1) * columns;
      const baseVx = state.rowDriftX[y];

      for (let x = 0; x < columns; x += 1) {
        const idx = rowOffset + x;
        let totalVx = baseVx;
        let totalVy = state.columnDriftY[x];

        for (const vortex of frameNodes.vortices) {
          const dx = x - vortex.x;
          const dy = y - vortex.y;
          const distanceSquared = dx * dx + dy * dy + 0.0001;
          if (distanceSquared > vortex.cutoffDistanceSquared) {
            continue;
          }

          const influence = vortex.strength * Math.exp(-(distanceSquared * vortex.inverseRadiusSquared)) / Math.sqrt(distanceSquared);
          totalVx += -dy * influence;
          totalVy += dx * influence;
        }

        const sourceX = clamp(x - totalVx * scaledDt, 0, maxX);
        const sourceY = clamp(y - totalVy * scaledDt, 0, maxY);
        const advected = sampleDensityField(currentField, columns, rows, sourceX, sourceY);
        const left = currentField[rowOffset + (x === 0 ? 0 : x - 1)];
        const right = currentField[rowOffset + (x === maxX ? maxX : x + 1)];
        const up = currentField[upOffset + x];
        const down = currentField[downOffset + x];
        const neighborhood = (left + right + up + down) * 0.25;
        let injected = 0;

        for (const emitter of frameNodes.emitters) {
          const dx = x - emitter.x;
          const dy = y - emitter.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared <= emitter.cutoffDistanceSquared) {
            injected = Math.max(injected, Math.exp(-(distanceSquared * emitter.inverseSpread)) * emitter.intensity);
          }
        }

        injected = Math.max(injected, interactionDensityAt(x, y, time, ripples));
        nextField[idx] = clamp((advected * 0.82 + neighborhood * 0.14 + injected) * FLOW_FIELD_FADE, 0, 1);
      }
    }

    state.densityField = nextField;
    state.nextDensityField = currentField;
  }

  function drawGridBackdrop() {
    const maxAlpha = document.documentElement.dataset.theme === "dark" ? 0.46 : 0.34;
    let currentBucket = 0;
    let drawnDots = 0;
    context.fillStyle = formatCanvasRgba(state.paletteRgb.noise, maxAlpha);

    for (let index = 0; index < state.densityField.length; index += 1) {
      const fillAlpha = smoothstep(0.08, 0.92, state.densityField[index]) * maxAlpha;
      if (fillAlpha <= 0.004) {
        continue;
      }

      const alphaBucket = Math.ceil((fillAlpha / maxAlpha) * ALPHA_BUCKET_COUNT);
      if (alphaBucket !== currentBucket) {
        context.globalAlpha = (alphaBucket / ALPHA_BUCKET_COUNT) * maxAlpha;
        currentBucket = alphaBucket;
      }

      context.fillRect(state.dotPositionsX[index], state.dotPositionsY[index], 1, 1);
      drawnDots += 1;
    }

    context.globalAlpha = 1;
    return drawnDots;
  }

  function drawStaticBackdrop() {
    readPalette();
    context.clearRect(0, 0, state.width, state.height);
    drawGridBackdrop();
  }

  function resolveCanvasDpr(rawDpr, cap) {
    const nextRawDpr = Number.isFinite(rawDpr) && rawDpr > 0 ? rawDpr : 1;
    const nextCap = Number.isFinite(cap) && cap > 0 ? cap : 1;
    return nextRawDpr >= 2 && nextCap >= 2 ? 2 : 1;
  }

  const resize = (options = {}) => {
    const nextRatio = resolveCanvasDpr(window.devicePixelRatio || 1, state.dprCap);
    const nextWidth = window.innerWidth;
    const nextHeight = window.innerHeight;
    const previousColumns = state.fieldColumns;
    const previousRows = state.fieldRows;
    const previousDensityField = state.densityField;
    if (
      options.force !== true &&
      state.width === nextWidth &&
      state.height === nextHeight &&
      state.dpr === nextRatio &&
      state.densityField.length > 0
    ) {
      return false;
    }

    state.width = nextWidth;
    state.height = nextHeight;
    state.dpr = nextRatio;
    state.gridSize = state.width < 720 ? QUALITY_PROFILES.low.gridSize : QUALITY_PROFILES.high.gridSize;
    canvas.width = Math.ceil(nextWidth * nextRatio);
    canvas.height = Math.ceil(nextHeight * nextRatio);
    canvas.style.width = \`\${nextWidth}px\`;
    canvas.style.height = \`\${nextHeight}px\`;
    context.setTransform(nextRatio, 0, 0, nextRatio, 0, 0);
    context.imageSmoothingEnabled = false;
    state.fieldColumns = Math.ceil(state.width / state.gridSize) + 1;
    state.fieldRows = Math.ceil(state.height / state.gridSize) + 1;
    state.flowFieldConfig = state.flowFieldConfig || createStableFlowFieldConfig();
    initializeGridGeometry();

    if (previousColumns > 0 && previousRows > 0 && previousDensityField.length >= previousColumns * previousRows) {
      state.densityField = resizeDensityField(previousDensityField, previousColumns, previousRows, state.fieldColumns, state.fieldRows);
      state.nextDensityField = new Float32Array(state.densityField.length);
    } else {
      seedAmbientDensityField();
    }

    state.frameNodes = resolveFrameNodes(state.lastFrame || 0);
    drawStaticBackdrop();
    return true;
  };

  const scheduleResize = () => {
    if (state.resizeRafId !== 0) {
      return;
    }
    state.resizeRafId = window.requestAnimationFrame(() => {
      state.resizeRafId = 0;
      resize();
    });
  };

  const paintFrame = (time = 0) => {
    if (!state.running) {
      return;
    }
    if (state.lastFrame > 0 && time - state.lastFrame < state.frameInterval) {
      state.rafId = window.requestAnimationFrame(paintFrame);
      return;
    }

    const dt = state.lastFrame === 0 ? 0.016 : Math.min((time - state.lastFrame) / 1000, 0.033);
    state.lastFrame = time;
    readPalette();
    resize();
    state.frameNodes = resolveFrameNodes(time);
    stepFluidField(time, dt, state.frameNodes);

    context.fillStyle = formatCanvasRgba(state.paletteRgb.bg, CANVAS_TRAIL_ALPHA);
    context.fillRect(0, 0, state.width, state.height);
    drawGridBackdrop();
    state.rafId = window.requestAnimationFrame(paintFrame);
  };

  const start = () => {
    window.cancelAnimationFrame(state.rafId);
    resize({ force: true });
    if (reducedMotion.matches || document.hidden) {
      state.running = false;
      drawStaticBackdrop();
      return;
    }

    state.running = true;
    state.lastFrame = 0;
    state.rafId = window.requestAnimationFrame(paintFrame);
  };

  const stop = () => {
    state.running = false;
    window.cancelAnimationFrame(state.rafId);
    state.rafId = 0;
  };

  const handleVisibilityChange = () => {
    if (document.hidden || reducedMotion.matches) {
      stop();
      drawStaticBackdrop();
      return;
    }
    start();
  };

  const handleDotInteraction = (event) => {
    if (!event) {
      return false;
    }
    return queueInteractionRipple(event.clientX, event.clientY);
  };

  const observeTheme = new MutationObserver(() => {
    readPalette();
    if (!state.running) {
      drawStaticBackdrop();
    }
  });

  observeTheme.observe(document.documentElement, {
    attributeFilter: ["data-theme"],
    attributes: true
  });

  window.addEventListener("resize", scheduleResize, { passive: true });
  document.addEventListener("visibilitychange", handleVisibilityChange);
  document.addEventListener("pointerdown", handleDotInteraction, { passive: true });
  reducedMotion.addEventListener("change", start);
  readPalette();
  if (!state.flowFieldConfig) {
    state.flowFieldConfig = createStableFlowFieldConfig();
  }
  start();
})();`;

  return (
    <>
      {raw("<!doctype html>")}
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{pageMetadata.title}</title>
          <meta name="description" content={pageMetadata.description} />
          {pageMetadata.noindex ? (
            <meta name="robots" content="noindex" />
          ) : null}
          <link rel="canonical" href={pageMetadata.canonicalUrl} />
          {raw(socialMetaTags)}
          <script>{raw(themeScript)}</script>
          <link
            rel="stylesheet"
            href={withBasePath(siteConfig, "/static/styles.css")}
          />
          {jsonLd ? (
            <script type="application/ld+json">{raw(jsonLd)}</script>
          ) : null}
        </head>
        <body>
          <div class="noise-field" aria-hidden="true">
            <canvas class="noise-field__canvas" data-ambient-field></canvas>
          </div>
          <Header siteConfig={siteConfig} />
          <button
            class="theme-toggle"
            type="button"
            aria-label="Toggle theme"
            aria-pressed="false"
            data-theme-toggle
          >
            Light
          </button>
          <main class="site-main">{children}</main>
          <Footer siteConfig={siteConfig} />
          <script>{raw(ambientFieldScript)}</script>
          <script>{raw(themeToggleScript)}</script>
        </body>
      </html>
    </>
  );
};

type SocialMetaInput = {
  description: string;
  image: string;
  imageAlt: string;
  imageHeight: number;
  imageWidth: number;
  locale: string;
  siteName: string;
  title: string;
  type: string;
  url: string;
};

const createSocialMetaTags = (openGraph: SocialMetaInput): string =>
  [
    renderMetaTag("property", "og:title", openGraph.title),
    renderMetaTag("property", "og:description", openGraph.description),
    renderMetaTag("property", "og:type", openGraph.type),
    renderMetaTag("property", "og:url", openGraph.url),
    renderMetaTag("property", "og:image", openGraph.image),
    renderMetaTag("property", "og:image:width", String(openGraph.imageWidth)),
    renderMetaTag("property", "og:image:height", String(openGraph.imageHeight)),
    renderMetaTag("property", "og:image:alt", openGraph.imageAlt),
    renderMetaTag("property", "og:site_name", openGraph.siteName),
    renderMetaTag("property", "og:locale", openGraph.locale),
    renderMetaTag("name", "twitter:card", "summary_large_image"),
    renderMetaTag("name", "twitter:title", openGraph.title),
    renderMetaTag("name", "twitter:description", openGraph.description),
    renderMetaTag("name", "twitter:image", openGraph.image),
    renderMetaTag("name", "twitter:image:alt", openGraph.imageAlt),
  ].join("");

const renderMetaTag = (
  keyAttribute: "name" | "property",
  key: string,
  content: string,
): string =>
  `<meta ${keyAttribute}="${escapeHtmlAttribute(key)}" content="${escapeHtmlAttribute(content)}">`;

const escapeHtmlAttribute = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
