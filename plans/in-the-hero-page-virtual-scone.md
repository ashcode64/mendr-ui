# Hero Spotlight Effect

## Context
Add a mild, soft dual-color spotlight effect (`#D6E4FF` blue, `#FDFCD7` cream) to the hero section of every page. Two radial-gradient blobs sit behind the hero text. When the user moves the cursor within the hero area, the blobs drift toward the cursor for subtle dynamism. Effect is isolated to the hero background only — no other section changes.

## Approach

### 1. Create `src/components/HeroSpotlight.tsx`

A wrapper component that:
- Renders as `<section>` with `relative overflow-hidden` added to whatever `className` is passed
- Tracks `onMouseMove` / `onMouseLeave` on the section element
- Keeps two blob positions in state as `{ x: number; y: number }` percentages, with home positions at ~30% / 70% offset
- On mouse move: calculates cursor position as % of element rect, shifts each blob ~20% toward the cursor from its home position
- On mouse leave: returns blobs to home positions
- Renders two absolutely-positioned `div`s with CSS `radial-gradient` inside a `pointer-events-none absolute inset-0` container:
  - Blue blob: `#D6E4FF` at ~12% opacity, `blur-[120px]`, `w-[500px] h-[500px]`, home at top-left area
  - Cream blob: `#FDFCD7` at ~20% opacity, `blur-[100px]`, `w-[400px] h-[400px]`, home at bottom-right area
- CSS transition on blob positions: `transition: left 0.9s cubic-bezier(0.25,0.46,0.45,0.94), top 0.9s cubic-bezier(0.25,0.46,0.45,0.94)` for smooth drift

```tsx
// src/components/HeroSpotlight.tsx
import { useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
}

export default function HeroSpotlight({ children, className = '' }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [blue, setBlue] = useState({ x: 20, y: 30 })
  const [cream, setCream] = useState({ x: 65, y: 55 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = ((e.clientX - rect.left) / rect.width) * 100
    const cy = ((e.clientY - rect.top) / rect.height) * 100
    setBlue(prev => ({ x: prev.x + (cx - prev.x) * 0.22, y: prev.y + (cy - prev.y) * 0.22 }))
    setCream(prev => ({ x: prev.x + (cx - prev.x) * 0.18, y: prev.y + (cy - prev.y) * 0.18 }))
  }

  const handleMouseLeave = () => {
    setBlue({ x: 20, y: 30 })
    setCream({ x: 65, y: 55 })
  }

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${blue.x}%`, top: `${blue.y}%`,
            background: 'radial-gradient(circle, #D6E4FF 0%, transparent 70%)',
            opacity: 0.10,
            filter: 'blur(60px)',
            transition: 'left 0.9s cubic-bezier(0.25,0.46,0.45,0.94), top 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        />
        <div
          className="absolute rounded-full w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${cream.x}%`, top: `${cream.y}%`,
            background: 'radial-gradient(circle, #FDFCD7 0%, transparent 70%)',
            opacity: 0.18,
            filter: 'blur(50px)',
            transition: 'left 0.9s cubic-bezier(0.25,0.46,0.45,0.94), top 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        />
      </div>
      {children}
    </section>
  )
}
```

### 2. Edit all page hero sections

**Pattern A — 13 inner-page files** (Problem, Solution, TheLoop, Architecture, MendrScript, Safety, UseCases, Competitive, Stakeholders, Deployment, Roadmap, ROI, DeveloperExperience):

Replace:
```jsx
<section className="border-b border-[#E5E7EB] py-16 lg:py-24">
```
With:
```jsx
<HeroSpotlight className="border-b border-[#E5E7EB] py-16 lg:py-24">
```
And closing `</section>` → `</HeroSpotlight>`.
Add `import HeroSpotlight from '../components/HeroSpotlight'` at top.

Note: TheLoop and UseCases use `py-16 lg:py-20` — preserve that.

**Pattern B — Home.tsx:**

Replace:
```jsx
<section className="relative overflow-hidden">
```
With:
```jsx
<HeroSpotlight>
```
(`relative overflow-hidden` is added by HeroSpotlight itself — no className needed here.)
And closing `</section>` → `</HeroSpotlight>`.

**Pattern C — GetStarted.tsx** (dark hero):

Replace:
```jsx
<section className="bg-[#12171A] py-20 lg:py-32">
```
With:
```jsx
<HeroSpotlight className="bg-[#12171A] py-20 lg:py-32">
```

**SignIn / SignUp**: Skip — these are auth pages with no traditional hero `<section>`. Their existing static blur orbs on the left dark panel are sufficient.

## Files Modified
- **New**: `src/components/HeroSpotlight.tsx`
- **Edited** (15 pages): `src/pages/Home.tsx`, `src/pages/Problem.tsx`, `src/pages/Solution.tsx`, `src/pages/TheLoop.tsx`, `src/pages/Architecture.tsx`, `src/pages/MendrScript.tsx`, `src/pages/Safety.tsx`, `src/pages/UseCases.tsx`, `src/pages/Competitive.tsx`, `src/pages/Stakeholders.tsx`, `src/pages/Deployment.tsx`, `src/pages/Roadmap.tsx`, `src/pages/ROI.tsx`, `src/pages/DeveloperExperience.tsx`, `src/pages/GetStarted.tsx`

## Verification
- Navigate to each page in the preview; confirm soft blue/cream glow appears behind hero text on load
- Move cursor within the hero area — blobs should drift gently toward cursor
- Move cursor out — blobs should drift back to home positions
- Scroll down on any page — confirm no glow bleeds into non-hero sections
- Check dark page (GetStarted) — blobs should be subtle against dark bg
