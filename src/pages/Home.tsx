import type { NavigateFn } from '../App'
import HeroSpotlight from '../components/HeroSpotlight'

interface Props { navigate: NavigateFn }

const steps = [
  { label: 'Detect', color: 'var(--mendr-sky)', text: 'var(--mendr-sky-ink)', desc: 'Catches broken API calls as they happen, and strips sensitive data before anything is shared.' },
  { label: 'Diagnose', color: 'var(--mendr-cream)', text: 'var(--mendr-cream-ink)', desc: 'Our AI analysis engine diagnoses the issue in the payload and proposes a precise patch.' },
  { label: 'Approve', color: 'color-mix(in srgb, var(--mendr-success) 18%, transparent)', text: 'var(--mendr-success)', desc: 'A person reviews the proposal and says yes or no. Nothing ships on its own by default.' },
  { label: 'Heal', color: 'var(--mendr-brand)', text: '#FFFFFF', desc: 'Applies the fix at the gateway in seconds. No app redeployed. Traffic restored.' },
]

const stats = [
  { value: '<2 min', label: 'Typical time to restore after approval' },
  { value: '0', label: 'App redeploys needed for the temporary fix' },
  { value: '100%', label: 'Proposed fixes checked before they go live' },
  { value: '3-layer', label: 'Customer data stays isolated by design' },
]

const logos = ['Inventory Service', 'Brand Portal', 'Shipping Gateway', 'Broadcast channel', 'Analytics Sink', 'Billing Platform', 'E-commerce app']

export default function Home({ navigate }: Props) {
  return (
    <div>
      {/* Hero */}
      <HeroSpotlight>
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-sky text-sky-ink text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8 animate-fade-in-up">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse-slow"></span>
              Now in production · August 2026
            </div>
            <h1 className="font-[family-name:var(--font-display)] font-bold text-center text-[clamp(1.7rem,8vw,2.75rem)] lg:text-[3.4rem] leading-[1.12] tracking-[-0.02em] text-on-surface mb-6 animate-fade-in-up delay-100">
              <span className="block lg:whitespace-nowrap">
                <span className="whitespace-nowrap">Services break in</span>
                <br className="lg:hidden" />{" "}
                <span className="whitespace-nowrap">real-time.</span>
              </span>
              <span className="block text-brand lg:whitespace-nowrap">
                <span className="whitespace-nowrap">Mendr fixes them in</span>
                <br className="lg:hidden" />{" "}
                <span className="whitespace-nowrap">real-time.</span>
              </span>
            </h1>
            <p className="text-lg text-dim leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
              When APIs disagree on contracts, mendr detects these failures at the gateway, suggest deterministic fixes, and apply them safely with human approval. Keep production systems running without interruptions.
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
                    <span className="text-xs font-semibold text-on-surface">Live heal · 47 seconds ago</span>
                    <p className="text-xs text-dim mt-0.5">
                      <span className="font-mono text-brand">inventory→shipping POST /ship</span>
                      {': renamed '}
                      <span className="font-mono bg-error/15 text-error px-1 rounded">tag_id</span>
                      {' to '}
                      <span className="font-mono bg-success/20 text-success px-1 rounded">tag_sent</span>
                      {'. Traffic restored.'}
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
              <h3 className="font-[family-name:var(--font-display)] font-bold text-[2.2rem] leading-[1.2] tracking-tight text-on-surface mb-5">
                Detection tools tell you what broke. They don't fix it. We do.
              </h3>
              <p className="text-dim leading-relaxed mb-6">
                A typical integration outage still looks like this: an alert, a war room, engineers assemble, root cause found as contract mismatch, not infrastructure. After that comes a ticket, a review, and a deploy. Customers wait for hours.
              </p>
              <p className="text-dim leading-relaxed mb-8">
                Mendr shortens the middle of that story. The gateway already saw the bad call. It proposes a small temporary patch, a person approves it, and traffic starts working again in minutes while the permanant fix ships later.
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
                {['Alerts fire (8–20 min after impact)', 'On-call team gathers and starts triage', 'Root cause: two systems disagree on a field or route', 'Fix designed and change request opened', 'Review and testing', 'Deploy and verify (often 2 to 8 hours total)'].map((step, i) => (
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
                {['Gateway catches the failed call', 'System proposes a checked temporary fix', '\n' +
                'Operator reviews, refines and approves in dashboard', 'Fix goes live at the gateway; traffic recovers in minutes'].map((step, i) => (
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
              An active remediation engine in the path of your API traffic.
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Monitoring watches. Gateways route. Mendr does the missing step: it repairs broken calls while your teams ship the lasting change.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: '⚡',
                title: 'Runtime resilience platform',
                desc: 'Fixes traffic while you keep shipping. Intercepts failed API traffic and applies verified virtual patches until permanent fixes ship.',
              },
              {
                icon: '🔬',
                title: 'Human-in-the-loop by design',
                desc: 'Patches never auto apply. Someone reviews ever patch and approves, modifies or rejects them.',
              },
              {
                icon: '🔒',
                title: 'Also an enterprise gateway',
                desc: 'Security filters, sign-in, rate limits, load balancing and tenant isolation sit in the same place that heals traffic.',
              },
              {
                icon: '📜',
                title: 'Checked patches only',
                desc: 'Every proposed fix is compiled, tested against samples, trimmed down, and re-checked before it can reach the gateway.',
              },
              {
                icon: '🧠',
                title: 'Diagnosis grounded in your contracts',
                desc: 'Suggestions are constrained by your published API specs and how services actually connect, not freeform guesswork.',
              },
              {
                icon: '🛡️',
                title: 'Safe defaults at the gateway',
                desc: 'Sensitive fields stay protected,  PII data is scrubbed before leaving your network, and bad transforms fail closed.',
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
            Watch at the gateway. Decide centrally. Enforce locally.
          </div>
          <h2 className="font-[family-name:var(--font-display)] font-bold text-[2rem] lg:text-[2.5rem] leading-[1.15] tracking-tight text-on-surface mb-5">
            Stop treating integration failures as facts of life.
          </h2>
          <p className="text-dim mb-8 leading-relaxed">
            Run Mendr in your cloud or fully on your own. Failures that used to take hours can recover in minutes.
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
