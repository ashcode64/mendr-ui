import type { NavigateFn } from '../App'
import HeroSpotlight from '../components/HeroSpotlight'

interface Props { navigate: NavigateFn }

export default function Deployment({ navigate }: Props) {
  return (
    <div>
      {/* Header */}
      <HeroSpotlight className="border-b border-rule py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">Platform</div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[clamp(2rem,5vw,3.2rem)] leading-[1.15] tracking-tight text-on-surface mb-5">
            Deploy where your data lives
          </h1>
          <p className="text-lg text-dim leading-relaxed max-w-2xl mx-auto">
            SaaS hybrid, full on-prem, or air-gapped. Mendr supports multiple deployment topologies aligned with enterprise security and latency requirements.
          </p>
        </div>
      </HeroSpotlight>

      {/* Deployment models */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {[
              {
                model: 'Model A',
                name: 'SaaS hybrid',
                badge: 'Recommended',
                badgeColor: 'bg-success/20 text-success',
                desc: 'Control plane hosted by Mendr (or customer VPC cloud account); data plane gateway deployed in each customer network close to services.',
                flow: [
                  'App calls → local edge :8080 → upstream services',
                  'Failure telemetry → CP over HTTPS with tenant API key',
                  'Payload healing is local — request/response bodies never leave customer network',
                  'Only redacted failure samples (PII-scrubbed) reach control plane',
                ],
                config: [
                  'MENDR_CONTROL_PLANE_URL',
                  'GATEWAY_EDGE_API_KEY',
                  'MENDR_TENANT_ID (optional)',
                ],
                when: 'Default for production. Minimizes data-plane latency. Satisfies data residency for request/response bodies.',
                color: 'var(--mendr-sky)',
                textColor: 'var(--mendr-sky-ink)',
              },
              {
                model: 'Model B',
                name: 'Full on-prem',
                badge: 'Air-gapped',
                badgeColor: 'bg-warning/20 text-warning',
                desc: 'Both control plane and data plane deployed in customer data center via docker compose up -d --build. No external SaaS dependency.',
                flow: [
                  'All services in customer infrastructure',
                  'No external calls to Mendr infrastructure',
                  'Complete data sovereignty and air-gap compliance',
                  'Customer manages upgrades and operations',
                ],
                config: [
                  'docker compose up -d --build',
                  'All services co-located',
                  'Customer-managed TLS and networking',
                ],
                when: 'Air-gapped environments, regulated industries requiring no external SaaS dependency, development and POC clusters.',
                color: 'var(--mendr-cream)',
                textColor: 'var(--mendr-cream-ink)',
              },
              {
                model: 'Model C',
                name: 'Resilience modes',
                badge: 'Always-on',
                badgeColor: 'bg-success/20 text-success',
                desc: 'Multiple layers of edge resilience ensure the data plane keeps serving even during control-plane degradation or maintenance windows.',
                flow: [
                  'Java fallback: delegates to CP when snapshot missing or cold start',
                  'LKG serving: stale ingress radixtree continues; alert at 1-hour threshold',
                  'CP outage: edge continues proxying with last synced rules',
                  'Full resync every 300s backstops missed delta updates',
                ],
                config: [
                  'MENDR_JAVA_FALLBACK=true (default)',
                  'MENDR_FULL_RESYNC_INTERVAL_SEC=300',
                  'STALE_ALERT_SEC=3600',
                ],
                when: 'Built-in to all deployment models. Not a separate model — a resilience guarantee.',
                color: 'color-mix(in srgb, var(--mendr-success) 18%, var(--mendr-surface))',
                textColor: 'var(--mendr-success)',
              },
            ].map(model => (
              <div key={model.model} className="border border-rule rounded-2xl overflow-hidden flex flex-col">
                <div className="p-6" style={{ backgroundColor: model.color, color: model.textColor }}>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs font-mono font-bold opacity-60">{model.model}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${model.badgeColor}`}>{model.badge}</span>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] font-bold text-xl mb-2">{model.name}</h3>
                  <p className="text-xs leading-relaxed opacity-90">{model.desc}</p>
                </div>
                <div className="bg-surface p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="text-[10px] font-bold text-dim uppercase tracking-wide mb-2">Traffic flow</div>
                    <ul className="space-y-1.5">
                      {model.flow.map(item => (
                        <li key={item} className="flex items-start gap-2 text-xs text-on-surface">
                          <span className="text-brand mt-0.5 flex-shrink-0">→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <div className="text-[10px] font-bold text-dim uppercase tracking-wide mb-2">Configuration</div>
                    <div className="bg-canvas rounded-lg p-3 space-y-1">
                      {model.config.map(c => (
                        <div key={c} className="font-mono text-[10px] text-on-surface">{c}</div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto bg-canvas rounded-lg p-3">
                    <div className="text-[10px] font-bold text-dim uppercase tracking-wide mb-1">When to choose</div>
                    <div className="text-xs text-on-surface">{model.when}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future: Envoy/Istio */}
      <section className="bg-ink py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Forward Path</div>
              <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-white mb-4">
                From OpenResty today to Envoy and Istio tomorrow
              </h2>
              <p className="text-muted leading-relaxed mb-5">
                The codebase anticipates expansion beyond a single OpenResty gateway per site. RouteConfigSnapshotPublisher includes Envoy Wasm snapshot compatibility comments as a forward path.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Today', desc: 'OpenResty/LuaJIT gateway — full MendrScript capability in a single deployable container', done: true },
                  { label: 'Near-term', desc: 'gRPC-Web transcoding, Envoy transcoder integration comment in data plane', done: false },
                  { label: 'Medium-term', desc: 'Envoy sidecar federation — compile MendrScript programs for Wasm enforcement', done: false },
                  { label: 'Long-term', desc: 'Full mesh-native deployment at Istio scale — same MendrScript semantics, different enforcement surface', done: false },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.done ? 'bg-success' : 'bg-white/10'}`}>
                      {item.done ? (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-surface/30"></div>
                      )}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${item.done ? 'text-white' : 'text-muted'}`}>{item.label}</div>
                      <div className="text-xs text-dim mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-5">Edge capability tokens</div>
              <p className="text-sm text-muted mb-5">
                Edges advertise capabilities on sync. Control plane withholds incompatible snapshot fields rather than applying them silently — preventing subtle production bugs on older edge versions.
              </p>
              <div className="space-y-2 font-mono text-xs">
                {[
                  { token: 'v2', desc: 'DSL ops[] routes (MendrScript v2)' },
                  { token: 'ingress', desc: 'Transparent ingress tables' },
                  { token: 'traffic', desc: 'LB/canary/mirror features' },
                  { token: 'ratelimit', desc: 'Rate limit policies' },
                  { token: 'authz', desc: 'Auth policies (JWT/OIDC)' },
                  { token: 'cache', desc: 'Response cache config' },
                  { token: 'ai', desc: 'AI gateway routes' },
                  { token: 'waf', desc: 'WAF policies' },
                  { token: 'splice', desc: 'Streaming splice execution' },
                ].map(cap => (
                  <div key={cap.token} className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
                    <span className="bg-sky/15 text-[#93C5FD] px-2 py-0.5 rounded text-[10px] font-bold w-20 text-center flex-shrink-0">{cap.token}</span>
                    <span className="text-muted text-[10px]">{cap.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick start */}
      <section className="py-14 lg:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Quick Start</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              Up and running in minutes
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Start the full stack',
                code: 'git clone mendr-control-plane\ndocker compose up -d --build',
                desc: 'Postgres, Redis, Kafka, all Java services, conversation engine, Rust minimizer, and React dashboard.',
              },
              {
                step: '02',
                title: 'Start the edge gateway',
                code: 'git clone mendr-data-plane\nMENDR_CONTROL_PLANE_URL=... \\\n  docker compose up -d',
                desc: 'OpenResty gateway with local edge Redis. Configures GATEWAY_EDGE_API_KEY, MENDR_TENANT_ID.',
              },
              {
                step: '03',
                title: 'Register your first service',
                code: 'curl -X POST /api/services/import-openapi \\\n  -F "file=@openapi.yaml"',
                desc: 'Or use POST /api/services/import-manifest with a mendr.yaml for GitOps workflows.',
              },
            ].map(step => (
              <div key={step.step} className="border border-rule-strong rounded-xl overflow-hidden bg-surface shadow-sm">
                <div className="bg-sky px-5 py-4">
                  <div className="font-mono text-xs text-sky-ink opacity-60 mb-1">step {step.step}</div>
                  <div className="font-semibold text-sky-ink text-sm">{step.title}</div>
                </div>
                <div className="bg-ink px-4 py-3 border-y border-rule-strong">
                  <pre className="font-mono text-[10px] text-muted whitespace-pre leading-relaxed">{step.code}</pre>
                </div>
                <div className="bg-overlay px-5 py-4">
                  <p className="text-xs text-on-surface leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
