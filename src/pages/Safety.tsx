import type { NavigateFn } from '../App'
import HeroSpotlight from '../components/HeroSpotlight'

interface Props { navigate: NavigateFn }

export default function Safety({ navigate }: Props) {
  return (
    <div>
      {/* Header */}
      <HeroSpotlight className="border-b border-rule py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">Technology</div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[clamp(2rem,5vw,3.2rem)] leading-[1.15] tracking-tight text-on-surface mb-5">
            Safety, trust, and compliance
          </h1>
          <p className="text-lg text-dim leading-relaxed max-w-2xl mx-auto">
            Security teams rightfully fear AI that "fixes production." Mendr{"'"}s trust model addresses OWASP LLM Top 10 explicitly — with structural guarantees, not configuration promises.
          </p>
        </div>
      </HeroSpotlight>

      {/* HITL by construction */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface mb-4">
                Human-in-the-loop by construction
              </h2>
              <p className="text-dim leading-relaxed mb-6">
                The conversation engine has no deploy node. Full stop. Chat output flows through server-side Java verification, the safety gate, operator approval, and Kafka before any rule reaches the edge.
              </p>
              <div className="bg-ink border border-rule rounded-xl overflow-hidden mb-6">
                <div className="px-5 py-3 border-b border-white/10 text-xs text-dim font-mono">Trust chain — deploy path</div>
                <div className="p-5 space-y-2 font-mono text-xs">
                  {[
                    { step: '1', label: 'Operator types in chat', note: 'Frontend SSE to conversation-engine' },
                    { step: '2', label: 'LangGraph synthesizes MendrScript', note: 'No deploy node in graph.py' },
                    { step: '3', label: 'POST /api/analysis/{id}/program', note: 'Operator submits proposal' },
                    { step: '4', label: 'Java MendrScriptVerifier re-verifies', note: 'Server-side authority — not skippable' },
                    { step: '5', label: 'SafetyGateService decision', note: 'Conformal + Venn-Abers evaluation' },
                    { step: '6', label: 'Operator approve/reject in dashboard', note: 'HITL gate — no auto-bypass' },
                    { step: '7', label: 'Kafka → rule-engine → snapshot → edge', note: 'Deploy path begins only here' },
                  ].map((row) => (
                    <div key={row.step} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-muted flex-shrink-0 font-bold">
                        {row.step}
                      </span>
                      <span className="text-cream">{row.label}</span>
                      <span className="ml-auto text-dim text-[10px] hidden md:block">{row.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* OWASP LLM Top 10 */}
            <div>
              <h3 className="font-[family-name:var(--font-display)] font-bold text-xl tracking-tight text-on-surface mb-4">
                OWASP LLM Top 10 responses
              </h3>
              <div className="space-y-3">
                {[
                  { risk: 'Prompt injection', mitigation: 'Immutable system prompts, action screening, closed opcode vocabulary — LLM cannot inject deploy commands' },
                  { risk: 'Excessive agency', mitigation: 'Conversation engine has no deploy node. LangGraph graph.py verified to lack deploy capability.' },
                  { risk: 'Complete mediation', mitigation: 'Authorization in RLS and Java verifier, never delegated to LLM output.' },
                  { risk: 'Sensitive info disclosure', mitigation: 'PII scrubbed at edge before failure reports leave customer network. Protected path blacklist blocks auth headers.' },
                  { risk: 'Insecure output handling', mitigation: 'MendrScript AST constrains all output to closed opcodes. No arbitrary code execution surface.' },
                ].map(item => (
                  <div key={item.risk} className="bg-surface border border-rule rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-[#16A34A]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-on-surface mb-0.5">{item.risk}</div>
                        <div className="text-xs text-dim leading-relaxed">{item.mitigation}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-tenancy */}
      <section className="bg-surface border-y border-rule py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Multi-Tenancy</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              Defense-in-depth tenant isolation
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🗄️', layer: 'Database', desc: 'FORCE Row Level Security on Postgres — unset tenant context matches zero rows. App connects as app_user, not superuser.' },
              { icon: '⚡', layer: 'Redis', desc: "All Redis keys prefixed t:{tenantId}: — tenant data is namespace-isolated without shared-memory bleed." },
              { icon: '📨', layer: 'Kafka', desc: 'Messages carry tenant_id header. Per-tenant sync version counters and snapshot scopes.' },
              { icon: '🔑', layer: 'API keys', desc: 'Per-tenant edge API keys with sha256 hashing at rest. WorkOS JWT for human operators. Internal API key rotated separately.' },
            ].map(layer => (
              <div key={layer.layer} className="border border-rule rounded-xl p-5">
                <div className="text-2xl mb-3">{layer.icon}</div>
                <div className="text-sm font-bold text-on-surface mb-2">{layer.layer}</div>
                <div className="text-xs text-dim leading-relaxed">{layer.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Edge fail-closed */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface mb-4">
                Edge fail-closed semantics
              </h2>
              <p className="text-dim leading-relaxed mb-6">
                The edge enforces safety independently of the control plane. Even an approved program cannot bypass edge-local protections.
              </p>
              <div className="space-y-3">
                {[
                  { title: 'Protected path blacklist', desc: 'transform.lua refuses programs touching authorization, x-api-key, credit_card_number, internal_routing_id, plus any route-level protectedPaths — regardless of what the CP approved.' },
                  { title: 'Coerce strict fail-closed', desc: 'coerce_strict() errors on non-coercible values rather than silently passing. A string "abc" cannot be coerced to a number.' },
                  { title: 'Splice after-flush abort', desc: 'If a streaming transform encounters a fault after bytes have been flushed to the client, the edge issues a protocol-aware abort and files a SPLICE failure report — even if upstream returned 200.' },
                  { title: 'JWT verification fail-closed', desc: 'When JWKS-based auth is configured on a route, verification failures are hard-blocked. No fallthrough, no degraded mode.' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-error/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-error" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
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

            {/* Compliance artifacts */}
            <div>
              <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface mb-4">
                Compliance artifacts
              </h2>
              <p className="text-dim leading-relaxed mb-6">
                Every virtual patch is a governed change — not shadow IT. The platform produces audit-ready artifacts for SOC 2, GDPR, and internal change management programs.
              </p>
              <div className="space-y-3">
                {[
                  { artifact: 'Append-only audit log', where: 'rule-engine /api/rules/audit', desc: 'Who approved what patch, when, for which route, with what verification proof.' },
                  { artifact: 'transform_programs record', where: 'Postgres table', desc: 'Stores AST, verification proof, and simulation diffs for every deployed program.' },
                  { artifact: 'Auto-expiring TTL', where: 'Per-rule configuration', desc: 'Virtual patches auto-expire. They cannot silently become permanent undocumented adapters.' },
                  { artifact: 'Conformal calibration', where: 'init_v16_confidence_calibration.sql', desc: 'Calibration data pipeline for confidence intervals, integrated into deploy decisions.' },
                  { artifact: 'PII scrub log', where: 'pii_redact.lua', desc: 'Redacted fields logged for audit purposes; raw PII never persisted in control plane.' },
                ].map(item => (
                  <div key={item.artifact} className="bg-canvas border border-rule rounded-lg p-4">
                    <div className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="text-xs font-bold text-on-surface">{item.artifact}</div>
                        <div className="text-[10px] font-mono text-dim mt-0.5">{item.where}</div>
                        <div className="text-xs text-dim mt-1 leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security posture summary */}
      <section className="bg-ink py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Security CI</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-white">
              Security pipeline in CI
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Gitleaks', desc: 'Secret scanning on every commit' },
              { name: 'Trivy', desc: 'Container and dependency CVE scan' },
              { name: 'CodeQL', desc: 'Static analysis for Java and TS' },
              { name: 'npm/pip audit', desc: 'Dependency vulnerability check' },
            ].map(tool => (
              <div key={tool.name} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-white mb-0.5">{tool.name}</div>
                <div className="text-xs text-muted">{tool.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
