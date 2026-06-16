import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from "react";
import { colors, palette, surfaces, glass, brass, brassRings, withBrassRing, sectionSceneStyle } from "./design-tokens";
import { ScrollAtmosphereProvider, useAtmosphere } from "./components/ScrollAtmosphere";

// Neumorphic shadows derived from primary base #DCEFF8
// Typography: Inter Tight | Design: Bauhaus + Neumorphism + Wabi-sabi
// Background: smooth scroll-synced theme wash + per-section scene images at 36% opacity

const neu = {
  // Raised element on primary background
  raised: "8px 8px 16px #b8ccd4, -8px -8px 16px #ffffff",
  raisedLg: "14px 14px 28px #b0c8d2, -14px -14px 28px #ffffff",
  // Inset / pressed
  inset: "inset 4px 4px 10px #b8ccd4, inset -4px -4px 10px #ffffff",
  // Raised on sage secondary surface
  raisedRose: "6px 6px 14px #9da599, -6px -6px 14px #e8ede5",
  // Raised on accent surface
  raisedAccent: "5px 5px 12px #c8b99a, -5px -5px 12px #fffdf0",
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, style = {}, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style
    }}>
      {children}
    </div>
  );
}

// ── Section label pill ────────────────────────────────────────────────────────
function Label({ children, zone }) {
  const zoneSurface = zone && surfaces[zone];
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "8px",
      background: zoneSurface ? zoneSurface.card : colors.accent,
      boxShadow: zoneSurface ? zoneSurface.shadows.cardRaised : neu.raisedAccent,
      borderRadius: "999px",
      padding: "6px 18px",
      fontSize: "11px", fontWeight: 500,
      letterSpacing: "0.12em", textTransform: "uppercase",
      color: zone === "sage" ? colors.roseDark : zone === "blue" ? colors.textMid : colors.accentDark,
      marginBottom: "20px",
    }}>
      {children}
    </div>
  );
}

// ── Neumorphic card ───────────────────────────────────────────────────────────
function NeuCard({ children, style = {}, surface = "primary" }) {
  const { blue, paper, sage } = surfaces;
  let bg = colors.primary;
  let shadow = neu.raised;
  let extra = {};
  if (surface === "rose") {
    bg = colors.secondary;
    shadow = neu.raisedRose;
  } else if (surface === "blue") {
    bg = blue.card;
    shadow = blue.shadows.cardRaised;
  } else if (surface === "bluePanel") {
    bg = blue.panel;
    shadow = blue.shadows.panelRaised;
  } else if (surface === "paper") {
    bg = paper.card;
    shadow = paper.shadows.cardRaised;
  } else if (surface === "paperPanel") {
    bg = paper.panel;
    shadow = paper.shadows.panelRaised;
  } else if (surface === "sage") {
    bg = sage.card;
    shadow = sage.shadows.cardRaised;
  } else if (surface === "sagePanel") {
    bg = sage.panel;
    shadow = sage.shadows.panelRaised;
  } else if (surface === "glass") {
    bg = glass.shell;
    shadow = glass.shadow;
    extra = {
      backdropFilter: glass.blur,
      WebkitBackdropFilter: glass.blur,
      border: `1px solid ${glass.border}`,
    };
  }
  return (
    <div
      className={surface === "glass" ? "glass-card" : undefined}
      style={{
      background: bg,
      boxShadow: shadow,
      borderRadius: "24px",
      padding: "32px",
      ...extra,
      ...style
    }}>
      {children}
    </div>
  );
}

// ── Glass aura wrapper — signature boxes & cards ──────────────────────────────
function GlassWrap({ children, className = "", style = {} }) {
  return (
    <div className={`glass-wrap ${className}`.trim()} style={style}>
      <div className="glass-aura" aria-hidden="true" />
      {children}
    </div>
  );
}

// ── Neumorphic button ─────────────────────────────────────────────────────────
function NeuButton({ children, variant = "primary", zone, onClick, style = {} }) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const zoneSurface = zone && surfaces[zone];

  const isPrimary = variant === "primary";
  const isZoned = zoneSurface && !isPrimary;

  const bg = isPrimary ? colors.accent : (isZoned ? zoneSurface.card : colors.primary);
  const color = isPrimary ? colors.accentDark : colors.textMid;

  const hoverShadow = zone === "blue"
    ? "10px 10px 20px #9BB8CC, -10px -10px 20px #E8F4FA"
    : zone === "paper"
      ? "10px 10px 20px #C8B99A, -10px -10px 20px #F5EDD8"
      : zone === "sage"
        ? "10px 10px 20px #9BA896, -10px -10px 20px #DCE6D8"
        : "10px 10px 20px #b8ccd4, -10px -10px 20px #ffffff";

  let shadow;
  if (pressed) {
    if (isPrimary) {
      shadow = neu.raisedAccent.replace("5px 5px 12px", "inset 3px 3px 8px").replace("-5px -5px 12px", "inset -3px -3px 8px");
    } else if (isZoned) {
      shadow = zoneSurface.shadows.cardInset;
    } else {
      shadow = neu.inset;
    }
  } else if (isPrimary) {
    shadow = neu.raisedAccent;
  } else if (isZoned) {
    shadow = hovered ? hoverShadow : zoneSurface.shadows.cardRaised;
  } else {
    shadow = hovered ? hoverShadow : neu.raised;
  }

  const ring = pressed
    ? brassRings.pressed
    : isPrimary
      ? brassRings.primary
      : brassRings.secondary;

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      style={{
        background: bg,
        boxShadow: withBrassRing(shadow, ring),
        borderRadius: "999px",
        border: "none",
        padding: "14px 32px",
        fontSize: "14px", fontWeight: 500,
        letterSpacing: "0.04em",
        color,
        cursor: "pointer",
        transition: "box-shadow 0.2s ease, transform 0.15s ease",
        transform: pressed ? "scale(0.98)" : "scale(1)",
        fontFamily: "inherit",
        ...style
      }}
    >
      {children}
    </button>
  );
}

// ── Dial ornament — signature element from reference images ───────────────────
function DialOrnament({ size = 80, accent = false, zone, arc = false, numbered = false }) {
  if (zone === "glass") {
    return (
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <GlassKnob size={size} accent={accent} />
        {arc && (
          <svg
            width={size} height={size} viewBox={`0 0 ${size} ${size}`}
            style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)", pointerEvents: "none" }}
          >
            <circle
              cx={size / 2} cy={size / 2} r={size / 2 - 2}
              fill="none" stroke={colors.accentDark} strokeWidth="2" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * (size / 2 - 2) * 0.72} ${2 * Math.PI * (size / 2 - 2)}`} opacity="0.7"
            />
          </svg>
        )}
      </div>
    );
  }

  const r = size / 2;
  const innerR = r * 0.42;
  const brassSize = Math.max(4, size * 0.1);
  const arcR = r - 2;
  const arcC = 2 * Math.PI * arcR;

  let outerBg = colors.primary;
  let outerShadow = neu.raised;
  let innerBg = colors.primary;
  let innerShadow = neu.inset;
  let dotColor = colors.textMuted;

  if (zone === "blue") {
    if (accent) {
      outerBg = colors.accent;
      outerShadow = neu.raisedAccent;
      innerBg = colors.accent;
      innerShadow = neu.inset;
      dotColor = colors.accentDark;
    } else {
      outerBg = surfaces.blue.panel;
      outerShadow = surfaces.blue.shadows.panelRaised;
      innerBg = surfaces.blue.panel;
      innerShadow = surfaces.blue.shadows.panelInset;
    }
  } else if (zone === "paper") {
    if (accent) {
      outerBg = surfaces.paper.card;
      outerShadow = surfaces.paper.shadows.cardRaised;
      innerBg = surfaces.paper.card;
      innerShadow = surfaces.paper.shadows.cardInset;
      dotColor = colors.accentDark;
    } else {
      outerBg = surfaces.paper.panel;
      outerShadow = surfaces.paper.shadows.panelRaised;
      innerBg = surfaces.paper.panel;
      innerShadow = surfaces.paper.shadows.panelInset;
    }
  } else if (zone === "sage") {
    if (accent) {
      outerBg = surfaces.sage.card;
      outerShadow = surfaces.sage.shadows.cardRaised;
      innerBg = surfaces.sage.card;
      innerShadow = surfaces.sage.shadows.cardInset;
      dotColor = colors.roseDark;
    } else {
      outerBg = surfaces.sage.panel;
      outerShadow = surfaces.sage.shadows.panelRaised;
      innerBg = surfaces.sage.panel;
      innerShadow = surfaces.sage.shadows.panelInset;
    }
  } else if (accent) {
    outerBg = colors.accent;
    outerShadow = neu.raisedAccent;
    innerBg = colors.accent;
    innerShadow = neu.inset;
    dotColor = colors.accentDark;
  }

  if (numbered) {
    innerBg = colors.accent;
    innerShadow = surfaces.paper.shadows.panelInset;
  }

  return (
    <div style={{
      width: size, height: size,
      borderRadius: "50%",
      background: outerBg,
      boxShadow: outerShadow,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      position: "relative",
    }}>
      <div style={{
        width: innerR * 2, height: innerR * 2,
        borderRadius: "50%",
        background: innerBg,
        boxShadow: innerShadow,
      }} />
      {!numbered && (
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: brassSize, height: brassSize,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, ${brass.light}, ${brass.dark})`,
          boxShadow: "0 1px 1.5px rgba(120, 90, 40, 0.4)",
        }} />
      )}
      {!numbered && (
      <div style={{
        position: "absolute",
        top: "18%", left: "50%",
        transform: "translateX(-50%)",
        width: 5, height: 5,
        borderRadius: "50%",
        background: dotColor,
      }} />
      )}
      {/* Optional healed progress arc — restrained accentDark ring */}
      {arc && (
        <svg
          width={size} height={size} viewBox={`0 0 ${size} ${size}`}
          style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)", pointerEvents: "none" }}
        >
          <circle
            cx={r} cy={r} r={arcR}
            fill="none" stroke={colors.accentDark} strokeWidth="2" strokeLinecap="round"
            strokeDasharray={`${arcC * 0.72} ${arcC}`} opacity="0.7"
          />
        </svg>
      )}
    </div>
  );
}

// ── Raised glass knob — rigged edge + accent glow ─────────────────────────────
function GlassKnob({ size = 44, accent = false }) {
  const innerR = size * 0.42;
  const glow = accent ? glass.knobGlowAccent : glass.knobGlow;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(253, 252, 215, ${accent ? 0.3 : 0.2}) 0%, transparent 68%)`,
          pointerEvents: "none",
        }}
      />
      <div style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: accent ? glass.bumpAccent : glass.bumpBg,
        backdropFilter: glass.blur,
        WebkitBackdropFilter: glass.blur,
        border: `1px solid ${glass.border}`,
        boxShadow: `${glow}, ${glass.bumpRaised}`,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* Fluted glass ridges — crisp specular crests, soft valleys */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `repeating-conic-gradient(
            from 0deg,
            rgba(255, 255, 255, 0.9) 0deg,
            rgba(255, 255, 255, 0) 1.6deg,
            rgba(60, 80, 95, 0.22) 5deg,
            rgba(255, 255, 255, 0) 8.4deg,
            rgba(255, 255, 255, 0.9) 10deg
          )`,
          WebkitMask: "radial-gradient(circle, transparent 62%, #000 66%, #000 90%, transparent 97%)",
          mask: "radial-gradient(circle, transparent 62%, #000 66%, #000 90%, transparent 97%)",
          pointerEvents: "none",
        }} />
        {/* Cylindrical light falloff — dims the rim away from the light */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 38%, rgba(74, 96, 112, 0) 60%, rgba(74, 96, 112, 0.32) 100%)",
          WebkitMask: "radial-gradient(circle, transparent 62%, #000 66%, #000 90%, transparent 97%)",
          mask: "radial-gradient(circle, transparent 62%, #000 66%, #000 90%, transparent 97%)",
          pointerEvents: "none",
        }} />
        {/* Specular sheen top-left */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 32%)",
          pointerEvents: "none",
        }} />
        {/* Caved-in glass center */}
        <div style={{
          width: innerR * 2,
          height: innerR * 2,
          borderRadius: "50%",
          background: accent ? "rgba(253, 252, 215, 0.12)" : glass.bumpInner,
          boxShadow: glass.bumpInset,
          position: "relative",
          zIndex: 1,
        }} />
      </div>
    </div>
  );
}

// ── Glass donut dial — hollow ring with centered number (roadmap steps) ─────────
function GlassDonutDial({ size = 64, number }) {
  const innerSize = size * 0.62;

  return (
    <div
      className="glass-donut-dial"
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Raised glass ring body */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: glass.bumpBg,
          backdropFilter: glass.blur,
          WebkitBackdropFilter: glass.blur,
          border: `1px solid ${glass.border}`,
          boxShadow: `${glass.bumpRaised}, ${glass.ringSoft}`,
        }}
      />
      {/* Recessed glass center — the donut hole */}
      <div
        aria-hidden="true"
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: "50%",
          background: glass.bumpInner,
          boxShadow: `${glass.bumpInset}, inset 0 1px 0 rgba(255, 255, 255, 0.28)`,
          position: "relative",
          zIndex: 1,
        }}
      />
      <span className="glass-donut-num">{number}</span>
    </div>
  );
}

// ── Knob row ornament ─────────────────────────────────────────────────────────
function KnobRow({ zone }) {
  if (zone === "glass") {
    return (
      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
        {[false, true, false].map((acc, i) => (
          <GlassKnob key={i} size={44} accent={acc} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
      {[false, true, false].map((acc, i) => (
        <DialOrnament key={i} size={44} accent={acc} zone={zone} />
      ))}
    </div>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ on = false, onChange, zone }) {
  const zoneSurface = zone && surfaces[zone];

  let trackBg = colors.primary;
  let trackShadow = neu.inset;
  let knobBg = colors.primary;
  let knobShadow = neu.raised;

  if (zoneSurface) {
    trackBg = on ? (zone === "blue" ? colors.accent : zoneSurface.card) : zoneSurface.panel;
    trackShadow = on
      ? (zone === "blue" ? neu.raisedAccent : zoneSurface.shadows.cardRaised)
      : zoneSurface.shadows.panelInset;
    knobBg = zoneSurface.card;
    knobShadow = zoneSurface.shadows.cardRaised;
  } else if (zone === "glass") {
    trackBg = on ? "rgba(253, 252, 215, 0.28)" : glass.carveBg;
    trackShadow = on ? glass.panelShadow : glass.carveShadow;
    knobBg = on ? glass.bumpAccent : glass.bumpBg;
    knobShadow = glass.bumpRaised;
  } else if (on) {
    trackBg = colors.accent;
    trackShadow = neu.raisedAccent;
  }

  return (
    <div
      onClick={() => onChange && onChange(!on)}
      style={{
        width: 52, height: 28,
        borderRadius: "999px",
        background: trackBg,
        boxShadow: zone === "glass"
          ? `${trackShadow}${on ? `, ${glass.ring}` : `, ${glass.ringSoft}`}`
          : withBrassRing(trackShadow, on ? brassRings.primary : brassRings.secondary),
        cursor: "pointer",
        position: "relative",
        transition: "all 0.3s ease",
        flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute",
        top: "50%", left: on ? "calc(100% - 26px)" : "4px",
        transform: "translateY(-50%)",
        width: 20, height: 20,
        borderRadius: "50%",
        background: knobBg,
        boxShadow: knobShadow,
        transition: "left 0.3s ease",
      }} />
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef("up");
  const hideTimer = useRef(null);

  useEffect(() => {
    const clearHideTimer = () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      setScrolled(y > 20);

      if (y <= 20) {
        scrollDirection.current = "up";
        clearHideTimer();
        setVisible(true);
        lastScrollY.current = y;
        return;
      }

      if (delta > 2) {
        if (scrollDirection.current !== "down") {
          scrollDirection.current = "down";
          clearHideTimer();
          hideTimer.current = setTimeout(() => setVisible(false), 2000);
        }
      } else if (delta < -2) {
        scrollDirection.current = "up";
        clearHideTimer();
        setVisible(true);
      }

      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearHideTimer();
    };
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", justifyContent: "center",
      padding: "20px 17px 0",
      pointerEvents: "none",
      transform: visible ? "translateY(0)" : "translateY(calc(-100% - 24px))",
      opacity: visible ? 1 : 0,
      transition: "transform 0.4s ease, opacity 0.4s ease",
    }}>
      <div style={{
        width: "100%", maxWidth: 1200,
        borderRadius: 22,
        background: "rgba(var(--wash-rgb, 220, 239, 248), 0.95)",
        boxShadow: scrolled
          ? "var(--nav-shadow-lg, 14px 14px 28px #b0c8d2, -14px -14px 28px #ffffff)"
          : "var(--nav-shadow, 8px 8px 16px #b8ccd4, -8px -8px 16px #ffffff)",
        padding: "17px 20px 17px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28,
        position: "relative",
        pointerEvents: visible ? "auto" : "none",
      }}>
        {/* Inset dotted brass frame */}
        <div style={{
          position: "absolute", inset: 8,
          borderRadius: 14,
          border: `1.5px dotted ${brass.mid}`,
          opacity: 0.7,
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", position: "relative", zIndex: 1 }}>
          <div style={{
            width: 50, height: 50, borderRadius: "50%",
            background: "rgb(var(--wash-rgb, 220, 239, 248))",
            boxShadow: "var(--nav-shadow, 8px 8px 16px #b8ccd4, -8px -8px 16px #ffffff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              background: "rgb(var(--wash-rgb, 220, 239, 248))",
              boxShadow: "var(--nav-inset, inset 4px 4px 10px #b8ccd4, inset -4px -4px 10px #ffffff)",
            }} />
            <div style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 7, height: 7,
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, ${brass.light}, ${brass.dark})`,
              boxShadow: "0 1px 1.5px rgba(120, 90, 40, 0.4)",
            }} />
          </div>
          <span style={{
            fontSize: "22px", fontWeight: 500,
            color: colors.textDark,
            letterSpacing: "-0.04em",
          }}>mendr</span>
        </div>

        {/* Nav links */}
        <div className="nav-links" style={{
          display: "flex", alignItems: "center", gap: "28px",
          fontSize: "14px", fontWeight: 500,
          color: colors.textMid,
          position: "relative", zIndex: 1,
        }}>
          {["Product", "How it works", "For teams", "Investors"].map(l => (
            <a key={l} href="#" style={{
              color: colors.textMid, textDecoration: "none",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = colors.textDark}
              onMouseLeave={e => e.target.style.color = colors.textMid}
            >{l}</a>
          ))}
          <NeuButton style={{ padding: "12px 26px", fontSize: "14px" }}>
            Book a demo
          </NeuButton>
        </div>
      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const [healToggle, setHealToggle] = useState(false);
  const [autoFlip, setAutoFlip] = useState(true);

  useEffect(() => {
    if (!autoFlip) return;
    const t = setInterval(() => setHealToggle(p => !p), 2800);
    return () => clearInterval(t);
  }, [autoFlip]);

  return (
    <section id="hero" className="section-scene" style={{
      ...sectionSceneStyle("hero"),
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "110px 28px 100px",
      position: "relative",
    }}>
      <div className="page-container hero-stack">
        <FadeIn>
          <div className="hero-eyebrow">
            <Label>Self-healing API infrastructure</Label>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="hero-headline" style={{
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.05em",
            color: colors.textDark,
            margin: 0,
          }}>
            Services break in real-time.<br />
            <span style={{ color: colors.textMuted }}>mendr</span>{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              fixes
              <svg
                viewBox="0 0 80 8"
                preserveAspectRatio="none"
                style={{
                  position: "absolute", left: "-2%", right: "-2%", bottom: "-4px",
                  width: "104%", height: "10px", overflow: "visible", pointerEvents: "none",
                }}
                aria-hidden="true"
              >
                <path
                  d="M2 5 Q20 2, 40 4 T78 3"
                  fill="none"
                  stroke={brass.mid}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              </svg>
            </span>{" "}
            them in real-time.
          </h1>
        </FadeIn>

        <div className="hero-body">
          <div className="hero-copy-col">
            <FadeIn delay={0.2}>
              <p className="hero-sub" style={{
                fontSize: "clamp(16px, 2.2vw, 20px)",
                lineHeight: 1.7,
                color: colors.textMid,
                margin: "0 0 32px",
              }}>
                It's quiet until it isn't — when your microservices stop talking to each other,
                mendr spots the mismatch, figures out what went wrong, and applies a fix
                without anyone touching your code.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="hero-actions" style={{ display: "flex", gap: "16px", justifyContent: "flex-start", flexWrap: "wrap" }}>
                <NeuButton variant="primary" style={{ padding: "16px 36px", fontSize: "15px" }}>
                  Book a demo
                </NeuButton>
                <NeuButton variant="secondary" zone="blue" style={{ padding: "16px 36px", fontSize: "15px" }}>
                  Read the docs
                </NeuButton>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.45}>
            <GlassWrap className="hero-widget">
            <NeuCard surface="glass" style={{ width: "100%", padding: "28px 32px", position: "relative", zIndex: 1 }}>
              {/* Mini header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 24,
              }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {["#D7E7D5", "#FDFCD7", "#DCEFF8"].map((c, i) => (
                    <div key={i} style={{
                      width: 10, height: 10, borderRadius: "50%", background: c,
                      boxShadow: "0 2px 6px rgba(74, 96, 112, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: "11px", color: colors.textMuted, fontWeight: 500, letterSpacing: "0.06em" }}>
                  LIVE GATEWAY
                </span>
                <KnobRow zone="glass" />
              </div>

              {/* Animated schema mismatch */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {/* Service A box */}
                <div className="glass-carve" style={{
                  flex: 1,
                  borderRadius: "16px",
                  padding: "14px 16px",
                }}>
                  <div style={{ fontSize: "10px", color: colors.textMuted, marginBottom: 8, letterSpacing: "0.08em" }}>SERVICE A SENDS</div>
                  <div style={{ fontFamily: "monospace", fontSize: "12px", color: colors.textMid, lineHeight: 1.8 }}>
                    <span style={{ color: colors.roseDark }}>customer_id</span>: "USR-9"<br />
                    <span style={{ color: colors.roseDark }}>total_amount</span>: 149.00<br />
                    <span style={{ color: colors.roseDark }}>currency_code</span>: "USD"
                  </div>
                </div>

                {/* Arrow with mendr in middle */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                  <DialOrnament size={48} accent={healToggle} zone="glass" arc={healToggle} />
                  <div style={{
                    fontSize: "9px", fontWeight: 700,
                    color: healToggle ? colors.accentDark : colors.textMuted,
                    letterSpacing: "0.1em",
                    transition: "color 0.4s",
                  }}>
                    {healToggle ? "HEALED ✓" : "MENDR"}
                  </div>
                </div>

                {/* Service B box */}
                <div className="glass-carve" style={{
                  flex: 1,
                  borderRadius: "16px",
                  padding: "14px 16px",
                }}>
                  <div style={{ fontSize: "10px", color: colors.textMuted, marginBottom: 8, letterSpacing: "0.08em" }}>SERVICE B RECEIVES</div>
                  <div style={{ fontFamily: "monospace", fontSize: "12px", lineHeight: 1.8 }}>
                    <span style={{ color: healToggle ? "#4a8a5a" : colors.textMuted, transition: "color 0.4s" }}>customerId</span>: "USR-9"<br />
                    <span style={{ color: healToggle ? "#4a8a5a" : colors.textMuted, transition: "color 0.4s" }}>amount</span>: 149.00<br />
                    <span style={{ color: healToggle ? "#4a8a5a" : colors.textMuted, transition: "color 0.4s" }}>currency</span>: "USD"
                  </div>
                </div>
              </div>

              {/* Status row */}
              <div style={{
                marginTop: 20, display: "flex",
                alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Toggle zone="glass" on={healToggle} onChange={v => { setHealToggle(v); setAutoFlip(false); }} />
                  <span style={{ fontSize: "12px", color: colors.textMuted }}>
                    {healToggle ? "Rule active — FIELD_RENAME" : "Detecting mismatch…"}
                  </span>
                </div>
                <div style={{
                  background: healToggle ? colors.accent : colors.secondary,
                  boxShadow: healToggle ? neu.raisedAccent : neu.raisedRose,
                  borderRadius: "999px",
                  padding: "4px 14px",
                  fontSize: "11px", fontWeight: 500,
                  color: healToggle ? colors.accentDark : colors.roseDark,
                  transition: "all 0.4s",
                }}>
                  {healToggle ? "Confidence 94%" : "Analyzing…"}
                </div>
              </div>
            </NeuCard>
          </GlassWrap>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ── Problem section ───────────────────────────────────────────────────────────
function Problem() {
  const stats = [
    { num: "73%", desc: "of production incidents are caused by API contract changes" },
    { num: "4.2h", desc: "average time to diagnose and fix a schema mismatch" },
    { num: "$18k", desc: "average cost per hour of production downtime" },
  ];

  const withoutItems = [
    "Schema changes break production silently",
    "Engineers spend hours reading logs to find the mismatch",
    "Hotfix deployed at 3am — risky, stressful",
    "Post-mortem. Repeat next quarter.",
  ];
  const withItems = [
    "Mismatch detected at the gateway before it reaches your service",
    "Claude AI identifies the exact field causing the failure",
    "Proposed fix ready for your approval in under 60 seconds",
    "Rule deployed. Traffic flows. No redeploy needed.",
  ];

  return (
    <section id="problem" className="section-scene" style={{ ...sectionSceneStyle("problem"), padding: "100px 28px" }}>
      <div className="page-container hero-body">
        {/* Copy column */}
        <div className="hero-copy-col">
          <FadeIn>
            <Label>The problem</Label>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 style={{
              fontSize: "clamp(32px, 4.5vw, 56px)", fontWeight: 400,
              color: colors.textDark, letterSpacing: "-0.04em",
              lineHeight: 1.1, margin: "0 0 24px",
            }}>
              Service A changed.<br />Service B didn't know.
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p style={{
              fontSize: "clamp(18px, 2.4vw, 21px)", color: colors.textMid,
              lineHeight: 1.7, margin: "0 0 8px",
            }}>
              Schema drift between microservices is silent, invisible, and expensive.
              By the time you know, it's already in production.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="problem-stats">
              {stats.map((s, i) => (
                <div key={i} className="problem-stat">
                  <div className="problem-stat-num">{s.num}</div>
                  <div className="problem-stat-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Signature card — without / with mendr */}
        <FadeIn delay={0.45}>
          <GlassWrap className="hero-widget">
            <NeuCard surface="glass" style={{ width: "100%", padding: "28px 32px", position: "relative", zIndex: 1 }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 24,
              }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {["#D7E7D5", "#FDFCD7", "#DCEFF8"].map((c, i) => (
                    <div key={i} style={{
                      width: 10, height: 10, borderRadius: "50%", background: c,
                      boxShadow: "0 2px 6px rgba(74, 96, 112, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: "11px", color: colors.textMuted, fontWeight: 500, letterSpacing: "0.06em" }}>
                  INCIDENT REPLAY
                </span>
                <KnobRow zone="glass" />
              </div>

              {/* WITHOUT MENDR panel */}
              <div className="glass-carve" style={{
                borderRadius: "12px",
                padding: "16px 18px",
                marginBottom: 14,
              }}>
                <div style={{ fontSize: "11px", fontWeight: 500, color: colors.roseDark, letterSpacing: "0.08em", marginBottom: 14 }}>
                  WITHOUT MENDR
                </div>
                {withoutItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", marginBottom: i === withoutItems.length - 1 ? 0 : 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      background: palette.primary,
                      boxShadow: surfaces.blue.shadows.panelInset,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 1,
                      fontSize: "10px", color: colors.roseDark, fontWeight: 700,
                    }}>✕</div>
                    <span style={{ fontSize: "13.5px", color: colors.textMid, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* WITH MENDR panel */}
              <div className="glass-carve" style={{
                borderRadius: "12px",
                padding: "16px 18px",
              }}>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "#4a8a5a", letterSpacing: "0.08em", marginBottom: 14 }}>
                  WITH MENDR
                </div>
                {withItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", marginBottom: i === withItems.length - 1 ? 0 : 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      background: palette.primary,
                      boxShadow: surfaces.blue.shadows.panelInset,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 1,
                      fontSize: "10px", color: "#4a8a5a", fontWeight: 700,
                    }}>✓</div>
                    <span style={{ fontSize: "13.5px", color: colors.textMid, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </NeuCard>
          </GlassWrap>
        </FadeIn>
      </div>
    </section>
  );
}

// ── How it works ──────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      dial: true,
      label: "Intercept",
      title: "Every request passes through mendr",
      body: "Your services route calls through the mendr gateway. Nothing else changes — no SDK, no code modifications. Just point and go.",
    },
    {
      dial: false,
      label: "Detect",
      title: "Schema mismatches surface instantly",
      body: "When Service B rejects a request from Service A, mendr catches the failure, captures both payloads, and classifies the error type.",
    },
    {
      dial: true,
      label: "Diagnose",
      title: "Claude AI explains exactly what broke",
      body: "Using your registered service contracts as ground truth, Claude compares what was sent against what was expected — and names every mismatched field.",
    },
    {
      dial: false,
      label: "Heal",
      title: "A human approves. mendr applies the fix.",
      body: "A transformation rule is proposed with a confidence score. One click deploys it at runtime. Traffic flows. The TTL expires. The permanent fix is your next PR.",
    },
  ];

  return (
    <section id="how-it-works" className="section-scene" style={{ ...sectionSceneStyle("howItWorks"), padding: "100px 28px" }}>
      <div className="page-container">
        <FadeIn>
          <div className="section-header">
            <Label zone="blue">How it works</Label>
            <h2 style={{
              fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400,
              color: colors.textDark, letterSpacing: "-0.035em",
              lineHeight: 1.15, margin: 0,
            }}>
              Four steps from failure<br />to flowing.
            </h2>
          </div>
        </FadeIn>

        <div className="roadmap">
          {steps.map((s, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <div className="roadmap-row" data-side={i % 2 === 0 ? "left" : "right"}>
                <div className="roadmap-node">
                  <GlassDonutDial size={72} number={i + 1} />
                </div>
                <div className="roadmap-card">
                  <GlassWrap>
                  <NeuCard surface="glass" style={{ position: "relative", zIndex: 1 }}>
                    <span className="roadmap-label">{s.label}</span>
                    <h3 style={{
                      fontSize: "20px", fontWeight: 400, color: colors.textDark,
                      letterSpacing: "-0.02em", margin: "0 0 12px", lineHeight: 1.3,
                    }}>{s.title}</h3>
                    <p style={{ fontSize: "15px", color: colors.textMid, lineHeight: 1.7, margin: 0 }}>{s.body}</p>
                  </NeuCard>
                  </GlassWrap>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Signature card — shared glass panel (Capabilities, Future plans) ─────────
function SignatureCard({ title, body, badge }) {
  return (
    <GlassWrap className="plans-signature-wrap">
      <div className="capabilities-signature plans-signature">
        <NeuCard surface="glass" style={{
          width: "100%", height: "100%", minHeight: 420,
          padding: "28px 32px", boxSizing: "border-box",
          display: "flex", flexDirection: "column", position: "relative", zIndex: 1,
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 24, flexShrink: 0,
          }}>
            <div style={{ display: "flex", gap: 8 }}>
              {["#D7E7D5", "#FDFCD7", "#DCEFF8"].map((c, j) => (
                <div key={j} style={{
                  width: 10, height: 10, borderRadius: "50%", background: c,
                  boxShadow: "0 2px 6px rgba(74, 96, 112, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                }} />
              ))}
            </div>
            <span style={{
              fontSize: "clamp(15px, 1.9vw, 18px)", color: colors.textDark,
              fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase",
              textAlign: "center", flex: 1,
            }}>
              {title}
            </span>
            <KnobRow zone="glass" />
          </div>

          {badge && (
            <span className="plans-signature-badge">{badge}</span>
          )}

          <div className="capabilities-signature-inset glass-carve" style={{
            borderRadius: "16px",
            padding: "28px 32px",
          }}>
            <p className="capabilities-signature-body" style={{
              color: colors.textMid,
              lineHeight: 1.75, margin: 0,
            }}>{body}</p>
          </div>
        </NeuCard>
      </div>
    </GlassWrap>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
function Features() {
  const [active, setActive] = useState(0);
  const bodyRef = useRef(null);
  const listRef = useRef(null);

  const features = [
    {
      icon: "◎",
      title: "Schema contract registry",
      body: "Register one canonical example JSON payload per API endpoint — the shape your service actually expects. When a mismatch fires, mendr does not guess: Claude compares the live request or response against that registered contract and names every field that diverged. Contracts version with your services, so the gateway always heals against current truth, not stale documentation.",
    },
    {
      icon: "◈",
      title: "AI root-cause analysis",
      body: "The moment Service B rejects a call from Service A, mendr captures both payloads and sends them to Claude Haiku. You get a plain-English diagnosis: which field broke, what type or name was expected versus received, and how the failure classifies — field rename, type coercion, missing default, or response mapping. No log spelunking, no 3am Slack thread hunting for the one key that changed.",
    },
    {
      icon: "◉",
      title: "Human approval workflow",
      body: "mendr never applies a fix on its own. Every proposed transformation rule arrives with a confidence score and a clear diff for a human to review. One click approves it; the gateway deploys at runtime. Every rule, approver, and timestamp is logged — fully auditable and reversible. Self-healing does not mean self-governing: your team stays in control of what reaches production.",
    },
    {
      icon: "◌",
      title: "Runtime transformation",
      body: "Approved rules execute at the gateway — field renames, type coercion, missing defaults, response remapping — without touching Service A or Service B and without a redeploy. A TTL expires the temporary rule once your permanent fix ships in a PR. Traffic keeps flowing while engineering works the proper contract update on their own schedule.",
    },
    {
      icon: "◍",
      title: "Dynamic routing",
      body: "When a downstream service moves — new host, new port, new Kubernetes service name — mendr discovers the drift, proposes a routing override, and waits for approval before redirecting traffic. Callers do not need config changes or redeploys. The gateway absorbs the move so your mesh keeps talking while infrastructure shifts underneath it.",
    },
    {
      icon: "◎",
      title: "CORS healing",
      body: "Service A migrates to a new origin; Service B's allowlist still points at the old one. Browsers block the call before it even reaches your API. mendr spots the caller-origin change, proposes an allowlist patch, and applies it after approval — restoring cross-origin traffic without an emergency deploy on either service.",
    },
  ];

  const current = features[active];

  useLayoutEffect(() => {
    const lockCardHeight = () => {
      if (!bodyRef.current || !listRef.current) return;
      bodyRef.current.style.setProperty(
        "--capabilities-card-height",
        `${listRef.current.offsetHeight}px`
      );
    };

    lockCardHeight();
    window.addEventListener("resize", lockCardHeight);
    return () => window.removeEventListener("resize", lockCardHeight);
  }, []);

  return (
    <section id="features" className="section-scene features-section" style={{ ...sectionSceneStyle("features"), padding: "100px 28px" }}>
      <div className="page-container">
        <div className="capabilities-header">
          <FadeIn>
            <Label zone="blue">Capabilities</Label>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="capabilities-headline" style={{
              fontWeight: 400,
              color: colors.textDark, letterSpacing: "-0.04em",
              lineHeight: 1.1, margin: "0 0 20px",
            }}>
              Everything your services need to keep talking.
            </h2>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p style={{
              fontSize: "clamp(16px, 2.2vw, 19px)", color: colors.textMid,
              lineHeight: 1.7, margin: 0,
            }}>
              Select a capability to see how mendr keeps your microservices in sync.
            </p>
          </FadeIn>
        </div>

        <div className="hero-body capabilities-body" ref={bodyRef}>
          <div className="capabilities-nav">
            <div className="capabilities-list" ref={listRef}>
              {features.map((f, i) => (
                <button
                  key={i}
                  type="button"
                  className={`capabilities-item${active === i ? " active" : ""}`}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                >
                  <span className="capabilities-icon">{f.icon}</span>
                  <span className="capabilities-title">{f.title}</span>
                </button>
              ))}
            </div>
          </div>

          <FadeIn delay={0.25} className="capabilities-card-col">
            <GlassWrap className="hero-widget capabilities-card">
              <div className="capabilities-signature">
              <NeuCard surface="glass" style={{ width: "100%", height: "100%", padding: "28px 32px", boxSizing: "border-box", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginBottom: 24, flexShrink: 0,
                }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["#D7E7D5", "#FDFCD7", "#DCEFF8"].map((c, j) => (
                      <div key={j} style={{
                        width: 10, height: 10, borderRadius: "50%", background: c,
                        boxShadow: "0 2px 6px rgba(74, 96, 112, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                      }} />
                    ))}
                  </div>
                  <span style={{
                    fontSize: "clamp(15px, 1.9vw, 18px)", color: colors.textDark,
                    fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase",
                    textAlign: "center", flex: 1,
                  }}>
                    {current.title}
                  </span>
                  <KnobRow zone="glass" />
                </div>

                <div className="capabilities-signature-inset glass-carve" style={{
                  borderRadius: "16px",
                  padding: "28px 32px",
                }}>
                  <p className="capabilities-signature-body" style={{
                    color: colors.textMid,
                    lineHeight: 1.75, margin: 0,
                  }}>{current.body}</p>
                </div>
              </NeuCard>
              </div>
            </GlassWrap>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ── Future plans carousel ─────────────────────────────────────────────────────
const FUTURE_PLANS = [
  {
    title: "Envoy sidecar mesh",
    badge: "In research",
    body: "Extend mendr beyond the gateway with native Envoy sidecar injection — healing contract drift at every hop in the mesh, not just at the edge. Same human-approved rules, deployed closer to the services that need them.",
  },
  {
    title: "CI contract gates",
    badge: "Designing",
    body: "Block merges when a service's OpenAPI or payload shape drifts from its registered contract. mendr compares PR artifacts against the registry and surfaces diffs before broken code reaches staging.",
  },
  {
    title: "Drift dashboard",
    badge: "Building",
    body: "A live topology map of every service-to-service contract — green when aligned, amber when healing is active, red when approval is pending. One screen for platform teams to see mesh health at a glance.",
  },
  {
    title: "OpenAPI sync",
    badge: "On the roadmap",
    body: "Auto-generate and publish OpenAPI specs from registered example payloads. When a contract updates, documentation and client SDKs stay in sync without a separate docs pipeline.",
  },
  {
    title: "Slack & Teams approvals",
    badge: "Q3 2026",
    body: "Route healing proposals directly to your team's chat channel with a confidence score, field diff, and one-click approve or reject — no context-switching to a separate dashboard during an incident.",
  },
  {
    title: "Multi-cluster federation",
    badge: "Q4 2026",
    body: "Sync the contract registry across regions and Kubernetes clusters so a rule approved in us-east applies consistently in eu-west. One source of truth for global microservice traffic.",
  },
];

const PLAN_COUNT = FUTURE_PLANS.length;

function FuturePlans() {
  const carouselSlides = useMemo(() => [
    { plan: FUTURE_PLANS[PLAN_COUNT - 1], slideKey: "clone-last" },
    ...FUTURE_PLANS.map((plan) => ({ plan, slideKey: plan.title })),
    { plan: FUTURE_PLANS[0], slideKey: "clone-first" },
  ], []);

  const [slideIndex, setSlideIndex] = useState(1);
  const [animated, setAnimated] = useState(true);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [trackX, setTrackX] = useState(0);
  const busyRef = useRef(false);

  const logicalActive = slideIndex === 0
    ? PLAN_COUNT - 1
    : slideIndex === PLAN_COUNT + 1
      ? 0
      : slideIndex - 1;

  const syncTrack = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const slide = track?.children[slideIndex];
    if (!viewport || !slide) return;
    const offset = slide.offsetLeft - (viewport.offsetWidth - slide.offsetWidth) / 2;
    setTrackX(offset);
  }, [slideIndex]);

  useLayoutEffect(() => {
    syncTrack();
    const ro = new ResizeObserver(syncTrack);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", syncTrack);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncTrack);
    };
  }, [syncTrack]);

  const jumpWithoutAnimation = useCallback((nextIndex) => {
    setAnimated(false);
    setSlideIndex(nextIndex);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimated(true);
        busyRef.current = false;
      });
    });
  }, []);

  const handleTrackTransitionEnd = (e) => {
    if (e.propertyName !== "transform" || e.target !== e.currentTarget) return;
    if (slideIndex === 0) jumpWithoutAnimation(PLAN_COUNT);
    else if (slideIndex === PLAN_COUNT + 1) jumpWithoutAnimation(1);
    else busyRef.current = false;
  };

  const go = (dir) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setAnimated(true);
    setSlideIndex((i) => {
      const next = i + dir;
      // clamp to the clone range [0 … PLAN_COUNT+1] so DOM access is always valid
      return Math.max(0, Math.min(PLAN_COUNT + 1, next));
    });
  };

  const goToPlan = (planIndex) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setAnimated(true);
    setSlideIndex(planIndex + 1);
  };

  return (
    <section id="future-plans" className="section-scene" style={{ ...sectionSceneStyle("futurePlans"), padding: "100px 28px" }}>
      <div className="page-container">
        <FadeIn>
          <div className="section-header">
            <Label zone="blue">Future plans</Label>
            <h2 style={{
              fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400,
              color: colors.textDark, letterSpacing: "-0.035em",
              lineHeight: 1.15, margin: 0,
            }}>
              What we're building next.
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="plans-carousel-lead" style={{
            fontSize: "clamp(16px, 2.2vw, 19px)", color: colors.textMid,
            lineHeight: 1.7, margin: "0 auto 40px", maxWidth: 640, textAlign: "center",
          }}>
            Six features on the roadmap — swipe through what mendr is working on beyond today's gateway.
          </p>
        </FadeIn>

        <div className="plans-carousel">
          <button
            type="button"
            className="plans-carousel-arrow plans-carousel-arrow--prev"
            onClick={() => go(-1)}
            aria-label="Previous feature"
          >
            ‹
          </button>

          <div className="plans-carousel-viewport" ref={viewportRef}>
            <div
              className={`plans-carousel-track${animated ? "" : " plans-carousel-track--instant"}`}
              ref={trackRef}
              style={{ transform: `translateX(${-trackX}px)` }}
              onTransitionEnd={handleTrackTransitionEnd}
            >
              {carouselSlides.map((item, i) => (
                <div
                  key={item.slideKey}
                  className={`plans-carousel-slide${i === slideIndex ? " is-active" : ""}`}
                  aria-hidden={i !== slideIndex}
                >
                  <SignatureCard title={item.plan.title} body={item.plan.body} badge={item.plan.badge} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="plans-carousel-arrow plans-carousel-arrow--next"
            onClick={() => go(1)}
            aria-label="Next feature"
          >
            ›
          </button>
        </div>

        <div className="plans-carousel-dots" role="tablist" aria-label="Future plans">
          {FUTURE_PLANS.map((plan, i) => (
            <button
              key={plan.title}
              type="button"
              role="tab"
              className={`plans-carousel-dot${i === logicalActive ? " is-active" : ""}`}
              aria-selected={i === logicalActive}
              aria-label={plan.title}
              onClick={() => goToPlan(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact ────────────────────────────────────────────────────────────────────
const ENGINEERING_BULLETS = [
  "Zero code changes to your existing services",
  "Works with Spring Boot, Node.js, Python, Go",
  "Full audit log — every rule, every approver",
  "Kubernetes-native with Helm chart deployment",
];

const INVESTOR_BULLETS = [
  "No comparable product in market — first-mover position",
  "Platform play: one gateway, every service-to-service call",
  "Natural expansion path to sidecar mesh and Envoy integration",
  "Dogfooding: mendr manages its own internal service traffic",
];

function AudienceSideCard({ variant, title, description, bullets, bulletAccent = "accent" }) {
  const bulletStyle = bulletAccent === "accent"
    ? { background: colors.accent, boxShadow: neu.raisedAccent }
    : { background: surfaces.blue.panel, boxShadow: surfaces.blue.shadows.panelRaised };

  return (
    <aside className={`contact-audience-card contact-audience-card--${variant}`}>
      <GlassWrap className="contact-audience-card-shell">
        <NeuCard surface="glass" style={{
          padding: "40px",
          borderRadius: "28px",
          position: "relative",
          height: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.35)",
        }}>
          <h3 style={{
            fontSize: "22px", fontWeight: 400, color: colors.textDark,
            letterSpacing: "-0.025em", margin: "0 0 12px",
          }}>{title}</h3>
          <p style={{ fontSize: "15px", color: colors.textMid, lineHeight: 1.7, marginBottom: 18 }}>
            {description}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {bullets.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  marginTop: 7, flexShrink: 0,
                  ...bulletStyle,
                }} />
                <span style={{ fontSize: "14px", color: colors.textMid, lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </NeuCard>
      </GlassWrap>
    </aside>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);
  const stageRef = useRef(null);
  const formCardRef = useRef(null);

  useLayoutEffect(() => {
    if (submitted) return undefined;

    const syncCardSize = () => {
      const form = formCardRef.current;
      const stage = stageRef.current;
      if (!form || !stage) return;
      stage.style.setProperty("--contact-card-w", `${form.offsetWidth}px`);
      stage.style.setProperty("--contact-card-h", `${form.offsetHeight}px`);
    };

    syncCardSize();
    const ro = new ResizeObserver(syncCardSize);
    if (formCardRef.current) ro.observe(formCardRef.current);
    window.addEventListener("resize", syncCardSize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncCardSize);
    };
  }, [submitted]);

  const inputStyle = (field) => ({
    width: "100%", boxSizing: "border-box",
    background: glass.carveBg,
    boxShadow: focused === field
      ? `${glass.carveShadow}, ${glass.ringFocus}`
      : glass.carveShadow,
    border: "none", borderRadius: "16px",
    padding: "14px 18px",
    fontSize: "15px",
    color: colors.textDark,
    outline: "none",
    fontFamily: "inherit",
    transition: "box-shadow 0.2s ease",
    caretColor: colors.textDark,
  });

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="section-scene" style={{ ...sectionSceneStyle("contact"), padding: "100px 28px" }}>
      <div className="page-container">
        <FadeIn>
          <div className="section-header contact-header" style={{ marginBottom: 28 }}>
            <Label>Get in touch</Label>
            <h2 style={{
              fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400,
              color: colors.textDark, letterSpacing: "-0.035em",
              lineHeight: 1.15, margin: "0 0 16px",
            }}>
              Let's talk about<br />your infrastructure.
            </h2>
            <p style={{ fontSize: "17px", color: colors.textMid, lineHeight: 1.7, margin: 0 }}>
              Whether you're an engineering leader, enterprise buyer, or investor —
              we'd like to hear from you.
            </p>
          </div>
        </FadeIn>

        {submitted ? (
          <FadeIn>
            <div className="contact-cards-stage contact-cards-stage--submitted">
              <GlassWrap>
              <NeuCard surface="glass" style={{ padding: "60px 40px", textAlign: "center", position: "relative", zIndex: 1 }}>
                <DialOrnament size={72} accent zone="glass" />
                <h3 style={{
                  fontSize: "24px", fontWeight: 400, color: colors.textDark,
                  margin: "24px 0 12px",
                }}>Message received.</h3>
                <p style={{ fontSize: "16px", color: colors.textMid, lineHeight: 1.7, margin: 0 }}>
                  We'll be in touch within one business day.
                </p>
              </NeuCard>
              </GlassWrap>
            </div>
          </FadeIn>
        ) : (
          <FadeIn delay={0.1}>
            <div className="contact-cards-stage" ref={stageRef}>
              <AudienceSideCard
                variant="teams"
                title="For engineering teams"
                description="Stop losing Sundays to schema incidents. mendr sits in your gateway, watches for contract drift, and gives your team a one-click fix before customers notice anything is wrong."
                bullets={ENGINEERING_BULLETS}
                bulletAccent="accent"
              />

              <div className="contact-form-card" ref={formCardRef}>
                <GlassWrap>
                <NeuCard surface="glass" style={{
                  padding: "40px",
                  display: "flex", flexDirection: "column", gap: "20px",
                  position: "relative",
                }}>
                  <div className="grid-2">
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: colors.textMuted, marginBottom: "8px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Name</label>
                      <input
                        style={inputStyle("name")}
                        placeholder="Your name"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused(null)}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: colors.textMuted, marginBottom: "8px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Email</label>
                      <input
                        style={inputStyle("email")}
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: colors.textMuted, marginBottom: "8px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Company</label>
                    <input
                      style={inputStyle("company")}
                      placeholder="Company or organisation"
                      value={form.company}
                      onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                      onFocus={() => setFocused("company")}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: colors.textMuted, marginBottom: "8px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Message</label>
                    <textarea
                      style={{ ...inputStyle("message"), resize: "none", minHeight: "120px" }}
                      placeholder="Tell us about your setup — number of services, current pain, or investment interest."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                  <NeuButton variant="primary" onClick={handleSubmit} style={{ alignSelf: "flex-start", padding: "14px 36px" }}>
                    Send message
                  </NeuButton>
                </NeuCard>
                </GlassWrap>
              </div>

              <AudienceSideCard
                variant="investors"
                title="For investors"
                description="The service mesh market is $6B and growing. Every enterprise with microservices has this problem. mendr is the first product to bring AI-driven, human-approved self-healing to the API contract layer."
                bullets={INVESTOR_BULLETS}
                bulletAccent="blue"
              />
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="grille" style={{
      background: colors.primary,
      padding: "48px 28px 56px",
      position: "relative",
      zIndex: 1,
    }}>
      <div className="page-container footer-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: colors.primary, boxShadow: neu.raised,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: colors.primary, boxShadow: neu.inset }} />
          </div>
          <span style={{ fontSize: "16px", fontWeight: 500, color: colors.textDark, letterSpacing: "-0.03em" }}>mendr</span>
        </div>

        <div style={{ display: "flex", gap: "28px" }}>
          {["Privacy", "Terms", "Security", "Contact"].map(l => (
            <a key={l} href="#" style={{ fontSize: "13px", color: colors.textMuted, textDecoration: "none" }}>{l}</a>
          ))}
        </div>

        <p style={{ fontSize: "12px", color: colors.textMuted, margin: 0 }}>
          © 2025 mendr. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
function AppContent() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Inter Tight', system-ui, -apple-system, sans-serif;
          background: var(--wash-color, ${palette.primary});
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        ::selection { background: ${palette.accent}; color: #2c3a42; }

        .page-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .contact-header {
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
        }

        .contact-cards-stage {
          position: relative;
          max-width: 100%;
          margin: 0 auto;
          min-height: var(--contact-card-h, 480px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px 0 32px;
        }

        .contact-cards-stage--submitted {
          min-height: auto;
          max-width: 640px;
        }

        .contact-form-card {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 520px;
          flex-shrink: 0;
          transition: transform 0.35s ease;
        }

        .contact-audience-card {
          position: absolute;
          top: 50%;
          width: var(--contact-card-w, 520px);
          height: var(--contact-card-h, auto);
          max-width: 520px;
          z-index: 2;
          overflow: hidden;
          transform: translateY(-50%);
          transition: transform 0.35s ease, z-index 0s step-end;
        }

        .contact-audience-card-shell {
          height: 100%;
        }

        .contact-audience-card-shell .glass-aura {
          display: none;
        }

        .contact-audience-card .glass-card {
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35) !important;
        }

        .contact-audience-card--teams {
          left: 0;
        }

        .contact-audience-card--investors {
          right: 0;
        }

        .contact-audience-card--teams:hover {
          z-index: 5;
          transform: translateY(calc(-50% - 8px));
          transition: transform 0.35s ease, z-index 0s step-start;
        }

        .contact-audience-card--investors:hover {
          z-index: 5;
          transform: translateY(calc(-50% - 8px));
          transition: transform 0.35s ease, z-index 0s step-start;
        }

        .contact-cards-stage:has(.contact-audience-card--teams:hover) .contact-form-card,
        .contact-cards-stage:has(.contact-audience-card--investors:hover) .contact-form-card {
          z-index: 3;
          transform: scale(0.96);
        }

        .contact-cards-stage:has(.contact-audience-card--teams:hover) .contact-audience-card--investors {
          z-index: 1;
        }

        .contact-cards-stage:has(.contact-audience-card--investors:hover) .contact-audience-card--teams {
          z-index: 1;
        }

        .footer-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        /* Hero: full-width headline, then paragraph + widget row */
        .hero-stack {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .hero-eyebrow {
          display: flex;
          justify-content: center;
        }

        .hero-headline {
          width: 100%;
          text-align: center;
          font-size: clamp(48px, 7.5vw, 88px);
        }

        .hero-body {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 48px;
          align-items: start;
        }

        .hero-copy-col {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .hero-widget { width: 100%; min-width: 0; }

        .problem-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
          margin-top: 28px;
        }

        .problem-stat {
          flex: 1 1 120px;
          min-width: 0;
        }

        .problem-stat-num {
          font-size: clamp(30px, calc(4.5vw - 2px), 54px);
          font-weight: 400;
          letter-spacing: -0.04em;
          color: ${colors.accentDark};
          line-height: 1.1;
          margin-bottom: 8px;
        }

        .problem-stat-desc {
          font-size: clamp(14px, 2vw, 17px);
          color: ${colors.textMid};
          line-height: 1.7;
        }

        .glass-wrap {
          position: relative;
        }

        .glass-aura {
          position: absolute;
          inset: -12% -8%;
          z-index: 0;
          pointer-events: none;
          background: ${palette.primary};
          opacity: 0.35;
          filter: blur(60px);
          border-radius: 40px;
        }

        .glass-card {
          background: ${glass.shell} !important;
          backdrop-filter: ${glass.blur};
          -webkit-backdrop-filter: ${glass.blur};
        }

        .glass-carve {
          background: ${glass.carveBg};
          border: none;
          box-shadow: ${glass.carveShadow};
        }

        @supports not (backdrop-filter: blur(1px)) {
          .glass-card {
            background: ${glass.shellFallback} !important;
          }

          .glass-carve {
            background: ${glass.panelFallback} !important;
            box-shadow: inset 4px 4px 12px rgba(74, 96, 112, 0.14), inset -3px -3px 10px rgba(232, 244, 250, 0.6) !important;
          }
        }

        .roadmap {
          position: relative;
          padding: 8px 0 16px;
        }

        .roadmap > div {
          width: 100%;
        }

        .roadmap::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          transform: translateX(-50%);
          background-image: repeating-linear-gradient(
            to bottom,
            #9BB8CC 0 6px,
            transparent 6px 14px
          );
          z-index: 0;
          pointer-events: none;
        }

        .roadmap-row {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 32px;
          margin-bottom: 48px;
          position: relative;
        }

        .roadmap-row:last-child {
          margin-bottom: 0;
        }

        .roadmap-row[data-side="left"] .roadmap-card {
          grid-column: 1;
          grid-row: 1;
          align-self: center;
          text-align: right;
        }

        .roadmap-row[data-side="left"] .roadmap-node {
          grid-column: 2;
          grid-row: 1;
          align-self: center;
          justify-self: center;
        }

        .roadmap-row[data-side="right"] .roadmap-card {
          grid-column: 3;
          grid-row: 1;
          align-self: center;
          text-align: left;
        }

        .roadmap-row[data-side="right"] .roadmap-node {
          grid-column: 2;
          grid-row: 1;
          align-self: center;
          justify-self: center;
        }

        .roadmap-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${colors.textMuted};
          margin-bottom: 16px;
        }

        .roadmap-node {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
        }

        .glass-donut-num {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 17px;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: ${colors.textMid};
          line-height: 1;
          z-index: 2;
          pointer-events: none;
        }

        .glass-ring {
          background: transparent;
          box-shadow: ${glass.ring};
          backdrop-filter: ${glass.blur};
          -webkit-backdrop-filter: ${glass.blur};
        }

        .roadmap-node-inner {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-radius: 50%;
          padding: 4px;
        }

        .roadmap-node-inner:not(.glass-ring) {
          background: ${palette.accent};
          box-shadow: 0 0 0 8px ${palette.accent};
        }

        .section-scene {
          position: relative;
          isolation: isolate;
          background: transparent;
        }

        .section-scene::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          background-image: var(--scene-image);
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          background-attachment: scroll;
          opacity: 0.2;
          pointer-events: none;
        }

        .section-scene > * {
          position: relative;
          z-index: 1;
        }

        .capabilities-header {
          margin-bottom: 40px;
        }

        .capabilities-headline {
          font-size: clamp(32px, 4.5vw, 56px);
          max-width: 100%;
        }

        .capabilities-body {
          align-items: start;
          --capabilities-card-height: auto;
        }

        .capabilities-card-col {
          height: var(--capabilities-card-height);
          max-height: var(--capabilities-card-height);
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .capabilities-nav {
          display: flex;
          flex-direction: column;
        }

        .capabilities-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .capabilities-item {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          text-align: left;
          padding: 14px 18px;
          border: none;
          border-radius: 16px;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }

        .capabilities-item:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .capabilities-item.active {
          background: ${glass.shell};
          backdrop-filter: ${glass.blur};
          -webkit-backdrop-filter: ${glass.blur};
          box-shadow: ${glass.shadow};
          border: 1px solid ${glass.borderSoft};
        }

        .capabilities-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: ${glass.bumpBg};
          backdrop-filter: ${glass.blur};
          -webkit-backdrop-filter: ${glass.blur};
          box-shadow: ${glass.bumpRaised};
          border: 1px solid ${glass.borderSoft};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: ${colors.textMid};
          flex-shrink: 0;
        }

        .capabilities-item.active .capabilities-icon {
          background: ${glass.bumpAccent};
          box-shadow: ${glass.bumpInset}, ${glass.knobGlowAccent};
        }

        .capabilities-title {
          font-size: clamp(16px, 2vw, 18px);
          font-weight: 500;
          color: ${colors.textDark};
          letter-spacing: -0.01em;
          line-height: 1.4;
        }

        .capabilities-item:not(.active) .capabilities-title {
          font-weight: 400;
          color: ${colors.textMid};
        }

        .capabilities-card {
          flex: 1;
          height: var(--capabilities-card-height);
          max-height: var(--capabilities-card-height);
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .capabilities-signature {
          flex: 1;
          height: 100%;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }

        .capabilities-signature > div {
          flex: 1;
          height: 100%;
          min-height: 0;
        }

        .capabilities-signature-inset {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .capabilities-signature-body {
          font-size: clamp(15px, 2.1vw, 18px);
        }

        .capabilities-signature-inset p {
          flex: 1;
        }

        .plans-signature-wrap {
          height: 100%;
        }

        .plans-signature {
          min-height: 420px;
        }

        .plans-signature-badge {
          display: inline-flex;
          align-self: flex-start;
          margin: -8px 0 16px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: ${colors.textDark};
          background: ${palette.accent};
          box-shadow: ${neu.raisedAccent};
        }

        .plans-carousel {
          display: flex;
          align-items: center;
          gap: clamp(12px, 2vw, 24px);
        }

        .plans-carousel-viewport {
          flex: 1;
          overflow: hidden;
          min-width: 0;
          padding: 12px 0 20px;
        }

        .plans-carousel-track {
          display: flex;
          gap: 28px;
          transition: transform 0.55s cubic-bezier(0.34, 1.1, 0.64, 1);
          will-change: transform;
        }

        .plans-carousel-track--instant {
          transition: none !important;
        }

        .plans-carousel-slide {
          flex: 0 0 min(480px, 78vw);
          opacity: 0.45;
          transform: scale(0.94);
          transition: opacity 0.45s ease, transform 0.45s ease;
          filter: blur(0.6px);
        }

        .plans-carousel-slide.is-active {
          opacity: 1;
          transform: scale(1);
          filter: none;
        }

        .plans-carousel-arrow {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          font-size: 28px;
          line-height: 1;
          color: ${colors.textDark};
          background: ${glass.shell};
          backdrop-filter: ${glass.blur};
          -webkit-backdrop-filter: ${glass.blur};
          box-shadow: ${glass.shadow};
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .plans-carousel-arrow:hover:not(:disabled) {
          transform: scale(1.06);
        }

        .plans-carousel-arrow:disabled {
          opacity: 0.35;
          cursor: default;
        }

        .plans-carousel-dots {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 28px;
        }

        .plans-carousel-dot {
          width: 8px;
          height: 8px;
          padding: 0;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          background: rgba(74, 96, 112, 0.25);
          transition: transform 0.25s ease, background 0.25s ease;
        }

        .plans-carousel-dot.is-active {
          background: ${colors.textDark};
          transform: scale(1.35);
        }

        /* Speaker-grille dot texture on footer */
        .grille {
          background-image: radial-gradient(rgba(74, 96, 112, 0.05) 1px, transparent 1px);
          background-size: 22px 22px;
        }

        /* Japandi ultra-light noise grain — unused on scene sections */
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        }

        @media (max-width: 900px) {
          .hero-body { grid-template-columns: 1fr; gap: 40px; }
          .hero-headline { font-size: clamp(40px, 9vw, 64px); }

          .contact-cards-stage {
            flex-direction: column;
            min-height: auto;
            gap: 20px;
            padding: 0;
          }

          .contact-audience-card {
            position: relative;
            top: auto;
            left: auto !important;
            right: auto !important;
            width: 100% !important;
            height: auto !important;
            max-width: 520px;
            overflow: visible;
            transform: none !important;
          }

          .contact-audience-card-shell {
            height: auto;
          }

          .contact-audience-card--teams { order: 2; }
          .contact-form-card { order: 1; max-width: 100%; }
          .contact-audience-card--investors { order: 3; }

          .contact-cards-stage:has(.contact-audience-card--teams:hover) .contact-form-card,
          .contact-cards-stage:has(.contact-audience-card--investors:hover) .contact-form-card {
            transform: none;
          }

          .roadmap::before {
            left: 32px;
            transform: none;
          }

          .roadmap-row {
            grid-template-columns: auto 1fr;
            gap: 20px;
            margin-bottom: 36px;
          }

          .roadmap-row[data-side="left"] .roadmap-card,
          .roadmap-row[data-side="right"] .roadmap-card {
            grid-column: 2;
            text-align: left;
          }

          .roadmap-row[data-side="left"] .roadmap-node,
          .roadmap-row[data-side="right"] .roadmap-node {
            grid-column: 1;
            grid-row: 1;
          }

          .capabilities-body {
            align-items: start;
          }

          .capabilities-nav,
          .capabilities-card-col,
          .capabilities-card,
          .capabilities-signature,
          .capabilities-body {
            height: auto;
            min-height: 0;
            max-height: none;
          }

          .capabilities-signature {
            min-height: 360px;
          }

          .plans-carousel {
            flex-direction: column;
          }

          .plans-carousel-arrow--prev { order: 2; }
          .plans-carousel-viewport { order: 1; width: 100%; }
          .plans-carousel-arrow--next { order: 3; }

          .plans-carousel-arrow {
            width: 44px;
            height: 44px;
          }

          .plans-carousel-slide {
            flex: 0 0 min(420px, 88vw);
          }
        }

        @media (max-width: 768px) {
          .grid-2, .grid-3 { grid-template-columns: 1fr !important; }
          .footer-bar { flex-direction: column; text-align: center; }
          .nav-links a { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; animation: none !important; }
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--wash-color, ${palette.primary}); }
        ::-webkit-scrollbar-thumb { background: #b8ccd4; border-radius: 3px; }
      `}</style>

      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />
        <main>
          <Hero />
          <Problem />
          <HowItWorks />
          <Features />
          <FuturePlans />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ScrollAtmosphereProvider>
      <AppContent />
    </ScrollAtmosphereProvider>
  );
}
