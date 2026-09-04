import { useState } from 'react'
import type { NavigateFn } from '../App'
import HeroSpotlight from '../components/HeroSpotlight'

interface Props { navigate: NavigateFn }

type TabId = 'detect' | 'diagnose' | 'approve' | 'heal'

const tabs: { id: TabId; label: string; color: string; textColor: string }[] = [
  { id: 'detect', label: 'Detect', color: 'var(--mendr-sky)', textColor: 'var(--mendr-sky-ink)' },
  { id: 'diagnose', label: 'Diagnose', color: 'var(--mendr-cream)', textColor: 'var(--mendr-cream-ink)' },
  { id: 'approve', label: 'Approve', color: 'color-mix(in srgb, var(--mendr-success) 18%, transparent)', textColor: 'var(--mendr-success)' },
  { id: 'heal', label: 'Heal', color: 'var(--mendr-brand)', textColor: '#FFFFFF' },
]

const tabContent: Record<TabId, React.ReactNode> = {
  detect: (
    <div className="grid lg:grid-cols-2 gap-10 items-start">
      <div>
        <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface mb-4">
          Edge-local failure classification
        </h2>
        <p className="text-dim leading-relaxed mb-6">
          The data plane edge observes every proxied call. In the <span className="font-mono text-xs bg-overlay px-1.5 py-0.5 rounded">log.lua</span> phase, failures trigger on HTTP 4xx/5xx responses or when a streaming splice transform aborts after partial response flush.
        </p>
        <div className="space-y-4">
          {[
            { step: '1', title: 'Classify', desc: 'classify_failure() inspects status code, headers, and body to assign SCHEMA_MISMATCH, ROUTING, CORS, SPLICE, or UNKNOWN.' },
            { step: '2', title: 'Deduplicate', desc: 'Atomic shared-memory add on fail:{source}:{target}:{endpoint}:{category} with a 60-second window. One report per failure window — no telemetry storms.' },
            { step: '3', title: 'PII scrub', desc: 'pii_redact.lua removes SSN, card numbers, emails, bearer tokens, and password keys before any data leaves the customer network.' },
            { step: '4', title: 'Report async', desc: 'POST /api/internal/failures fires asynchronously on a timer. No per-request control-plane latency — the proxy path is unaffected.' },
          ].map(item => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-7 h-7 rounded-full bg-sky flex items-center justify-center flex-shrink-0 font-bold text-xs text-brand">
                {item.step}
              </div>
              <div>
                <div className="text-sm font-semibold text-on-surface mb-0.5">{item.title}</div>
                <div className="text-xs text-dim leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-ink border border-rule rounded-xl p-5 font-mono text-xs overflow-auto">
          <div className="text-dim mb-3">-- log.lua (data plane)</div>
          <div className="text-cream">local status = ngx.var.upstream_status</div>
          <div className="text-cream mt-1">if tonumber(status) &gt;= 400 then</div>
          <div className="text-muted ml-4">local category = classify_failure(ctx)</div>
          <div className="text-muted ml-4">local deduped = dedup.add(ctx, category)</div>
          <div className="text-muted ml-4">if deduped then</div>
          <div className="text-muted ml-8">local redacted = pii_redact(ctx)</div>
          <div className="text-muted ml-8">report_failure_async(redacted, category)</div>
          <div className="text-muted ml-4">end</div>
          <div className="text-cream">end</div>
        </div>

        <div className="bg-surface border border-rule rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-rule bg-canvas">
            <span className="text-xs font-semibold text-dim uppercase tracking-wide">Recent failures</span>
          </div>
          {[
            { time: '14:23:41', source: 'inventory', target: 'shipping', category: 'SCHEMA_MISMATCH', status: 400 },
            { time: '14:23:38', source: 'payment', target: 'billing', category: 'SCHEMA_MISMATCH', status: 400 },
            { time: '14:22:11', source: 'bff', target: 'catalog', category: 'CORS', status: 403 },
            { time: '14:19:55', source: 'api', target: 'legacy-svc', category: 'ROUTING', status: 502 },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 border-b border-overlay last:border-0 text-xs">
              <span className="text-dim font-mono">{row.time}</span>
              <span className="font-mono text-on-surface">{row.source}→{row.target}</span>
              <span className="ml-auto font-mono bg-sky text-sky-ink px-2 py-0.5 rounded text-[10px] font-semibold">
                {row.category}
              </span>
              <span className="text-error font-mono font-semibold">{row.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  diagnose: (
    <div className="grid lg:grid-cols-2 gap-10 items-start">
      <div>
        <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface mb-4">
          AI analysis under admission control
        </h2>
        <p className="text-dim leading-relaxed mb-6">
          The <span className="font-mono text-xs bg-overlay px-1.5 py-0.5 rounded">ai-analysis-service</span> consumes failure events from Kafka under strict LLM admission control. Diagnosis routes through a LangGraph conversation engine that produces verified MendrScript — never freeform code.
        </p>
        <div className="space-y-4 mb-6">
          {[
            { title: 'Admission control', desc: 'Coalesce duplicate requests (30s Redis TTL), semaphore (default: 2 concurrent LLM calls), 30/min global + 10/min per-tenant budget. Over-budget work is deferred with Kafka ack — never retried into a cost storm.' },
            { title: 'Error signature assembly', desc: 'Contract context from OpenAPI, service topology from Postgres SCD2 graph, and GraphRAG precedents from pgvector. The LLM sees a constrained, factual context.' },
            { title: 'VeriGuard synthesis loop', desc: 'LangGraph nodes: propose MendrScript → verify_program → simulate_transform → refine. The loop runs until the program passes simulation against sample payloads.' },
            { title: 'Rust minimization', desc: 'mendr-minimize applies ddmin necessity, egg EqSat rewrite rules, and prove_minimal subsequence search before presenting the proposal to the operator.' },
          ].map(item => (
            <div key={item.title} className="bg-surface border border-rule rounded-lg p-4">
              <div className="text-sm font-semibold text-on-surface mb-1">{item.title}</div>
              <div className="text-xs text-dim leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-surface border border-rule rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-rule bg-canvas">
            <span className="text-xs font-semibold text-dim uppercase tracking-wide">Proposed MendrScript</span>
          </div>
          <div className="p-5 font-mono text-xs bg-ink rounded-b-xl">
            <div className="text-muted">schemaVersion: <span className="text-cream">mendrscript/v1</span></div>
            <div className="text-muted mt-1">meta:</div>
            <div className="text-muted ml-4">route: <span className="text-brand">inventory→shipping POST /ship</span></div>
            <div className="text-muted ml-4">side: <span className="text-brand">request</span></div>
            <div className="text-muted mt-1">ops:</div>
            <div className="text-muted ml-4">- op: <span className="text-success">rename</span></div>
            <div className="text-muted ml-6">from: <span className="text-error">/mag_sent</span></div>
            <div className="text-muted ml-6">to: <span className="text-success">/tag_sent</span></div>
            <div className="text-cream mt-3 text-[10px]"># Minimized: 1 op (from 3 candidate ops)</div>
            <div className="text-cream text-[10px]"># Verified: Java + Lua parity ✓</div>
            <div className="text-cream text-[10px]"># Simulated: 5/5 sample payloads ✓</div>
          </div>
        </div>

        <div className="bg-cream border border-rule rounded-xl p-5">
          <div className="text-xs font-bold text-cream-ink uppercase tracking-wide mb-3">Admission control state</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'LLM calls', value: '2/2', sub: 'semaphore slots' },
              { label: 'Global budget', value: '12/30', sub: 'calls/min used' },
              { label: 'Deferred', value: '3', sub: 'in Kafka queue' },
            ].map(m => (
              <div key={m.label} className="text-center">
                <div className="font-[family-name:var(--font-display)] font-bold text-xl text-cream-ink">{m.value}</div>
                <div className="text-[10px] text-cream-ink opacity-70">{m.label}</div>
                <div className="text-[10px] text-cream-ink opacity-50">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),

  approve: (
    <div className="grid lg:grid-cols-2 gap-10 items-start">
      <div>
        <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface mb-4">
          Human-in-the-loop safety gate
        </h2>
        <p className="text-dim leading-relaxed mb-6">
          Every proposed heal passes through <span className="font-mono text-xs bg-overlay px-1.5 py-0.5 rounded">SafetyGateService.java</span>. Auto-apply defaults to off — operators review confidence bars and approve or reject from the dashboard.
        </p>

        <div className="bg-surface border border-rule rounded-xl overflow-hidden mb-5">
          <div className="px-5 py-3 border-b border-rule bg-canvas text-xs font-semibold text-dim uppercase tracking-wide">
            Safety gate decision flow
          </div>
          <div className="p-5 space-y-2">
            {[
              { check: 'refuseAutoHeal?', yes: 'PENDING_APPROVAL', no: 'continue' },
              { check: 'Program deployable?', yes: 'continue', no: 'PENDING_APPROVAL' },
              { check: 'Venn-Abers interval wide?', yes: 'PENDING_APPROVAL', no: 'continue' },
              { check: 'Conformal abstain?', yes: 'PENDING_APPROVAL', no: 'continue' },
              { check: 'Auto-apply enabled? (opt-in)', yes: 'APPROVED', no: 'PENDING_APPROVAL' },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center text-success font-bold flex-shrink-0 text-[10px]">
                  {i + 1}
                </div>
                <div className="flex-1 font-mono text-on-surface">{row.check}</div>
                <div className="text-right">
                  <span className="text-success font-semibold">→ {row.yes}</span>
                  {row.no !== 'continue' && <span className="text-error ml-2">| ✗ → {row.no}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-success/15 border border-success/40 rounded-lg p-4">
          <div className="text-xs font-bold text-success mb-1">Default: auto-apply OFF</div>
          <div className="text-xs text-success">
            <span className="font-mono">mendr.conformal.auto-apply-enabled: false</span>. Operators must explicitly opt-in after calibration review. This is a product-level commitment, not a configuration hint.
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Dashboard mockup */}
        <div className="bg-surface border border-rule rounded-xl overflow-hidden shadow-sm">
          <div className="bg-canvas border-b border-rule px-5 py-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface">Pending approval — 2 proposals</span>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-error"></div>
              <div className="w-2 h-2 rounded-full bg-warning"></div>
              <div className="w-2 h-2 rounded-full bg-success"></div>
            </div>
          </div>
          {[
            { route: 'inventory→shipping POST /ship', op: 'rename /mag_sent → /tag_sent', confidence: 94, label: 'High confidence' },
            { route: 'payment→billing POST /charge', op: 'coerce /amount string→number', confidence: 71, label: 'Moderate — review required' },
          ].map((item, i) => (
            <div key={i} className="px-5 py-4 border-b border-overlay last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-xs font-mono text-brand mb-0.5">{item.route}</div>
                  <div className="text-xs text-on-surface font-medium">{item.op}</div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ml-4 ${
                  item.confidence > 90 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                }`}>
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-1.5 bg-overlay rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.confidence}%`,
                      backgroundColor: item.confidence > 90 ? '#22C55E' : '#F59E0B',
                    }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-on-surface">{item.confidence}%</span>
              </div>
              <div className="flex gap-2">
                <button className="text-xs bg-brand text-white font-semibold px-3 py-1.5 rounded-md hover:bg-brand-dark transition-colors">
                  Approve
                </button>
                <button className="text-xs border border-rule text-dim font-medium px-3 py-1.5 rounded-md hover:bg-canvas transition-colors">
                  Reject
                </button>
                <button className="text-xs text-brand font-medium px-3 py-1.5 hover:underline">
                  Chat with AI
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  heal: (
    <div className="grid lg:grid-cols-2 gap-10 items-start">
      <div>
        <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface mb-4">
          Edge-local patch deployment
        </h2>
        <p className="text-dim leading-relaxed mb-6">
          Approval publishes to Kafka <span className="font-mono text-xs bg-overlay px-1.5 py-0.5 rounded">api.transformations.approved</span>. The rule-engine deploys to Postgres, evicts Redis cache, commits precedents to pgvector, and triggers snapshot republication.
        </p>

        <div className="space-y-4 mb-6">
          {[
            { title: 'Snapshot materialization', desc: 'RouteConfigSnapshotPublisher compiles approved rules into capability-gated JSON snapshots. Edges that lack a capability token receive a snapshot without that field — no silent partial enforcement.' },
            { title: 'Long-poll sync', desc: 'Edges poll GET /v1/sync/routeconfig?since=&caps= approximately every 30 seconds. The server holds up to 35 seconds before returning 304 (no change) or a new payload.' },
            { title: 'Local Redis write', desc: 'On sync, the edge writes route configs to mendr:routeconfig:{source}:{target}:{endpoint} with AOF persistence. Rebuilds ingress radixtrees with lock + last-known-good fallback.' },
            { title: 'Transform execution', desc: 'Request transforms run before upstream call. Response transforms run in body_filter. Streaming splice chosen for structural ops; DOM buffer for UNBOUNDED or conditionals.' },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-on-surface mb-0.5">{item.title}</div>
                <div className="text-xs text-dim leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-ink border border-rule rounded-xl p-5 font-mono text-xs">
          <div className="text-dim mb-3">-- Edge heal in action</div>
          <div className="text-muted">Request arrives:</div>
          <div className="bg-error/10 border border-error/20 rounded p-3 mt-1 mb-3">
            <div className="text-error">POST /ship</div>
            <div className="text-muted">{"{"} "mag_sent": "ORD-1729", ... {"}"}</div>
          </div>
          <div className="text-muted">transform.apply_program() executes rename op:</div>
          <div className="text-muted mt-1 ml-2">{"{"} "tag_sent": "ORD-1729", ... {"}"}</div>
          <div className="mt-3 text-muted">Upstream receives corrected payload:</div>
          <div className="bg-success/10 border border-success/20 rounded p-3 mt-1">
            <div className="text-success">POST /ship → 200 OK</div>
            <div className="text-muted">Shipment confirmed. Customer unaffected.</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Time to sync after approval', value: '~30s' },
            { label: 'Patch TTL', value: 'Configurable' },
            { label: 'Streams affected', value: 'Zero restarts' },
            { label: 'Audit record', value: 'Immutable' },
          ].map(m => (
            <div key={m.label} className="bg-surface border border-rule rounded-lg p-4 text-center">
              <div className="font-[family-name:var(--font-display)] font-bold text-lg text-brand">{m.value}</div>
              <div className="text-xs text-dim mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

export default function TheLoop({ navigate }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('detect')

  return (
    <div>
      {/* Header */}
      <HeroSpotlight className="border-b border-rule py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">The Healing Loop</div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[clamp(2rem,5vw,3rem)] leading-[1.15] tracking-tight text-on-surface mb-5">
            Detect · Diagnose · Approve · Heal
          </h1>
          <p className="text-lg text-dim leading-relaxed max-w-2xl mx-auto">
            Each step has a specific technical implementation. No step is hand-wavy — everything maps to code you can read in the repositories.
          </p>
        </div>
      </HeroSpotlight>

      {/* Tab navigation */}
      <div className="sticky top-[60px] z-40 bg-canvas/95 backdrop-blur-sm border-b border-rule">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-5 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-brand text-brand'
                    : 'border-transparent text-dim hover:text-on-surface'}`}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ backgroundColor: tab.color, color: tab.textColor }}
                >
                  {i + 1}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div key={activeTab} className="animate-fade-in">
            {tabContent[activeTab]}
          </div>
        </div>
      </section>

      {/* Navigation between tabs */}
      <div className="border-t border-rule py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button
            onClick={() => {
              const idx = tabs.findIndex(t => t.id === activeTab)
              if (idx > 0) setActiveTab(tabs[idx - 1].id)
            }}
            disabled={activeTab === 'detect'}
            className="flex items-center gap-2 text-sm font-medium text-dim hover:text-on-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Previous step
          </button>

          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-2 h-2 rounded-full transition-colors ${activeTab === tab.id ? 'bg-brand' : 'bg-rule'}`}
              />
            ))}
          </div>

          {activeTab === 'heal' ? (
            <button
              onClick={() => navigate('architecture')}
              className="flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
            >
              View architecture
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => {
                const idx = tabs.findIndex(t => t.id === activeTab)
                if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id)
              }}
              className="flex items-center gap-2 text-sm font-medium text-dim hover:text-on-surface transition-colors"
            >
              Next step
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
