import type { NavigateFn } from '../App'
import HeroSpotlight from '../components/HeroSpotlight'

interface Props { navigate: NavigateFn }

const shipped = [
  // Data plane
  'OpenResty/LuaJIT gateway: envelope and transparent ingress modes',
  'Local edge Redis snapshot cache with last-known-good fallback',
  'Long-poll route config sync with capability tokens',
  'MendrScript: legacy buckets plus closed-opcode ops[] v2',
  'Streaming JSON rewrite with plan-class safety',
  'Protocol-aware splice abort plus SPLICE failure category',
  'WAF: builtin OWASP-inspired rules plus optional Coraza CRS',
  'JWT/OIDC authentication with JWKS cache',
  'Rate limiting, abuse detection, bot detection',
  'AI gateway: TPM/RPM, prompt firewall, semantic cache',
  'Load balancing: RR, weighted, consistent hash; canary; mirroring',
  'Circuit breaker plus active healthcheck',
  'Failure telemetry with PII scrub and edge dedup',
  'OTLP trace export plus Prometheus metrics',
  // Control plane
  'Service registry with OpenAPI and manifest import plus dry-run',
  'GitOps manifest push API',
  'Kafka pipeline: failures → analysis → approved → rule deploy',
  'LLM admission control: coalesce, semaphore, budgets, defer-with-ack',
  'Category-aware AI analysis (SCHEMA_MISMATCH, ROUTING, CORS, etc.)',
  'Conformal safety gate (auto-apply default OFF)',
  'MendrScript verify, simulate, compile, deploy',
  'Rust minimization sidecar',
  'Conversation engine plus SSE chat plus /diagnose',
  'Rule engine with audit log and disable',
  'Precedent store for similar-failure recall',
  'Service topology graph plus deterministic queries',
  'Multi-tenant row-level security plus Redis/Kafka isolation',
  'WorkOS JWT auth plus per-tenant API keys',
  'Operator dashboard: failures, analysis, rules, services, portal, simulate, audit',
  'Security CI: gitleaks, Trivy, CodeQL, npm/pip audit',
]

const nearTerm = [
  { title: 'Permanent-fix PR suggestions', desc: 'Propose lasting code fixes as pull requests by combining the error signature, service topology, pod logs, and other context Mendr already has.', status: 'Planned' },
  { title: 'Pruning parity CI', desc: 'Align delete semantics across Lua, Java, and Rust with shared fixtures. Phase 0 blocker.', status: 'Planned' },
  { title: 'Slack / PagerDuty notifications', desc: 'Real push notifications for pending-approval events beyond structured log placeholders.', status: 'Near' },
  { title: 'MendrScript Tier 2 opcode registry', desc: 'Governed process for adding new closed opcodes with human promotion.', status: 'Partial' },
  { title: 'Cluster pod log relay', desc: 'A small Kubernetes service beside the gateway reads application pod logs in that cluster and forwards them to the control plane for richer diagnosis.', status: 'Planned' },
  { title: 'Anomaly detection across business flows', desc: 'Baseline normal behavior per service pair and flow, then alert on spikes, drops, or inconsistencies before they become incidents. Correlate API signals with outcomes like checkout, payout, and onboarding.', status: 'Planned' },
  { title: 'gRPC-Web transcoding', desc: 'Envoy transcoder integration for gRPC-first services behind the gateway.', status: 'Planned' },
  { title: 'Frontend API key management UI', desc: 'Self-service key rotation in the operator dashboard without CLI.', status: 'Optional' },
]

const mediumTerm = [
  { icon: '🔀', title: 'CI contract gates', desc: 'Mendr contract checks in customer CI/CD, similar to Spectral or Pact, to catch drift before production.' },
  { icon: '📊', title: 'Drift dashboard', desc: 'One view of declared OpenAPI vs observed traffic vs healed endpoints.' },
  { icon: '🔁', title: 'OpenAPI sync automation', desc: 'Bi-directional sync between service registry and live OpenAPI specs in Git repositories — reducing manual import friction during development cycles.' },
  { icon: '💬', title: 'Slack/Teams approval workflows', desc: 'Approval cards in operator channels without skipping the audit trail.' },
  { icon: '🌐', title: 'Multi-cluster federation', desc: 'Fleet management for edges across regions with consistent tenant policy.' },
  { icon: '⚡', title: 'Envoy / Istio sidecar snapshots', desc: 'Compile MendrScript for Wasm sidecar enforcement at mesh scale.' },
]

const longTerm = [
  { title: 'Intelligent control plane for distributed systems', desc: 'Evolve Mendr beyond detect-and-fix into a full intelligent control plane: enforce safe boundaries, guide system behavior, and keep correctness across services in real time. Observability, governance, and runtime intelligence become the layer that keeps complex systems predictable and trustworthy at scale.' },
  { title: 'Agentic setup over A2A', desc: 'A Mendr setup agent that discovers and talks to a customer platform agent via the open Agent2Agent (A2A) protocol. Together they propose gateway, SDK, and edge installs as GitOps PRs or approval-gated Helm applies under least-privilege RBAC. Manual onboarding shrinks; agents never get open cluster-admin.' },
  { title: 'eBPF node agent (no sidecars)', desc: 'One agent per node taps sockets and TLS in the Linux kernel via eBPF, parses traffic in userspace, and feeds the same control-plane pipeline. Application pods stay untouched.' },
  { title: 'Business-logic awareness across services', desc: 'A separate capability that learns how each system is supposed to behave in business terms. When the technical engine is unsure, it can explain why. Teams share upcoming plans (for example scaling for a demand spike); Mendr notifies downstream services that would feel the change so conversations happen before poorly communicated upstream designs force last-minute rewrites.' },
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
            What is shipped, what is planned, and where we are headed. Shipped items are verifiable and production ready. Roadmap items are labeled as such.
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
            <span className="text-xs text-dim">Strategic intent, not committed delivery dates</span>
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
              Integration resilience should sit under traffic the way TLS termination does: always on, until the permanent fix ships.
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
            Measure impact against your incident data
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
