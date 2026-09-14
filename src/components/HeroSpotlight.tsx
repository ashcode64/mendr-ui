import { useLayoutEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
}

/*
 * Yin-yang counter-current spotlights.
 *
 * Each blob is a mass on a radial spring around the cursor. The spring's rest
 * length (`target`) is the MEAN of the two blob distances, so the system's
 * equilibrium is "both equidistant from the cursor" (reference image 3). The
 * two springs are anti-phase coupled: the coupling term drives the SUM of the
 * radial velocities to zero, so one blob moving inward forces the other
 * outward. Working the algebra through, the coupling cancels out of the
 * DIFFERENCE of the distances, leaving that difference as a lightly-damped
 * undamped spring -> it oscillates, so the blobs perpetually swap sides
 * (images 1 <-> 2) while the mean distance is regulated toward a preferred
 * radius. An energy floor pumps the swing so it never dies while the pointer
 * is inside. Everything is integrated in one rAF loop writing translate3d
 * directly to the DOM -- no React re-render or layout per frame.
 */

// --- Tunables (pixels, seconds) ---
const K = 26 // radial spring stiffness (1/s^2); natural period ~= 2*pi/sqrt(K)
const COUPLE = 2.6 // anti-phase coupling: damps the common (sum) mode
const DAMPING = 0.99 // velocity retained per 60fps-frame (light -> keeps oscillating)
const V_MAX = 2600 // speed clamp (px/s) so injected cursor energy can't blow up
const ANCHOR = 0.22 // blend the mean-distance target toward the preferred radius
const PREFERRED_RADIUS_FACTOR = 0.3 // preferred radius = factor * min(width, height)
const MIN_SEP = 2 // hard numerical floor so the two centers never fully coincide (px)
const BOUNDS_PAD = 0.16 // containment padding as a fraction of each dimension
const ENERGY_FLOOR = 150 // total speed below which we pump the swing (px/s)
const ENERGY_KICK = 300 // pump impulse magnitude (px/s)
const MAX_DT = 1 / 30 // clamp frame delta so 60/120Hz behave the same and stalls don't lurch
const TIME_SCALE = 0.7 // global slow-motion factor (1 = real time); scales all blob movement

// Return-to-home spring (used after the pointer leaves)
const HOME_K = 30
const HOME_DAMPING = 0.8

// Default (home) positions as fractions of the hero rect
const HOME_BLUE = { x: 0.2, y: 0.3 }
const HOME_CREAM = { x: 0.65, y: 0.55 }

// Blob box sizes (must match the JSX width/height below) and effective visible
// radius -- the gradient fades to transparent at 70% of the half-size, so the
// visible disc radius is 70% of half the box.
const BLUE_SIZE = 700
const CREAM_SIZE = 560
const VISUAL_RADIUS_FACTOR = 0.7
const R_BLUE = (BLUE_SIZE / 2) * VISUAL_RADIUS_FACTOR // ~245
const R_CREAM = (CREAM_SIZE / 2) * VISUAL_RADIUS_FACTOR // ~196
const SEP_TANGENT = R_BLUE + R_CREAM // center distance at which the two discs just touch

// Overlap repulsion. A gentle, always-on penetration push holds the blobs
// tangent (never resting stacked); once the smaller blob is >70% covered we
// engage a boosted opposite-direction thrust and hold it until they no longer
// overlap, so heavily-stacked blobs decisively fly apart to opposite sides.
const OVERLAP_ENGAGE = 0.7 // fraction of the smaller disc covered to start separating
const OVERLAP_RELEASE = 0.02 // fraction at which separation is considered resolved
const SEP_K = 45 // repulsion stiffness (above K so it wins over the radial spring)
const SEP_BOOST = 2.2 // extra thrust multiplier while actively separating
const V_MAX_SEPARATING = 3600 // raised speed cap during the separation burst (px/s)

type Vec = { x: number; y: number }

// Exact circular-lens intersection area as a fraction of the SMALLER disc, so
// "overlap more than 70%" literally means "more than 70% of the smaller blob is
// covered". Returns 0 when apart and 1 when one disc is fully inside the other.
function overlapFraction(d: number): number {
  const r1 = R_BLUE
  const r2 = R_CREAM
  if (d >= r1 + r2) return 0
  const rmin = Math.min(r1, r2)
  if (d <= Math.abs(r1 - r2)) return 1
  const a1 = r1 * r1 * Math.acos((d * d + r1 * r1 - r2 * r2) / (2 * d * r1))
  const a2 = r2 * r2 * Math.acos((d * d + r2 * r2 - r1 * r1) / (2 * d * r2))
  const tri =
    0.5 * Math.sqrt((-d + r1 + r2) * (d + r1 - r2) * (d - r1 + r2) * (d + r1 + r2))
  return (a1 + a2 - tri) / (Math.PI * rmin * rmin)
}

export default function HeroSpotlight({ children, className = '' }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const blueRef = useRef<HTMLDivElement>(null)
  const creamRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const blueEl = blueRef.current
    const creamEl = creamRef.current
    if (!section || !blueEl || !creamEl) return

    const mq =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null

    const dims = { w: section.clientWidth || 1, h: section.clientHeight || 1 }
    const homeBlue = (): Vec => ({ x: HOME_BLUE.x * dims.w, y: HOME_BLUE.y * dims.h })
    const homeCream = (): Vec => ({ x: HOME_CREAM.x * dims.w, y: HOME_CREAM.y * dims.h })

    const pBlue: Vec = homeBlue()
    const pCream: Vec = homeCream()
    const vBlue: Vec = { x: 0, y: 0 }
    const vCream: Vec = { x: 0, y: 0 }
    // Retained radial unit vectors so a blob passes cleanly through the cursor.
    const uBlue: Vec = { x: 1, y: 0 }
    const uCream: Vec = { x: -1, y: 0 }
    const cursor: Vec = { x: dims.w / 2, y: dims.h / 2 }

    let mode: 'idle' | 'active' | 'returning' = 'idle'
    let rafId = 0
    let last = 0
    let visible = true
    // Overlap-separation state. `separating` latches on once heavily stacked and
    // releases only when clear; `sepAxis` is the persistent push direction
    // (points from cream toward blue) so a valid axis survives coincident centers.
    let separating = false
    const sepAxis: Vec = { x: 1, y: 0 }

    const paint = () => {
      blueEl.style.transform = `translate3d(${pBlue.x}px, ${pBlue.y}px, 0) translate(-50%, -50%)`
      creamEl.style.transform = `translate3d(${pCream.x}px, ${pCream.y}px, 0) translate(-50%, -50%)`
    }
    paint()

    const clampSpeed = (v: Vec, max: number) => {
      const s = Math.hypot(v.x, v.y)
      if (s > max) {
        const k = max / s
        v.x *= k
        v.y *= k
      }
    }

    // Clamp a center inside the padded box and reflect the offending velocity
    // component (bounce) so blobs never stick to an edge or escape the hero.
    const contain = (p: Vec, v: Vec) => {
      const padX = dims.w * BOUNDS_PAD
      const padY = dims.h * BOUNDS_PAD
      const minX = padX
      const maxX = dims.w - padX
      const minY = padY
      const maxY = dims.h - padY
      if (p.x < minX) {
        p.x = minX
        if (v.x < 0) v.x = -v.x * 0.6
      } else if (p.x > maxX) {
        p.x = maxX
        if (v.x > 0) v.x = -v.x * 0.6
      }
      if (p.y < minY) {
        p.y = minY
        if (v.y < 0) v.y = -v.y * 0.6
      } else if (p.y > maxY) {
        p.y = maxY
        if (v.y > 0) v.y = -v.y * 0.6
      }
    }

    // Numerical safety only: keep the two centers from exactly coinciding so the
    // separation axis stays well-defined. The real anti-overlap force is the
    // penetration repulsion in the active branch.
    const separate = () => {
      const dx = pCream.x - pBlue.x
      const dy = pCream.y - pBlue.y
      const d = Math.hypot(dx, dy) || 1
      if (d < MIN_SEP) {
        const push = (MIN_SEP - d) / 2
        const nx = dx / d
        const ny = dy / d
        pBlue.x -= nx * push
        pBlue.y -= ny * push
        pCream.x += nx * push
        pCream.y += ny * push
      }
    }

    const step = (now: number) => {
      if (!last) last = now
      let dt = (now - last) / 1000
      last = now
      if (dt <= 0) {
        rafId = requestAnimationFrame(step)
        return
      }
      if (dt > MAX_DT) dt = MAX_DT
      dt *= TIME_SCALE // slow the whole simulation down uniformly

      if (mode === 'returning') {
        const hb = homeBlue()
        const hc = homeCream()
        const f = Math.pow(HOME_DAMPING, dt * 60)
        vBlue.x += -HOME_K * (pBlue.x - hb.x) * dt
        vBlue.y += -HOME_K * (pBlue.y - hb.y) * dt
        vBlue.x *= f
        vBlue.y *= f
        pBlue.x += vBlue.x * dt
        pBlue.y += vBlue.y * dt
        vCream.x += -HOME_K * (pCream.x - hc.x) * dt
        vCream.y += -HOME_K * (pCream.y - hc.y) * dt
        vCream.x *= f
        vCream.y *= f
        pCream.x += vCream.x * dt
        pCream.y += vCream.y * dt
        paint()
        const settled =
          Math.hypot(pBlue.x - hb.x, pBlue.y - hb.y) < 0.5 &&
          Math.hypot(pCream.x - hc.x, pCream.y - hc.y) < 0.5 &&
          Math.hypot(vBlue.x, vBlue.y) < 2 &&
          Math.hypot(vCream.x, vCream.y) < 2
        if (settled) {
          pBlue.x = hb.x
          pBlue.y = hb.y
          pCream.x = hc.x
          pCream.y = hc.y
          vBlue.x = vBlue.y = vCream.x = vCream.y = 0
          paint()
          mode = 'idle'
          rafId = 0
          return
        }
        rafId = requestAnimationFrame(step)
        return
      }

      // --- active: coupled radial springs around the cursor ---
      const bdx = pBlue.x - cursor.x
      const bdy = pBlue.y - cursor.y
      const cdx = pCream.x - cursor.x
      const cdy = pCream.y - cursor.y
      const dBlue = Math.hypot(bdx, bdy)
      const dCream = Math.hypot(cdx, cdy)
      if (dBlue > 0.001) {
        uBlue.x = bdx / dBlue
        uBlue.y = bdy / dBlue
      }
      if (dCream > 0.001) {
        uCream.x = cdx / dCream
        uCream.y = cdy / dCream
      }

      const mean = (dBlue + dCream) / 2
      const preferred = PREFERRED_RADIUS_FACTOR * Math.min(dims.w, dims.h)
      const target = mean * (1 - ANCHOR) + preferred * ANCHOR

      // Radial velocity of each blob (positive = moving away from the cursor).
      const vRadBlue = vBlue.x * uBlue.x + vBlue.y * uBlue.y
      const vRadCream = vCream.x * uCream.x + vCream.y * uCream.y
      const sumRad = vRadBlue + vRadCream

      // chase when farther than target, flee when closer (continuous, no branch);
      // -COUPLE*sumRad enforces the anti-phase (one in, one out) coupling.
      const aBlue = -K * (dBlue - target) - COUPLE * sumRad
      const aCream = -K * (dCream - target) - COUPLE * sumRad
      vBlue.x += aBlue * uBlue.x * dt
      vBlue.y += aBlue * uBlue.y * dt
      vCream.x += aCream * uCream.x * dt
      vCream.y += aCream * uCream.y * dt

      // --- overlap-aware repulsion: sets the ANGLE between the blobs so they
      // resolve to equal radius on opposite sides of the cursor instead of
      // stacking (the radial spring above still owns the distance). ---
      const sepdx = pBlue.x - pCream.x
      const sepdy = pBlue.y - pCream.y
      const sepD = Math.hypot(sepdx, sepdy)
      if (sepD > 0.001) {
        sepAxis.x = sepdx / sepD
        sepAxis.y = sepdy / sepD
      } else {
        // Centers coincident (image 2): no center-to-center axis exists, so push
        // apart tangentially (perpendicular to the cursor->blue radial), which
        // drives them onto opposite sides of the cursor rather than sliding along
        // the same line.
        sepAxis.x = -uBlue.y
        sepAxis.y = uBlue.x
      }

      const overlap = overlapFraction(sepD)

      // Small-hero guard: the biggest center separation that fits in the padded
      // box. If it can't reach tangency, don't fight the bounds forever.
      const usableDiag = Math.hypot(dims.w * (1 - 2 * BOUNDS_PAD), dims.h * (1 - 2 * BOUNDS_PAD))
      const canReachTangent = usableDiag >= SEP_TANGENT - 1
      const maxedOut = !canReachTangent && sepD >= usableDiag - 2

      // Hysteresis: engage a decisive burst at >70% overlap, release only once
      // clear (or once maximally separated on a hero too small to fit them).
      if (!separating) {
        if (overlap > OVERLAP_ENGAGE) separating = true
      } else if (overlap <= OVERLAP_RELEASE || maxedOut) {
        separating = false
      }

      // Penetration-proportional push: self-scales with how badly they're stacked
      // and decays to zero exactly at tangency (the just-touching rest state).
      const penetration = SEP_TANGENT - sepD
      if (penetration > 0 && !maxedOut) {
        const aSep = SEP_K * penetration * (separating ? SEP_BOOST : 1)
        vBlue.x += aSep * sepAxis.x * dt
        vBlue.y += aSep * sepAxis.y * dt
        vCream.x -= aSep * sepAxis.x * dt
        vCream.y -= aSep * sepAxis.y * dt
      }

      // Energy pump: if the swing is dying, push the farther blob further out and
      // the nearer blob further in, keeping the counter-current perpetual.
      // Suppressed while separating so the escape burst reads as decisive.
      const speedTotal =
        Math.hypot(vBlue.x, vBlue.y) + Math.hypot(vCream.x, vCream.y)
      if (!separating && speedTotal < ENERGY_FLOOR) {
        if (dBlue >= dCream) {
          vBlue.x += ENERGY_KICK * uBlue.x
          vBlue.y += ENERGY_KICK * uBlue.y
          vCream.x -= ENERGY_KICK * uCream.x
          vCream.y -= ENERGY_KICK * uCream.y
        } else {
          vCream.x += ENERGY_KICK * uCream.x
          vCream.y += ENERGY_KICK * uCream.y
          vBlue.x -= ENERGY_KICK * uBlue.x
          vBlue.y -= ENERGY_KICK * uBlue.y
        }
      }

      const f = Math.pow(DAMPING, dt * 60)
      vBlue.x *= f
      vBlue.y *= f
      vCream.x *= f
      vCream.y *= f
      const cap = separating ? V_MAX_SEPARATING : V_MAX
      clampSpeed(vBlue, cap)
      clampSpeed(vCream, cap)

      pBlue.x += vBlue.x * dt
      pBlue.y += vBlue.y * dt
      pCream.x += vCream.x * dt
      pCream.y += vCream.y * dt

      separate()
      contain(pBlue, vBlue)
      contain(pCream, vCream)
      paint()

      rafId = requestAnimationFrame(step)
    }

    const ensureRunning = () => {
      if (!rafId && visible && !(mq && mq.matches)) {
        last = 0
        rafId = requestAnimationFrame(step)
      }
    }

    const onMove = (e: PointerEvent) => {
      if (mq && mq.matches) return
      const rect = section.getBoundingClientRect()
      cursor.x = e.clientX - rect.left
      cursor.y = e.clientY - rect.top
      mode = 'active'
      ensureRunning()
    }
    const onLeave = () => {
      if (mode === 'idle') return
      mode = 'returning'
      ensureRunning()
    }

    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerenter', onMove)
    section.addEventListener('pointerleave', onLeave)

    // Stop burning frames when the hero is scrolled out of view.
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true
        if (!visible) {
          if (rafId) {
            cancelAnimationFrame(rafId)
            rafId = 0
          }
        } else if (mode !== 'idle') {
          ensureRunning()
        }
      },
      { threshold: 0 },
    )
    io.observe(section)

    // Re-measure and rescale positions when the hero changes size.
    const ro = new ResizeObserver(() => {
      const w = section.clientWidth || 1
      const h = section.clientHeight || 1
      const sx = w / dims.w
      const sy = h / dims.h
      dims.w = w
      dims.h = h
      pBlue.x *= sx
      pBlue.y *= sy
      pCream.x *= sx
      pCream.y *= sy
      cursor.x *= sx
      cursor.y *= sy
      paint()
    })
    ro.observe(section)

    // React to the OS reduced-motion setting changing at runtime.
    const onMq = () => {
      if (mq && mq.matches) {
        if (rafId) {
          cancelAnimationFrame(rafId)
          rafId = 0
        }
        mode = 'idle'
        const hb = homeBlue()
        const hc = homeCream()
        pBlue.x = hb.x
        pBlue.y = hb.y
        pCream.x = hc.x
        pCream.y = hc.y
        vBlue.x = vBlue.y = vCream.x = vCream.y = 0
        paint()
      }
    }
    mq?.addEventListener?.('change', onMq)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerenter', onMove)
      section.removeEventListener('pointerleave', onLeave)
      io.disconnect()
      ro.disconnect()
      mq?.removeEventListener?.('change', onMq)
    }
  }, [])

  return (
    <section ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 pointer-events-none">
        {/* Blue blob: outer element is the rAF-driven positioner, inner is the visual. */}
        <div
          ref={blueRef}
          className="absolute left-0 top-0"
          style={{
            width: BLUE_SIZE,
            height: BLUE_SIZE,
            transform: 'translate(-50%, -50%)',
            opacity: 'var(--mendr-spotlight-blue-opacity)',
            willChange: 'transform',
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                'radial-gradient(circle, var(--mendr-spotlight-blue) 0%, transparent 70%)',
              filter: 'blur(60px)',
              animation: 'blob-breathe 7s ease-in-out infinite',
            }}
          />
        </div>
        {/* Cream blob */}
        <div
          ref={creamRef}
          className="absolute left-0 top-0"
          style={{
            width: CREAM_SIZE,
            height: CREAM_SIZE,
            transform: 'translate(-50%, -50%)',
            opacity: 'var(--mendr-spotlight-cream-opacity)',
            willChange: 'transform',
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                'radial-gradient(circle, var(--mendr-spotlight-cream) 0%, transparent 70%)',
              filter: 'blur(50px)',
              animation: 'blob-breathe 9s ease-in-out 2s infinite',
            }}
          />
        </div>
      </div>
      {children}
    </section>
  )
}
