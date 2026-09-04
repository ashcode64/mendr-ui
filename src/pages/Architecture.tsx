import type { NavigateFn } from '../App'
import HeroSpotlight from '../components/HeroSpotlight'

interface Props { navigate: NavigateFn }

const asyncBoundaries = [
  { interaction: 'Proxy request/response', pattern: 'Sync on edge', latencyImpact: 'None from CP' },
  { interaction: 'Failure report', pattern: 'Async timer POST', latencyImpact: 'None' },
  { interaction: 'Route sync', pattern: 'Long-poll background worker', latencyImpact: 'None' },
  { interaction: 'AI analysis', pattern: 'Kafka consumer', latencyImpact: 'None' },
  { interaction: 'Operator approval', pattern: 'HTTPS to CP', latencyImpact: 'None until next sync' },
  { interaction: 'Java fallback', pattern: 'Sync HTTPS to CP', latencyImpact: 'Adds CP RTT — degraded mode only' },
]

const controlPlaneServices = [
  { name: 'api-gateway', port: 8095, lang: 'Java', desc: 'Registry, snapshots, sync, failure ingest, Java proxy, portal, GitOps, MendrScript verify/simulate/minimize' },
  { name: 'ai-analysis-service', port: 8082, lang: 'Java', desc: 'Kafka failure consumer, LLM admission, safety gate, conformal, learning MCP tools' },
  { name: 'conversation-engine', port: 8085, lang: 'Python', desc: 'SSE chat, /diagnose, embeddings, LangGraph MendrScript synthesis, GEPA compile hooks' },
  { name: 'rule-engine', port: 8084, lang: 'Java', desc: 'Approved rule storage, disable, audit log, precedent commit to pgvector' },
  { name: 'notification-service', port: 8083, lang: 'Java', desc: 'Kafka consumer for analysis results; Slack/PagerDuty roadmap' },
  { name: 'mendr-minimize', port: 8099, lang: 'Rust', desc: 'ddmin necessity, egg EqSat rewrite rules, prove_minimal subsequence search' },
  { name: 'frontend', port: 3000, lang: 'React', desc: 'Operator dashboard, nginx → backend proxies, WorkOS auth, SSE chat interface' },
]

export default function Architecture({ navigate }: Props) {
  return (
    <div>
      {/* Header */}
      <HeroSpotlight className="border-b border-rule py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">Technology</div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[clamp(2rem,5vw,3.2rem)] leading-[1.15] tracking-tight text-on-surface mb-5">
            Two-plane architecture
          </h1>
          <p className="text-lg text-dim leading-relaxed max-w-2xl mx-auto">
            Separating latency-sensitive enforcement from latency-tolerant intelligence. The data plane keeps serving even when the control plane is temporarily unavailable.
          </p>
        </div>
      </HeroSpotlight>

      {/* Architecture diagram */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Data plane */}
            <div className="border-2 border-rule rounded-2xl overflow-hidden">
              <div className="bg-sky px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-brand uppercase tracking-widest mb-0.5">Data Plane</div>
                  <div className="font-[family-name:var(--font-display)] font-bold text-lg text-brand">mendr-data-plane</div>
                </div>
                <span className="text-xs font-mono bg-brand text-white px-2.5 py-1 rounded-md">OpenResty/LuaJIT</span>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-sm text-dim mb-5">
                  Deployed in customer VPCs. Handles all proxy traffic locally. Never requires a round-trip to the control plane on the hot path.
                </p>
                {[
                  { name: 'mendr-gateway', desc: 'Proxy, WAF, auth, rate limit, AI gateway, transforms', port: '8080' },
                  { name: 'edge-redis (AOF)', desc: 'Route config snapshots, LKG fallback, usage metering', port: '6380' },
                  { name: 'ingress radixtrees', desc: 'Per-worker route resolution, multi-worker lock protocol', port: '' },
                  { name: 'sync_client.lua', desc: 'Background long-poll, cap token negotiation, resync timer', port: '' },
                ].map(svc => (
                  <div key={svc.name} className="flex items-start gap-3 bg-surface border border-rule rounded-lg p-3.5">
                    <div className="w-2 h-2 rounded-full bg-brand mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-on-surface">{svc.name}</span>
                        {svc.port && <span className="text-[10px] bg-overlay text-dim px-1.5 py-0.5 rounded font-mono">:{svc.port}</span>}
                      </div>
                      <div className="text-xs text-dim mt-0.5">{svc.desc}</div>
                    </div>
                  </div>
                ))}

                <div className="bg-success/10 border border-success/40 rounded-lg p-4 mt-4">
                  <div className="text-xs font-bold text-[#16A34A] mb-1">Resilience guarantee</div>
                  <div className="text-xs text-success">
                    Edge serves from last-known-good Redis snapshots during control-plane outages. Existing approved transforms keep working. New heals unavailable until CP returns.
                  </div>
                </div>
              </div>
            </div>

            {/* Control plane */}
            <div className="border-2 border-rule rounded-2xl overflow-hidden">
              <div className="bg-ink border-b border-rule px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-0.5">Control Plane</div>
                  <div className="font-[family-name:var(--font-display)] font-bold text-lg text-white">mendr-control-plane</div>
                </div>
                <span className="text-xs font-mono bg-white/10 text-muted px-2.5 py-1 rounded-md">Java · Python · Rust</span>
              </div>
              <div className="p-6 space-y-2">
                <p className="text-sm text-dim mb-5">
                  Cloud-hosted SaaS or on-prem. Runs analysis, stores rules, publishes snapshots, serves the operator dashboard and developer portal.
                </p>
                {controlPlaneServices.map(svc => (
                  <div key={svc.name} className="flex items-start gap-3 bg-surface border border-rule rounded-lg p-3">
                    <div className="w-2 h-2 rounded-full bg-[#6B7280] mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-semibold text-on-surface">{svc.name}</span>
                        <span className="text-[10px] bg-overlay text-dim px-1.5 py-0.5 rounded font-mono">:{svc.port}</span>
                        <span className="text-[10px] bg-sky text-sky-ink px-1.5 py-0.5 rounded font-semibold">{svc.lang}</span>
                      </div>
                      <div className="text-xs text-dim mt-0.5 leading-relaxed">{svc.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Connection between planes */}
          <div className="mt-6 bg-surface border border-rule rounded-xl p-6">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">Inter-plane communication</div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  direction: 'Edge → CP',
                  calls: ['POST /api/internal/failures (async)', 'POST /api/internal/edge-observations (async)', 'POST /api/internal/validate-response (async)'],
                  color: '#FEE2E2',
                  textColor: '#D92D20',
                },
                {
                  direction: 'Edge ← CP',
                  calls: ['GET /v1/sync/routeconfig (long-poll)', '304 No Content or full snapshot', 'Capability-gated JSON payload'],
                  color: '#D1FAE5',
                  textColor: '#065F46',
                },
                {
                  direction: 'Edge ↔ CP (degraded)',
                  calls: ['POST /api/gateway/proxy (Java fallback)', 'Only when snapshot missing or cold start', 'Adds CP RTT — not the happy path'],
                  color: '#FEF3C7',
                  textColor: '#92400E',
                },
              ].map(comm => (
                <div key={comm.direction} className="bg-canvas rounded-lg p-4">
                  <div className="text-xs font-bold mb-2" style={{ color: comm.textColor }}>{comm.direction}</div>
                  <ul className="space-y-1.5">
                    {comm.calls.map(call => (
                      <li key={call} className="text-xs text-on-surface font-mono leading-relaxed">{call}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Design principles */}
      <section className="bg-surface border-y border-rule py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Design Philosophy</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              Three principles that govern every decision
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Deterministic over probabilistic',
                desc: 'LLMs propose hypotheses. Output is constrained into closed-opcode MendrScript, minimized, verified, and gated. The edge never executes raw model text.',
              },
              {
                num: '02',
                title: 'Observe at the edge, decide in the control plane, enforce locally',
                desc: 'Analysis is asynchronous via Kafka. The data plane serves on last-known-good Redis snapshots even if the control plane or its Redis is temporarily degraded.',
              },
              {
                num: '03',
                title: 'Gate the model, not Kafka',
                desc: 'Over-budget or coalesced LLM work is acknowledged and deferred — metric + log — never nack-retried into an LLM cost storm. Message bus health does not couple to LLM vendor rate limits.',
              },
            ].map(p => (
              <div key={p.num} className="border border-rule rounded-xl p-6">
                <div className="font-[family-name:var(--font-display)] font-bold text-5xl text-rule-strong mb-4 leading-none">{p.num}</div>
                <h3 className="font-semibold text-on-surface mb-3 text-sm leading-snug">{p.title}</h3>
                <p className="text-xs text-dim leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Async vs sync table */}
      <section className="py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Latency Analysis</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              Async vs. sync boundaries
            </h2>
          </div>
          <div className="bg-surface border border-rule rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule bg-canvas">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-dim uppercase tracking-wide">Interaction</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-dim uppercase tracking-wide">Pattern</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-dim uppercase tracking-wide">Latency impact on proxy</th>
                </tr>
              </thead>
              <tbody>
                {asyncBoundaries.map((row, i) => (
                  <tr key={i} className="border-b border-overlay last:border-0 hover:bg-canvas transition-colors">
                    <td className="px-6 py-3.5 text-on-surface font-medium text-sm">{row.interaction}</td>
                    <td className="px-6 py-3.5 font-mono text-xs text-on-surface">{row.pattern}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-semibold ${row.latencyImpact === 'None' ? 'text-success' : row.latencyImpact.startsWith('None until') ? 'text-[#F59E0B]' : 'text-error'}`}>
                        {row.latencyImpact}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="bg-ink py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Infrastructure</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-white">
              Control plane infrastructure stack
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Postgres 15', sub: 'pgvector + FORCE RLS', icon: '🗄️' },
              { name: 'Redis 7', sub: 'Snapshot cache + dedup', icon: '⚡' },
              { name: 'Kafka 7.4', sub: 'Async pipeline + Zookeeper', icon: '📨' },
              { name: 'Docker Compose', sub: 'Full stack deployment', icon: '🐳' },
            ].map(infra => (
              <div key={infra.name} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">{infra.icon}</div>
                <div className="text-sm font-semibold text-white mb-0.5">{infra.name}</div>
                <div className="text-xs text-muted">{infra.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl tracking-tight text-on-surface mb-3">
            Want to see what runs at the edge?
          </h2>
          <p className="text-sm text-dim mb-6">
            MendrScript is the verified DSL that compiles from control-plane proposals to edge-local execution — without LLM output ever touching the hot path.
          </p>
          <button onClick={() => navigate('mendrscript')} className="bg-brand text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-brand-dark transition-colors text-sm">
            Explore MendrScript
          </button>
        </div>
      </section>
    </div>
  )
}
