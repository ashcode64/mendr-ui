import type { NavigateFn } from '../App'
import HeroSpotlight from '../components/HeroSpotlight'

interface Props { navigate: NavigateFn }

const steps = [
  {
    num: '01',
    label: 'Detect',
    color: 'var(--mendr-sky)',
    textColor: 'var(--mendr-sky-ink)',
    title: 'Edge-local failure classification',
    bullets: [
      'Observes every proxied call at the gateway layer',
      'Classifies failures: SCHEMA_MISMATCH, ROUTING, CORS, SPLICE, UNKNOWN',
      'Deduplicates with a 60-second shared-memory window',
      'Scrubs PII before any data leaves the customer network',
      'Reports asynchronously — zero per-request control-plane latency',
    ],
    badge: 'Data Plane',
  },
  {
    num: '02',
    label: 'Diagnose',
    color: 'var(--mendr-cream)',
    textColor: 'var(--mendr-cream-ink)',
    title: 'AI analysis under admission control',
    bullets: [
      'Kafka consumer processes failures asynchronously',
      'LLM admission control: coalesce, semaphore, budget gates, defer-with-ack',
      'Assembles ErrorSignature with contract context and topology',
      'LangGraph orchestrates propose → verify → simulate → refine loop',
      'Output is always a closed-opcode MendrScript program — never raw LLM text',
    ],
    badge: 'Control Plane',
  },
  {
    num: '03',
    label: 'Approve',
    color: 'color-mix(in srgb, var(--mendr-success) 18%, transparent)',
    textColor: 'var(--mendr-success)',
    title: 'Human-in-the-loop safety gate',
    bullets: [
      'Conformal prediction + Venn-Abers intervals gate auto-apply',
      'Wide uncertainty intervals force PENDING_APPROVAL — always',
      'Operator reviews Venn-Abers confidence bars in the dashboard',
      'Chat synthesis available: converse, refine, then approve',
      'Auto-apply defaults off; opt-in requires calibrated confidence',
    ],
    badge: 'Control Plane',
  },
  {
    num: '04',
    label: 'Heal',
    color: 'var(--mendr-brand)',
    textColor: '#FFFFFF',
    title: 'Edge-local patch deployment',
    bullets: [
      'Rule compiles into capability-gated JSON snapshot',
      'Edge long-polls control plane every ~30 seconds',
      'Snapshot written to local Redis AOF cache',
      'Transform applied on next matching request — no restart',
      'Patch auto-expires by TTL; permanent fix remains team responsibility',
    ],
    badge: 'Data Plane',
  },
]

export default function Solution({ navigate }: Props) {
  return (
    <div>
      {/* Header */}
      <HeroSpotlight className="border-b border-rule py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">How It Works</div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[clamp(2rem,5vw,3.2rem)] leading-[1.15] tracking-tight text-on-surface mb-5">
            The four-step healing loop
          </h1>
          <p className="text-lg text-dim leading-relaxed max-w-2xl mx-auto">
            Observe at the edge. Decide in the control plane. Enforce from a local snapshot. This design principle underpins every component in the Mendr platform.
          </p>
        </div>
      </HeroSpotlight>

      {/* Loop diagram */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Horizontal connector */}
          <div className="hidden lg:flex items-center mb-10 max-w-4xl mx-auto px-4">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center flex-1">
                <div className="flex-1 flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-[family-name:var(--font-display)] font-bold text-lg mb-1"
                    style={{ backgroundColor: step.color, color: step.textColor }}
                  >
                    {i + 1}
                  </div>
                  <div className="text-xs font-bold text-dim uppercase tracking-wide">{step.label}</div>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 flex items-center gap-1 px-2">
                    <div className="flex-1 h-px bg-rule"></div>
                    <svg className="w-4 h-4 text-rule" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
            {/* Loop back arrow hint */}
            <div className="ml-3 text-xs text-dim font-medium opacity-60">↺ loop</div>
          </div>

          {/* Step cards */}
          <div className="grid lg:grid-cols-4 gap-5">
            {steps.map(step => (
              <div
                key={step.label}
                className="rounded-2xl overflow-hidden border"
                style={{ borderColor: step.color === 'var(--mendr-brand)' ? 'var(--mendr-brand)' : 'var(--mendr-rule)' }}
              >
                <div
                  className="px-6 pt-6 pb-5"
                  style={{ backgroundColor: step.color }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold opacity-60" style={{ color: step.textColor }}>{step.num}</span>
                    <span
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: step.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                        color: step.textColor,
                      }}
                    >
                      {step.badge}
                    </span>
                  </div>
                  <div className="text-xl font-bold mb-1" style={{ color: step.textColor, fontFamily: 'Poppins, sans-serif' }}>
                    {step.label}
                  </div>
                  <div className="text-xs font-medium opacity-75" style={{ color: step.textColor }}>
                    {step.title}
                  </div>
                </div>
                <div className="bg-surface px-6 py-5">
                  <ul className="space-y-2.5">
                    {step.bullets.map(bullet => (
                      <li key={bullet} className="flex items-start gap-2.5">
                        <svg className="w-3.5 h-3.5 text-brand flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-on-surface leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sequence diagram */}
      <section className="bg-surface border-y border-rule py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">End-to-End</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              From first failure to healed traffic
            </h2>
          </div>

          <div className="bg-ink rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-error"></div>
              <div className="w-2 h-2 rounded-full bg-warning"></div>
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <span className="ml-3 text-xs text-dim font-mono">sequence.mmd</span>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-xs font-mono min-w-[600px]">
                <thead>
                  <tr>
                    {['Client', 'Edge', 'Control Plane', 'AI Analysis', 'Operator', 'Kafka'].map(col => (
                      <th key={col} className="text-center pb-4 text-muted font-normal px-2">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { from: 0, to: 1, label: 'API call → 4xx/5xx', color: '#EF4444' },
                    { from: 1, to: 2, label: 'POST /api/internal/failures', color: '#F59E0B' },
                    { from: 2, to: 5, label: 'publish api.failures', color: '#F59E0B' },
                    { from: 5, to: 3, label: 'consume failure event', color: '#60A5FA' },
                    { from: 3, to: 3, label: 'admit LLM + diagnose', color: '#A78BFA' },
                    { from: 3, to: 4, label: 'PENDING_APPROVAL', color: '#FBBF24' },
                    { from: 4, to: 3, label: 'POST /approve', color: '#34D399' },
                    { from: 3, to: 5, label: 'publish api.transformations.approved', color: '#34D399' },
                    { from: 5, to: 2, label: 'rule deploy + snapshot', color: '#34D399' },
                    { from: 1, to: 2, label: 'long-poll /v1/sync/routeconfig', color: '#60A5FA' },
                    { from: 2, to: 1, label: 'new snapshot + MendrScript', color: '#60A5FA' },
                    { from: 0, to: 1, label: 'retry call', color: 'var(--mendr-dim)' },
                    { from: 1, to: 1, label: 'apply transform', color: '#34D399' },
                    { from: 1, to: 0, label: '200 ✓ healed', color: '#34D399' },
                  ].map((row, i) => (
                    <tr key={i}>
                      {[0, 1, 2, 3, 4, 5].map(col => (
                        <td key={col} className="text-center px-2 py-1.5 relative">
                          {col === row.from && col === row.to ? (
                            <span className="text-brand">⟳</span>
                          ) : col === Math.min(row.from, row.to) ? (
                            <div className="flex items-center gap-1 justify-end">
                              {col === row.from && <span style={{ color: row.color }} className="whitespace-nowrap text-[10px]">{row.label}</span>}
                              {col === row.from && col < row.to && <span style={{ color: row.color }}>→</span>}
                              {col !== row.from && <span style={{ color: row.color }} className="whitespace-nowrap text-[10px]">{row.label}</span>}
                            </div>
                          ) : col === Math.max(row.from, row.to) ? (
                            <div className="flex items-center gap-1">
                              {col === row.to && col > row.from && <span style={{ color: row.color }}>→</span>}
                            </div>
                          ) : col > Math.min(row.from, row.to) && col < Math.max(row.from, row.to) ? (
                            <div className="flex items-center justify-center">
                              <div className="w-px h-5" style={{ backgroundColor: row.color, opacity: 0.3 }}></div>
                            </div>
                          ) : null}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Key insight */}
      <section className="py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Zero control-plane latency on proxy path',
                desc: 'Failure reports are asynchronous timer POSTs. Route sync is a background long-poll. Every request is served from local Redis snapshots.',
                icon: '⚡',
              },
              {
                title: 'Resilient to control-plane outages',
                desc: 'Edge Redis holds AOF-persisted snapshots. Approved transforms keep working even if the control plane is temporarily unavailable.',
                icon: '🔄',
              },
              {
                title: 'LLM never runs on the hot path',
                desc: 'AI analysis is Kafka-async. Admission control defers over-budget work rather than retrying into a cost storm. The edge executes only precompiled MendrScript.',
                icon: '🛡️',
              },
            ].map(insight => (
              <div key={insight.title} className="bg-surface border border-rule rounded-xl p-6">
                <div className="text-2xl mb-3">{insight.icon}</div>
                <h3 className="font-semibold text-on-surface mb-2 text-sm">{insight.title}</h3>
                <p className="text-xs text-dim leading-relaxed">{insight.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream border-y border-rule py-14 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl tracking-tight text-cream-ink mb-3">
            Dive deeper into each step
          </h2>
          <p className="text-sm text-cream-ink/75 mb-6">
            Explore Detect, Diagnose, Approve, and Heal in full technical detail — with architecture decisions, code evidence, and edge behavior.
          </p>
          <button onClick={() => navigate('the-loop')} className="bg-brand text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-brand-dark transition-colors text-sm">
            Explore the loop in detail
          </button>
        </div>
      </section>
    </div>
  )
}
