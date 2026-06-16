import { palette } from "../design-tokens";

export const SECTION_IDS = [
  "hero",
  "problem",
  "how-it-works",
  "features",
  "future-plans",
  "contact",
];

const SECTION_COUNT = SECTION_IDS.length;

/** Journey panorama asset dimensions (3625×10850) */
export const PANORAMA_WIDTH = 3625;
export const PANORAMA_HEIGHT = 10850;

export function getPanoramaDisplayHeight() {
  return window.innerWidth * (PANORAMA_HEIGHT / PANORAMA_WIDTH);
}

/** Linear scroll progress 0–1 across full page height */
export function getScrollProgress(scrollY, sections) {
  if (!sections.length) return 0;
  const last = sections[sections.length - 1];
  const maxScroll = Math.max(1, last.bottom - window.innerHeight);
  return Math.max(0, Math.min(1, scrollY / maxScroll));
}

/**
 * Pan offset tied 1:1 to document scroll — constant velocity, no section-boundary jerks.
 * Tint/opacity still use section-based journeyIndex.
 */
export function getPanOffsetPxFromScroll(scrollY, sections) {
  const maxOffset = Math.max(0, getPanoramaDisplayHeight() - window.innerHeight);
  return -getScrollProgress(scrollY, sections) * maxOffset;
}

/** Per-section tint stops (index 0–5) */
export const TINT_STOPS = [
  palette.primary,   // hero — #DCEFF8
  palette.primary,   // problem — #DCEFF8
  palette.primary,   // how it works — #DCEFF8
  palette.primary,   // capabilities — #DCEFF8
  palette.primary,   // future plans — #DCEFF8
  palette.primary,   // contact — #DCEFF8
];

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function lerpColor(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const mix = (x, y) => x + (y - x) * t;
  const r = Math.round(mix(a.r, b.r));
  const g = Math.round(mix(a.g, b.g));
  const bl = Math.round(mix(a.b, b.b));
  return {
    r,
    g,
    b,
    hex: `#${[r, g, bl].map((c) => c.toString(16).padStart(2, "0")).join("")}`,
    rgb: `${r}, ${g}, ${bl}`,
  };
}

export function getJourneyIndex(scrollY, sections) {
  if (!sections.length) return 0;

  let activeIndex = 0;
  for (let i = 0; i < sections.length; i++) {
    if (scrollY >= sections[i].top - 1) activeIndex = i;
  }

  const sec = sections[activeIndex];
  const localT = Math.max(0, Math.min(1, (scrollY - sec.top) / sec.height));
  return activeIndex + localT;
}

function tintFromHex(hex) {
  const { r, g, b } = hexToRgb(hex);
  return { hex, rgb: `${r}, ${g}, ${b}` };
}

export function getSmoothTint(journeyIndex) {
  const clamped = Math.max(0, Math.min(SECTION_COUNT - 1, journeyIndex));
  const lower = Math.floor(clamped);
  const upper = Math.min(SECTION_COUNT - 1, lower + 1);
  const t = clamped - lower;
  return lerpColor(TINT_STOPS[lower], TINT_STOPS[upper], t);
}

export function measureSections() {
  return SECTION_IDS.map((id, index) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const height = rect.height;
    return { id, index, top, height, bottom: top + height };
  }).filter(Boolean);
}

export function getPanY(scrollY, sections) {
  const journey = getJourneyIndex(scrollY, sections);
  return (journey / (SECTION_COUNT - 1)) * 100;
}

export function getJourneyState(scrollY, sections) {
  if (!sections.length) {
    const tint = { hex: palette.primary, rgb: "220, 239, 248" };
    return {
      journeyIndex: 0,
      localT: 0,
      activeSection: "hero",
      activeIndex: 0,
      panY: 0,
      washColor: tint.hex,
      washRgb: tint.rgb,
      washBackground: tint.hex,
    };
  }

  let activeIndex = 0;
  for (let i = 0; i < sections.length; i++) {
    if (scrollY >= sections[i].top - 1) activeIndex = i;
  }

  const sec = sections[activeIndex];
  const localT = Math.max(0, Math.min(1, (scrollY - sec.top) / sec.height));
  const journeyIndex = activeIndex + localT;
  const tint = getSmoothTint(journeyIndex);

  return {
    journeyIndex,
    localT,
    activeSection: sec.id,
    activeIndex,
    panY: getPanY(scrollY, sections),
    washColor: tint.hex,
    washRgb: tint.rgb,
    washBackground: tint.hex,
  };
}

export function getReducedMotionWash() {
  return palette.primary;
}

/** Derive neumorphic shadow colors from interpolated wash — stays in sync with header bg */
export function getNeuShadowFromWashRgb(washRgb, variant = "raised") {
  const [r, g, b] = washRgb.split(",").map((s) => parseInt(s.trim(), 10));
  const dark = {
    r: Math.round(r * 0.82),
    g: Math.round(g * 0.82),
    b: Math.round(b * 0.86),
  };
  const light = {
    r: Math.round(r + (255 - r) * 0.9),
    g: Math.round(g + (255 - g) * 0.9),
    b: Math.round(b + (255 - b) * 0.86),
  };
  const toHex = (c) => `#${[c.r, c.g, c.b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  const darkHex = toHex(dark);
  const lightHex = toHex(light);

  if (variant === "raisedLg") {
    return `14px 14px 28px ${darkHex}, -14px -14px 28px ${lightHex}`;
  }
  if (variant === "inset") {
    return `inset 4px 4px 10px ${darkHex}, inset -4px -4px 10px ${lightHex}`;
  }
  return `8px 8px 16px ${darkHex}, -8px -8px 16px ${lightHex}`;
}

const BASE_PANORAMA_OPACITY = 0.30;

/** Keep panorama visible through contact/footer — both are blue-themed */
export function getPanoramaOpacity(journeyIndex) {
  return BASE_PANORAMA_OPACITY;
}
