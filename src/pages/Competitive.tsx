import type { NavigateFn } from '../App'
import HeroSpotlight from '../components/HeroSpotlight'

interface Props { navigate: NavigateFn }

const comparisons = [
  {
    category: 'API Gateways',
    examples: 'Kong · Apigee · AWS API Gateway · Gravitee',
    theyWin: ['Ecosystem maturity, plugins, marketplace', 'Years of production hardening', 'Extensive auth, quota, transformation plugins'],
    mendrWins: ['Self-healing loop with AI diagnosis', 'Verified MendrScript + minimizer + conformal gate', 'Failure-driven proposals with precedent learning'],
    takeaway: 'Mendr can coexist as a specialized healing layer in front of or alongside existing gateways during migration.',
  },
  {
    category: 'Service Meshes',
    examples: 'Istio · Linkerd · Cilium · Envoy',
    theyWin: ['mTLS, traffic shifting — first-class, kube-native', 'Sidecar telemetry hooks', 'Virtual services, subsets for routing'],
    mendrWins: ['Payload/schema healing meshes cannot perform', 'Contract-aware transforms on JSON bodies', 'Routing override heals + schema rename heals'],
    takeaway: 'Mesh solves connectivity and policy; Mendr solves semantic contract violations. Complementary, not redundant.',
  },
  {
    category: 'Observability',
    examples: 'Datadog · New Relic · Splunk · Sentry',
    theyWin: ['Breadth of signals: logs, metrics, traces, RUM', 'ML on telemetry, anomaly detection', 'PagerDuty integrations, on-call workflows'],
    mendrWins: ['Acts — deploys verified virtual patches', 'Outputs executable MendrScript, not runbooks', 'Reduces MTTR for integration failure class'],
    takeaway: 'Mendr ingests OTLP but is not replacing APM — it closes the remediation loop APM leaves open.',
  },
  {
    category: 'iPaaS / ESB',
    examples: 'MuleSoft · Boomi · Workato',
    theyWin: ['Visual mapping, connector catalog (design-time)', 'Orchestration engines for batch/async workflows', 'Enterprise integration COE governance'],
    mendrWins: ['Runtime in-path healing without replumbing', 'Sub-second heal deploy on live synchronous traffic', 'HITL + MendrScript verification + audit trail'],
    takeaway: 'iPaaS is upstream/downstream of Mendr — Mendr catches production drift iPaaS models did not anticipate.',
  },
  {
    category: 'Contract Testing',
    examples: 'Pact · Optic · Spectral · Schemathesis',
    theyWin: ['CI contract gates, shift-left prevention', 'PR checks, breaking change detection', 'Developer workflow integration'],
    mendrWins: ['Production drift healing when CI missed', 'Live traffic context with actual failing payload', 'Runtime safety net for what CI couldn\'t catch'],
    takeaway: 'Mendr roadmap includes CI contract gates; today Mendr is the production safety net.',
  },
]

export default function Competitive({ navigate }: Props) {
  return (
    <div>
      {/* Header */}
      <HeroSpotlight className="border-b border-rule py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">Why Mendr</div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[clamp(2rem,5vw,3.2rem)] leading-[1.15] tracking-tight text-on-surface mb-5">
            A new category
          </h1>
          <p className="text-lg text-dim leading-relaxed max-w-2xl mx-auto">
            Integration resilience — the capability to detect, diagnose, and repair broken API traffic in production at the gateway boundary. No existing category delivers this.
          </p>
        </div>
      </HeroSpotlight>

      {/* Positioning matrix */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Market Map</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              Where Mendr sits
            </h2>
          </div>

          {/* 2x2 matrix */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative">
              {/* Axes labels */}
              <div className="flex items-center justify-center mb-2">
                <span className="text-xs font-semibold text-dim uppercase tracking-widest">API contract aware</span>
              </div>
              <div className="grid grid-cols-2 gap-0.5 bg-rule rounded-2xl overflow-hidden border border-rule">
                {/* Q2 — top left */}
                <div className="bg-canvas p-6">
                  <div className="text-[10px] font-bold text-dim uppercase tracking-widest mb-3">Q2 — Prevention</div>
                  <div className="space-y-2">
                    {['Pact', 'Spectral', 'Optic'].map(name => (
                      <div key={name} className="bg-surface border border-rule rounded-lg px-3 py-2 text-xs font-medium text-dim">{name}</div>
                    ))}
                  </div>
                  <div className="mt-3 text-[10px] text-muted">CI gates · Shift-left · No runtime</div>
                </div>
                {/* Q1 — top right — Mendr */}
                <div className="bg-sky p-6 relative">
                  <div className="text-[10px] font-bold text-brand uppercase tracking-widest mb-3">Q1 — Integration Resilience</div>
                  <div className="bg-brand text-white rounded-xl px-4 py-3 mb-2">
                    <div className="text-sm font-bold">mendr ★</div>
                    <div className="text-[10px] mt-0.5 opacity-75">Live verified healing</div>
                  </div>
                  <div className="text-[10px] text-brand opacity-70 mt-2">Contract-aware · Remediation capable</div>
                </div>
                {/* Q3 — bottom left */}
                <div className="bg-canvas p-6">
                  <div className="text-[10px] font-bold text-dim uppercase tracking-widest mb-3">Q3 — Gateways & Meshes</div>
                  <div className="space-y-2">
                    {['Kong', 'Apigee', 'Istio', 'Envoy'].map(name => (
                      <div key={name} className="bg-surface border border-rule rounded-lg px-3 py-2 text-xs font-medium text-dim">{name}</div>
                    ))}
                  </div>
                  <div className="mt-3 text-[10px] text-muted">Route · Auth · No contract healing</div>
                </div>
                {/* Q4 — bottom right */}
                <div className="bg-canvas p-6">
                  <div className="text-[10px] font-bold text-dim uppercase tracking-widest mb-3">Q4 — APM & AIOps</div>
                  <div className="space-y-2">
                    {['Datadog', 'New Relic', 'Moogsoft'].map(name => (
                      <div key={name} className="bg-surface border border-rule rounded-lg px-3 py-2 text-xs font-medium text-dim">{name}</div>
                    ))}
                  </div>
                  <div className="mt-3 text-[10px] text-muted">Detect · Alert · No edge deploy</div>
                </div>
              </div>
              {/* Axis label right */}
              <div className="flex justify-between mt-2 px-2">
                <span className="text-xs text-muted">Detection only</span>
                <span className="text-xs font-semibold text-brand">← Remediation capable →</span>
                <span className="text-xs text-muted">Generic infra</span>
              </div>
            </div>
          </div>

          {/* Positioning statement */}
          <div className="max-w-3xl mx-auto bg-ink rounded-2xl p-8 text-center mb-6">
            <div className="text-dim text-xs font-mono mb-4">mendr.io — positioning statement</div>
            <blockquote className="text-white text-lg leading-relaxed font-[family-name:var(--font-display)] font-medium">
              "Observability tools tell you something broke. API gateways route traffic. Mendr is the only layer that fixes broken traffic in production — with human-in-the-loop trust and a control plane that scales from an API gateway today to Envoy and Istio at enterprise scale tomorrow."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Comparison tables */}
      <section className="bg-surface border-y border-rule py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Honest Comparison</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              Head-to-head with every category
            </h2>
            <p className="text-sm text-dim mt-2">These comparisons are honest about competitor strengths. Mendr wins on closed-loop healing.</p>
          </div>
          <div className="space-y-6">
            {comparisons.map(comp => (
              <div key={comp.category} className="border border-rule rounded-2xl overflow-hidden">
                <div className="bg-canvas border-b border-rule px-6 py-4">
                  <div className="font-[family-name:var(--font-display)] font-bold text-lg text-on-surface">{comp.category}</div>
                  <div className="text-xs text-dim mt-0.5">{comp.examples}</div>
                </div>
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-rule">
                  <div className="p-5">
                    <div className="text-xs font-bold text-[#D97706] mb-3 uppercase tracking-wide">They win</div>
                    <ul className="space-y-2">
                      {comp.theyWin.map(item => (
                        <li key={item} className="flex items-start gap-2 text-xs text-on-surface">
                          <span className="text-[#D97706] mt-0.5">→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-bold text-brand mb-3 uppercase tracking-wide">Mendr wins</div>
                    <ul className="space-y-2">
                      {comp.mendrWins.map(item => (
                        <li key={item} className="flex items-start gap-2 text-xs text-on-surface">
                          <span className="text-brand mt-0.5">★</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-sky border-t border-rule px-5 py-3">
                  <span className="text-xs font-semibold text-sky-ink">Takeaway: </span>
                  <span className="text-xs text-sky-ink">{comp.takeaway}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Now */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Market Timing</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">Why 2026 is the right moment</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { num: '01', title: 'API-first maturity', desc: 'Enterprises completed microservices adoption — the problem is no longer "should we decompose" but "how do we keep contracts aligned at scale."' },
              { num: '02', title: 'LLM reliability concerns', desc: 'Raw LLM output on production paths is unacceptable. Buyers demand verified, gated AI. Mendr\'s 2026-aligned design matches security advisory climate.' },
              { num: '03', title: 'Edge deployment renaissance', desc: 'Customer-owned VPC gateways regained popularity for latency and data residency — Mendr\'s hybrid model matches this infrastructure direction.' },
              { num: '04', title: 'Cost consciousness', desc: 'LLM inference during incidents can explode without admission control. Mendr treats inference as a gated resource — matching enterprise FinOps culture.' },
            ].map(item => (
              <div key={item.num} className="bg-surface border border-rule rounded-xl p-5">
                <div className="font-[family-name:var(--font-display)] font-bold text-4xl text-[#F3F4F6] mb-3 leading-none">{item.num}</div>
                <h3 className="text-sm font-bold text-on-surface mb-2">{item.title}</h3>
                <p className="text-xs text-dim leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
