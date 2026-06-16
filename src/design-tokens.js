/** Mendr landing — locked palette (60-30-10) */
export const palette = {
  primary: "#DCEFF8",
  accent: "#FDFCD7",
  secondary: "#D7E7D5",
};

export const colors = {
  primary: palette.primary,
  secondary: palette.secondary,
  accent: palette.accent,
  textDark: "#2c3a42",
  textMid: "#4a6070",
  textMuted: "#7a96a6",
  roseDark: "#4f6349",
  accentDark: "#7a6a45",
};

export const backgrounds = {
  hero: "/backgrounds/row-1-column-1.png",
  problem: "/backgrounds/row-2-column-1.png",
  howItWorks: "/backgrounds/row-3-column-1.png",
  features: "/backgrounds/row-4-column-1.png",
  futurePlans: "/backgrounds/row-5-column-1.png",
  audiences: "/backgrounds/row-5-column-1.png",
  contact: "/backgrounds/row-6-column-1.png",
};

export const sectionThemes = {
  hero: palette.primary,
  problem: palette.primary,
  howItWorks: palette.primary,
  features: palette.secondary,
  futurePlans: palette.primary,
  audiences: palette.primary,
  contact: palette.primary,
};

export function sectionSceneStyle(key) {
  const image = backgrounds[key];
  if (!image) return {};
  return {
    "--scene-image": `url(${image})`,
  };
}

/** Blue-zone elevation scale — Hero & Problem (#DCEFF8 wash) */
export const surfaces = {
  blue: {
    wash: "#DCEFF8",
    card: "#C8DFEF",
    panel: "#B5D5E8",
    shadows: {
      cardRaised: "8px 8px 16px #9BB8CC, -8px -8px 16px #E8F4FA",
      cardInset: "inset 4px 4px 10px #9BB8CC, inset -4px -4px 10px #E8F4FA",
      panelRaised: "6px 6px 14px #8AADC4, -6px -6px 14px #D4EAF5",
      panelInset: "inset 3px 3px 8px #8AADC4, inset -3px -3px 8px #D4EAF5",
    },
  },
  /** Paper-zone elevation scale — How it works (#FDFCD7 wash) */
  paper: {
    wash: "#FDFCD7",
    card: "#f0efcc",
    panel: "#EDE3C2",
    shadows: {
      cardRaised: "8px 8px 16px #C8B99A, -8px -8px 16px #F5EDD8",
      cardInset: "inset 4px 4px 10px #C8B99A, inset -4px -4px 10px #F5EDD8",
      panelRaised: "6px 6px 14px #B8A888, -6px -6px 14px #EDE5CC",
      panelInset: "inset 3px 3px 8px #B8A888, inset -3px -3px 8px #EDE5CC",
    },
  },
  /** Sage-zone elevation scale — Capabilities & Contact (#D7E7D5 wash) */
  sage: {
    wash: "#D7E7D5",
    card: "#D7E7D5",
    panel: "#c2d0c0",
    shadows: {
      cardRaised: "8px 8px 16px #9BA896, -8px -8px 16px #DCE6D8",
      cardInset: "inset 4px 4px 10px #9BA896, inset -4px -4px 10px #DCE6D8",
      panelRaised: "6px 6px 14px #8A9A88, -6px -6px 14px #D5DFD2",
      panelInset: "inset 3px 3px 8px #8A9A88, inset -3px -3px 8px #D5DFD2",
    },
  },
};

/** Matte brass palette — interactive affordance (radio knobs, frame borders) */
export const brass = {
  light: "#E4C98A",
  mid: "#C9A962",
  dark: "#9A7A3A",
};

/** Composable box-shadow rings — stack after existing neu shadows */
export const brassRings = {
  primary: `0 0 0 2px ${brass.mid}, 0 0 0 3.5px rgba(228, 201, 138, 0.35), inset 0 1px 0 rgba(228, 201, 138, 0.25)`,
  secondary: `0 0 0 1.5px rgba(201, 169, 98, 0.65)`,
  focus: `0 0 0 1px rgba(201, 169, 98, 0.55)`,
  pressed: `0 0 0 1.5px rgba(154, 122, 58, 0.5)`,
};

export function withBrassRing(shadow, ring) {
  return `${shadow}, ${ring}`;
}

/** Glass-neumorphism — frosted translucency + backdrop blur */
export const glass = {
  shell: "rgba(255, 255, 255, 0.08)",
  panel: "rgba(255, 255, 255, 0.06)",
  tintRose: "rgba(176, 138, 138, 0.10)",
  tintMint: "rgba(170, 196, 170, 0.14)",
  border: "rgba(255, 255, 255, 0.55)",
  borderSoft: "rgba(255, 255, 255, 0.30)",
  blur: "blur(28px) saturate(180%)",
  shadow: "0 20px 50px rgba(0, 0, 0, 0.22), 0 8px 24px rgba(44, 58, 66, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.35)",
  carveBg: "rgba(0, 0, 0, 0.02)",
  carveShadow: "inset 3px 3px 10px rgba(74, 96, 112, 0.12), inset -2px -2px 8px rgba(232, 244, 250, 0.35)",
  bumpBg: "rgba(255, 255, 255, 0.16)",
  bumpInner: "rgba(255, 255, 255, 0.08)",
  bumpAccent: "rgba(253, 252, 215, 0.20)",
  bumpRaised: "0 4px 14px rgba(0, 0, 0, 0.10), 0 2px 6px rgba(74, 96, 112, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.50)",
  bumpInset: "inset 2px 2px 6px rgba(74, 96, 112, 0.10), inset -2px -2px 5px rgba(255, 255, 255, 0.40)",
  knobGlow: "inset 0 0 8px rgba(253, 252, 215, 0.24)",
  knobGlowAccent: "inset 0 0 10px rgba(253, 252, 215, 0.36)",
  ring: "0 0 0 2px rgba(255, 255, 255, 0.50), 0 0 0 3.5px rgba(255, 255, 255, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.35)",
  ringSoft: "0 0 0 1.5px rgba(255, 255, 255, 0.40)",
  ringFocus: "0 0 0 1px rgba(255, 255, 255, 0.55)",
  panelShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 6px 18px rgba(74, 96, 112, 0.10)",
  /** Fallback when backdrop-filter is unsupported */
  shellFallback: "rgba(220, 239, 248, 0.55)",
  panelFallback: "rgba(220, 239, 248, 0.30)",
};
