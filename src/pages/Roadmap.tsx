import type { NavigateFn } from '../App'
import HeroSpotlight from '../components/HeroSpotlight'

interface Props { navigate: NavigateFn }

const shipped = [
  // Data plane
  'OpenResty/LuaJIT gateway — envelope and transparent ingress modes',
  'Local edge Redis AOF snapshot cache with LKG fallback',
  'Long-poll route config sync with capability tokens',
  'MendrScript — legacy buckets + closed-opcode ops[] v2',
  'Streaming splice JSON rewrite with plan-class safety',
  'Protocol-aware splice abort + SPLICE failure category',
  'WAF — builtin OWASP-inspired rules + optional Coraza CRS',
  'JWT/OIDC authentication with JWKS cache',
  'Rate limiting, abuse detection, bot detection',
  'AI gateway — TPM/RPM, prompt firewall, semantic cache',
  'Load balancing — RR, weighted, consistent hash; canary; mirroring',
  'Circuit breaker + active healthcheck',
  'Failure telemetry with PII scrub and edge dedup',
  'OTLP trace export + Prometheus metrics',
  // Control plane
  'Service registry with OpenAPI and manifest import + dry-run',
  'GitOps manifest push API',
  'Kafka pipeline: failures → analysis → approved → rule deploy',
  'LLM admission control — coalesce, semaphore, budgets, defer-with-ack',
  'Category-aware AI analysis (SCHEMA_MISMATCH, ROUTING, CORS, etc.)',
  'Conformal + Venn-Abers safety gate (auto-apply default OFF)',
  'MendrScript verify, simulate, compile, deploy (DSL_PROGRAM)',
  'Rust minimization sidecar — ddmin + egg EqSat + prove_minimal',
  'LangGraph conversation engine + SSE chat + /diagnose',
  'Rule engine with audit log and disable',
  'Precedent commit to pgvector for GraphRAG recall',
  'Service topology SCD2 graph + deterministic CTE queries',
  'Multi-tenant FORCE RLS + Redis/Kafka isolation',
  'WorkOS JWT auth + per-tenant API keys',
  'Operator dashboard — failures, analysis, rules, services, portal, simulate, audit',
  'Security CI — gitleaks, Trivy, CodeQL, npm/pip audit',
]

const nearTerm = [
  { title: 'Smart rule optimizer', desc: 'EqSat relocate fusion, candidate generator, POST /optimize endpoint, Portal Monaco UX for interactive program editing', status: 'Planned' },
  { title: 'Pruning parity CI', desc: 'Align empty-parent delete semantics across Lua, Java, and Rust with shared parity fixtures — Phase 0 blocker', status: 'Planned' },
  { title: 'Slack / PagerDuty notifications', desc: 'Wire notification-service beyond structured log placeholder to real push notifications for PENDING_APPROVAL events', status: 'Near' },
  { title: 'MendrScript Tier 2 opcode registry', desc: 'Governed opcode discovery process and human promotion workflow for extending the closed opcode set', status: 'Partial' },
  { title: 'Per-tenant warm publish on boot', desc: 'Snapshot republication for all tenants on control-plane startup — documented gap in current implementation', status: 'Gap' },
  { title: 'gRPC-Web transcoding', desc: 'Envoy transcoder integration in data plane for gRPC-first services behind the gateway', status: 'Planned' },
  { title: 'Frontend API key management UI', desc: 'Self-service key rotation in operator dashboard without CLI operations', status: 'Optional' },
]

const mediumTerm = [
  { icon: '🔀', title: 'CI contract gates', desc: 'First-class Mendr contract validation in customer CI/CD — Spectral/Pact-like workflows to prevent drift before production. Shift-left plus shift-now.' },
  { icon: '📊', title: 'Drift dashboard', desc: 'Unified view of OpenAPI-declared versus traffic-observed versus healed-drift endpoints. Leverages topology SCD2 and failure analytics rollups.' },
  { icon: '🔁', title: 'OpenAPI sync automation', desc: 'Bi-directional sync between service registry and live OpenAPI specs in Git repositories — reducing manual import friction during development cycles.' },
  { icon: '💬', title: 'Slack/Teams approval workflows', desc: 'Push HITL approval cards to operator channels — accelerating approval latency without bypassing the audit trail.' },
  { icon: '🌐', title: 'Multi-cluster federation', desc: 'Fleet management for edges across regions/clusters with consistent tenant policy — extends capability-gated sync model to fleet scale.' },
  { icon: '⚡', title: 'Envoy / Istio sidecar snapshots', desc: 'Compile MendrScript programs for Wasm sidecar enforcement at mesh scale — same semantics, different enforcement surface.' },
]

const longTerm = [
  { title: 'Integration resilience as infrastructure', desc: 'Every API call self-corrects within policy bounds until the permanent fix ships. Integration resilience becomes as assumed as TLS termination.' },
  { title: 'Cross-tenant anonymized precedent pool', desc: 'Opt-in customers contribute failure signatures that improve diagnosis for all — privacy-gated corpus with network effects. Schema already in Postgres migrations.' },
  { title: 'Sandboxed Lua shadow lab (Tier 3)', desc: 'Learn candidate primitives off the hot path. Only human-promoted opcodes enter the closed registry. LLM-generated Lua never reaches production.' },
  { title: 'Opt-in conformal auto-apply', desc: 'Organizations with calibrated trust thresholds enable automatic deploy for narrow confidence bands. Default remains HITL. Calibration data pipeline already in place.' },
]

export default function Roadmap({ navigate }: Props) {
  return (
    <div>
      {/* Header */}
      <HeroSpotlight className="border-b border-rule py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">Platform</div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[clamp(2rem,5vw,3.2rem)] leading-[1.15] tracking-tight text-on-surface mb-5">
            Roadmap
          </h1>
          <p className="text-lg text-dim leading-relaxed max-w-2xl mx-auto">
            What{"'"}s shipped, what{"'"}s planned, and where we{"'"}re going. Shipped items are verifiable in the current repositories. Roadmap items are explicitly labeled.
          </p>
        </div>
      </HeroSpotlight>

      {/* Shipped */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-xl tracking-tight text-on-surface">Shipped today</h2>
            <span className="bg-success/20 text-success text-xs font-bold px-2.5 py-1 rounded-full">{shipped.length} capabilities</span>
          </div>
          <div className="bg-surface border border-rule rounded-2xl overflow-hidden">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 divide-y divide-[#F3F4F6] sm:divide-y-0 sm:[&>*:not(:nth-child(2n+1))]:border-l sm:[&>*:not(:nth-child(2n+1))]:border-overlay lg:[&>*:not(:nth-child(3n+1))]:border-l lg:[&>*:not(:nth-child(3n+1))]:border-overlay">
              {shipped.map((item, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                  <svg className="w-4 h-4 text-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-on-surface leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Near-term */}
      <section className="bg-surface border-y border-rule py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-xl tracking-tight text-on-surface">Near-term roadmap</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {nearTerm.map(item => (
              <div key={item.title} className="border border-rule rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-on-surface">{item.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    item.status === 'Near' ? 'bg-warning/20 text-warning' :
                    item.status === 'Partial' ? 'bg-sky text-sky-ink' :
                    item.status === 'Gap' ? 'bg-error/15 text-error' :
                    'bg-overlay text-dim'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-dim leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Medium-term */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-xl tracking-tight text-on-surface">Medium-term vision</h2>
            <span className="text-xs text-dim">Strategic intent — not committed delivery dates</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mediumTerm.map(item => (
              <div key={item.title} className="bg-surface border border-rule rounded-xl p-5">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="text-sm font-semibold text-on-surface mb-2">{item.title}</h3>
                <p className="text-xs text-dim leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Long-term vision */}
      <section className="bg-ink py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">North Star</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-white mb-4">
              Long-term vision
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Integration resilience becomes as assumed as TLS termination — not a project, not a runbook step, but infrastructure.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {longTerm.map(item => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-cream"></div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                </div>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl tracking-tight text-on-surface mb-3">
            What{"'"}s the business case?
          </h2>
          <p className="text-sm text-dim mb-6">
            Quantify the value Mendr delivers against your own incident data with our ROI framework.
          </p>
          <button onClick={() => navigate('roi')} className="bg-brand text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-brand-dark transition-colors text-sm">
            Calculate business impact
          </button>
        </div>
      </section>
    </div>
  )
}
