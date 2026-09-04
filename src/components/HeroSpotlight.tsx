import { useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
}

export default function HeroSpotlight({ children, className = '' }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [blue, setBlue] = useState({ x: 20, y: 30 })
  const [cream, setCream] = useState({ x: 65, y: 55 })
  const bluePos = useRef({ x: 20, y: 30 })
  const creamPos = useRef({ x: 65, y: 55 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = ((e.clientX - rect.left) / rect.width) * 100
    const cy = ((e.clientY - rect.top) / rect.height) * 100

    const b = bluePos.current
    const c = creamPos.current
    const blueDist = Math.hypot(cx - b.x, cy - b.y)
    const creamDist = Math.hypot(cx - c.x, cy - c.y)
    const blueIsCloser = blueDist < creamDist

    // Farther blob chases the cursor; closer blob flees in the opposite direction
    // "flee" = move from cursor toward blob (reverse vector), clamped to stay in 0–100 range
    const chaseStep = 0.20
    const fleeStep = 0.15

    let newBlue: { x: number; y: number }
    let newCream: { x: number; y: number }

    if (blueIsCloser) {
      // blue flees away from cursor
      newBlue = { x: b.x + (b.x - cx) * fleeStep, y: b.y + (b.y - cy) * fleeStep }
      // cream chases cursor
      newCream = { x: c.x + (cx - c.x) * chaseStep, y: c.y + (cy - c.y) * chaseStep }
    } else {
      // blue chases cursor
      newBlue = { x: b.x + (cx - b.x) * chaseStep, y: b.y + (cy - b.y) * chaseStep }
      // cream flees away from cursor
      newCream = { x: c.x + (c.x - cx) * fleeStep, y: c.y + (c.y - cy) * fleeStep }
    }

    bluePos.current = newBlue
    creamPos.current = newCream
    setBlue(newBlue)
    setCream(newCream)
  }

  const handleMouseLeave = () => {
    const home = { blue: { x: 20, y: 30 }, cream: { x: 65, y: 55 } }
    bluePos.current = home.blue
    creamPos.current = home.cream
    setBlue(home.blue)
    setCream(home.cream)
  }

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <style>{`
        @keyframes blob-breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50%       { transform: translate(-50%, -50%) scale(1.2); }
        }
      `}</style>
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full w-[700px] h-[700px]"
          style={{
            left: `${blue.x}%`,
            top: `${blue.y}%`,
            background: 'radial-gradient(circle, var(--mendr-spotlight-blue) 0%, transparent 70%)',
            opacity: 'var(--mendr-spotlight-blue-opacity)',
            filter: 'blur(60px)',
            animation: 'blob-breathe 7s ease-in-out infinite',
            transition: 'left 0.9s cubic-bezier(0.25,0.46,0.45,0.94), top 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        />
        <div
          className="absolute rounded-full w-[560px] h-[560px]"
          style={{
            left: `${cream.x}%`,
            top: `${cream.y}%`,
            background: 'radial-gradient(circle, var(--mendr-spotlight-cream) 0%, transparent 70%)',
            opacity: 'var(--mendr-spotlight-cream-opacity)',
            filter: 'blur(50px)',
            animation: 'blob-breathe 9s ease-in-out 2s infinite',
            transition: 'left 0.9s cubic-bezier(0.25,0.46,0.45,0.94), top 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        />
      </div>
      {children}
    </section>
  )
}
