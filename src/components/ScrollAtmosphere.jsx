import { createContext, useContext, useEffect, useState, useRef } from "react";
import { palette } from "../design-tokens";
import {
  measureSections,
  getJourneyState,
  getReducedMotionWash,
  getNeuShadowFromWashRgb,
} from "../lib/journey-scroll";

const AtmosphereContext = createContext({
  journeyIndex: 0,
  washColor: palette.primary,
  washBackground: palette.primary,
  washRgb: "220, 239, 248",
  activeSection: "hero",
});

export function useAtmosphere() {
  return useContext(AtmosphereContext);
}

/**
 * Fixed wash layer interpolates theme colors smoothly on scroll.
 * Section images (36% opacity) scroll with their content on top.
 */
export function ScrollAtmosphereProvider({ children }) {
  const washRef = useRef(null);
  const lastContextRef = useRef("");
  const sectionsRef = useRef([]);

  const [contextState, setContextState] = useState({
    journeyIndex: 0,
    washColor: palette.primary,
    washBackground: palette.primary,
    washRgb: "220, 239, 248",
    activeSection: "hero",
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const refreshSections = () => {
      sectionsRef.current = measureSections();
    };

    const tick = () => {
      const isReduced = mq.matches;
      const sections = sectionsRef.current;
      const scrollY = window.scrollY;
      const state = getJourneyState(scrollY, sections);

      const wash = isReduced ? getReducedMotionWash() : state.washBackground;
      const washRgb = isReduced ? "237, 227, 194" : state.washRgb;
      const washColor = isReduced ? getReducedMotionWash() : state.washColor;

      if (washRef.current) {
        washRef.current.style.background = wash;
      }

      document.documentElement.style.setProperty("--wash-color", washColor);
      document.documentElement.style.setProperty("--wash-rgb", washRgb);
      document.documentElement.style.setProperty(
        "--nav-shadow",
        getNeuShadowFromWashRgb(washRgb, "raised")
      );
      document.documentElement.style.setProperty(
        "--nav-shadow-lg",
        getNeuShadowFromWashRgb(washRgb, "raisedLg")
      );
      document.documentElement.style.setProperty(
        "--nav-inset",
        getNeuShadowFromWashRgb(washRgb, "inset")
      );

      const contextKey = `${state.activeSection}-${Math.round(state.journeyIndex * 40)}`;
      if (contextKey !== lastContextRef.current) {
        lastContextRef.current = contextKey;
        setContextState({
          journeyIndex: state.journeyIndex,
          washColor,
          washBackground: wash,
          washRgb,
          activeSection: state.activeSection,
        });
      }
    };

    let rafId = 0;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(() => {
          tick();
          ticking = false;
        });
      }
    };

    const onResize = () => {
      refreshSections();
      onScroll();
    };

    const onMotionChange = () => onScroll();

    refreshSections();
    mq.addEventListener("change", onMotionChange);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    tick();

    return () => {
      mq.removeEventListener("change", onMotionChange);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <AtmosphereContext.Provider value={contextState}>
      <div
        ref={washRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: palette.primary,
        }}
      />
      {children}
    </AtmosphereContext.Provider>
  );
}
