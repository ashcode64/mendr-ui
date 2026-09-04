import type { NavigateFn } from '../App'
import HeroSpotlight from '../components/HeroSpotlight'

interface Props { navigate: NavigateFn }

const steps = [
  { label: 'Detect', color: 'var(--mendr-sky)', text: 'var(--mendr-sky-ink)', desc: 'Edge classifies failures in real time with PII scrub and dedup.' },
  { label: 'Diagnose', color: 'var(--mendr-cream)', text: 'var(--mendr-cream-ink)', desc: 'AI analysis proposes a verified MendrScript transform.' },
  { label: 'Approve', color: 'color-mix(in srgb, var(--mendr-success) 18%, transparent)', text: 'var(--mendr-success)', desc: 'Operator reviews confidence intervals and approves or rejects.' },
  { label: 'Heal', color: 'var(--mendr-brand)', text: '#FFFFFF', desc: 'Edge applies the patch instantly — no redeploy required.' },
]

const stats = [
  { value: '<2 min', label: 'Median time-to-heal after approval' },
  { value: '0', label: 'Application redeploys required' },
  { value: '100%', label: 'LLM output verified before edge exec' },
  { value: '3-layer', label: 'Multi-tenant isolation by default' },
]

const logos = ['Inventory Service', 'Payment API', 'Shipping Gateway', 'Auth Service', 'Analytics Sink', 'Billing Platform']

export default function Home({ navigate }: Props) {
  return (
    <div>
      {/* Hero */}
      <HeroSpotlight>
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-sky text-sky-ink text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8 animate-fade-in-up">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse-slow"></span>
              Now in production — August 2026
            </div>
            <h1 className="font-[family-name:var(--font-display)] font-bold text-[clamp(2.4rem,6vw,4.2rem)] leading-[1.1] tracking-[-0.03em] text-on-surface mb-6 animate-fade-in-up delay-100">
              Services break in real-time.<br />
              <span className="text-brand">Mendr fixes them in real-time.</span>
            </h1>
            <p className="text-lg text-dim leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
              A self-healing API platform that detects integration failures at the gateway layer, proposes verified transforms, waits for human approval, and deploys patches live at the edge — without downtime or emergency redeploys.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up delay-300">
              <button
                onClick={() => navigate('get-started')}
                className="w-full sm:w-auto bg-brand text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-brand-dark transition-colors text-sm"
              >
                Get started free
              </button>
              <button
                onClick={() => navigate('solution')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-rule bg-surface text-on-surface font-medium px-7 py-3.5 rounded-lg hover:bg-canvas transition-colors text-sm"
              >
                See how it works
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Loop visualization */}
          <div className="mt-20 max-w-4xl mx-auto animate-fade-in-up delay-400">
            <div className="bg-surface border border-rule rounded-2xl p-8 shadow-sm">
              <div className="text-center mb-8">
                <span className="text-xs font-semibold text-dim uppercase tracking-widest">The Healing Loop</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {steps.map((step, i) => (
                  <div key={step.label} className="relative">
                    <div
                      className="rounded-xl p-5 h-full"
                      style={{ backgroundColor: step.color }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className="text-xs font-bold uppercase tracking-wider"
                          style={{ color: step.text }}
                        >
                          {step.label}
                        </div>
                        <div
                          className="text-xs font-bold opacity-40"
                          style={{ color: step.text }}
                        >
                          0{i + 1}
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed opacity-80" style={{ color: step.text }}>
                        {step.desc}
                      </p>
                    </div>
                    {i < 3 && (
                      <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 bg-surface border border-rule rounded-full items-center justify-center">
                        <svg className="w-3 h-3 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Live example */}
              <div className="mt-6 bg-canvas border border-rule rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0 animate-pulse-slow"></div>
                  <div>
                    <span className="text-xs font-semibold text-on-surface">Live heal — 47 seconds ago</span>
                    <p className="text-xs text-dim mt-0.5">
                      <span className="font-mono text-brand">inventory→shipping POST /ship</span>
                      {' '}— field rename{' '}
                      <span className="font-mono bg-error/15 text-error px-1 rounded">mag_sent</span>
                      {' '}→{' '}
                      <span className="font-mono bg-success/20 text-success px-1 rounded">tag_sent</span>
                      {' '}applied, traffic restored.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HeroSpotlight>

      {/* Stats */}
      <section className="border-t border-rule bg-surface">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-[family-name:var(--font-display)] font-bold text-3xl text-brand mb-1">{stat.value}</div>
                <div className="text-sm text-dim">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticker */}
      <section className="border-t border-rule bg-canvas py-4 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...logos, ...logos, ...logos].map((logo, i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-8 text-sm text-dim font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rule"></span>
              {logo}
            </span>
          ))}
        </div>
      </section>

      {/* Problem teaser */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">The Problem</div>
              <h2 className="font-[family-name:var(--font-display)] font-bold text-[2.2rem] leading-[1.2] tracking-tight text-on-surface mb-5">
                Detection tools tell you something broke. They don{"'"}t fix it.
              </h2>
              <p className="text-dim leading-relaxed mb-6">
                The median integration incident still follows the same painful script: alert fires, engineers assemble, root cause found — contract mismatch, not infrastructure. Then comes CI, review, deploy. Hours, not minutes.
              </p>
              <p className="text-dim leading-relaxed mb-8">
                Mendr compresses steps 3–5 for a defined class of failures. The gateway already saw the failing request and response. AI analysis proposes a transform. A human approves. The edge applies it in seconds.
              </p>
              <button
                onClick={() => navigate('problem')}
                className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors flex items-center gap-2"
              >
                See the full problem statement
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Incident timeline comparison */}
            <div className="space-y-3">
              <div className="bg-error/10 border border-error/40 rounded-xl p-5">
                <div className="text-xs font-bold text-error uppercase tracking-wide mb-3">Without Mendr</div>
                {['Alert fires (8–20 min after impact)', 'On-call assembles, triage begins', 'Root cause: schema mismatch identified', 'Fix designed, PR opened', 'CI runs, review obtained', 'Deploy and verify — 2–8 hours total'].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#FCA5A5] flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-error">{i + 1}</span>
                    </div>
                    <span className="text-xs text-error">{step}</span>
                  </div>
                ))}
              </div>
              <div className="bg-success/10 border border-success/40 rounded-xl p-5">
                <div className="text-xs font-bold text-[#16A34A] uppercase tracking-wide mb-3">With Mendr</div>
                {['Edge detects failure, classifies as SCHEMA_MISMATCH', 'AI proposes verified MendrScript rename', 'Operator approves in dashboard', 'Edge applies patch — traffic restored in minutes'].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#86EFAC] flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-[#16A34A]">{i + 1}</span>
                    </div>
                    <span className="text-xs text-success">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Mendr is */}
      <section className="bg-ink py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">The Product</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-[2rem] lg:text-[2.4rem] leading-[1.2] tracking-tight text-white mb-5">
              Not a dashboard. Not a passive proxy.<br />An active remediation engine.
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Mendr sits in the path of API traffic, observes every call, and closes the repair loop that APM and gateways leave open.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: '⚡',
                title: 'Runtime resilience platform',
                desc: 'Intercepts failed API traffic and applies verified virtual patches until permanent fixes ship.',
              },
              {
                icon: '🔬',
                title: 'Human-in-the-loop by default',
                desc: 'Auto-apply defaults to off. Conformal prediction determines when abstention is the right answer.',
              },
              {
                icon: '🔒',
                title: 'Enterprise API gateway',
                desc: 'WAF, JWT/OIDC, rate limiting, AI facade, multi-tenant isolation, GitOps manifests.',
              },
              {
                icon: '📜',
                title: 'Verified codegen pipeline',
                desc: 'MendrScript is compiled, simulated, minimized by Rust EqSat, and re-verified before any edge deployment.',
              },
              {
                icon: '🧠',
                title: 'Contract-aware AI analysis',
                desc: 'LLM diagnosis constrained by OpenAPI contracts, topology, and GraphRAG precedents.',
              },
              {
                icon: '🛡️',
                title: 'Fail-closed edge semantics',
                desc: 'Protected paths blacklist, PII scrub, splice abort after partial flush — safety at every layer.',
              },
            ].map(feature => (
              <div key={feature.title} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-colors">
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-white mb-2 text-sm">{feature.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="inline-block bg-cream text-cream-ink text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
            Observe at the edge. Decide in the control plane. Enforce locally.
          </div>
          <h2 className="font-[family-name:var(--font-display)] font-bold text-[2rem] lg:text-[2.5rem] leading-[1.15] tracking-tight text-on-surface mb-5">
            Ready to stop treating integration failures as facts of life?
          </h2>
          <p className="text-dim mb-8 leading-relaxed">
            Mendr is deployable today — SaaS hybrid or full on-prem. Integration failures that took hours now take minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => navigate('get-started')} className="w-full sm:w-auto bg-brand text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-brand-dark transition-colors text-sm">
              Get started
            </button>
            <button onClick={() => navigate('architecture')} className="w-full sm:w-auto border border-rule bg-surface text-on-surface font-medium px-7 py-3.5 rounded-lg hover:bg-canvas transition-colors text-sm">
              View architecture
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
