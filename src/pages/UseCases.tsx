import { useState } from 'react'
import type { NavigateFn } from '../App'
import HeroSpotlight from '../components/HeroSpotlight'

interface Props { navigate: NavigateFn }

const useCases = [
  {
    id: 'field-rename',
    title: 'Field rename drift',
    category: 'SCHEMA_MISMATCH',
    impact: 'Every checkout fails',
    scenario: 'The inventory team deploys a schema change renaming outbound field tag_id to tag_sent. Shipping validation still requires the old name. Every inventory→shipping POST /ship returns HTTP 400.',
    detection: 'Edge logs 400; classify_failure → SCHEMA_MISMATCH. Deduped failure report includes request/response payloads (PII-redacted) and route template.',
    diagnosis: 'AI compares payload against OpenAPI contracts for both services. ErrorSignature localizes jsonPath /tag_id. MendrScript proposal: rename from /tag_id to /tag_sent.',
    heal: 'Snapshot sync version increments. Edge applies request transform via streaming splice.',
    timeToHeal: 'Minutes after approval',
    permanentFix: 'Shipping service updates validation schema; Mendr rule expires via TTL.',
    mendrscript: `ops:
  - op: rename
    from: /tag_id
    to: /tag_sent`,
  },
  {
    id: 'type-coerce',
    title: 'Type coercion failure',
    category: 'SCHEMA_MISMATCH',
    impact: 'Payment submissions fail',
    scenario: 'Payment service sends amount as string "19.99"; billing expects a JSON number. Validation fails on every charge attempt.',
    detection: '400 with schema validation error body. Deduped and PII-scrubbed before reporting.',
    diagnosis: 'Category SCHEMA_MISMATCH, type mismatch detected. MendrScript coerce op on /amount to number with strict mode enabled.',
    heal: 'Edge coerce_strict in transform.lua converts string to number. Fails closed on non-numeric strings — cannot silently corrupt data.',
    timeToHeal: 'Minutes after approval',
    permanentFix: 'Payment team fixes serializer; coerce rule expires.',
    mendrscript: `ops:
  - op: coerce
    path: /amount
    targetType: number
    strict: true`,
  },
  {
    id: 'missing-field',
    title: 'Missing required field',
    category: 'SCHEMA_MISMATCH',
    impact: 'Legacy client requests rejected',
    scenario: 'A legacy client omits field region that downstream now requires. Validation returns 400 on every call from that client.',
    detection: '400 with field-required error in response body. Classified as SCHEMA_MISMATCH.',
    diagnosis: 'default op with policy on: ABSENT injects the missing field. Conformal gate enforces caution when confidence interval is wide — operator must approve.',
    heal: 'Edge injects default value (e.g., "US") on absent path before upstream call.',
    timeToHeal: 'Minutes — operator must review default value choice',
    permanentFix: 'Legacy client updated to send region; default rule expires.',
    mendrscript: `ops:
  - op: default
    path: /region
    value: "US"
    policy:
      on: ABSENT`,
  },
  {
    id: 'routing',
    title: 'Wrong upstream routing',
    category: 'ROUTING',
    impact: 'Service traffic black-holed',
    scenario: 'Service discovery entry points to a decommissioned host. Every call returns 502/503 with connection refused.',
    detection: 'Category ROUTING. Topology RCA enumerates candidate paths from Postgres SCD2 graph.',
    diagnosis: 'Proposes ROUTING_OVERRIDE to healthy instance pool. No contract transform needed — this is a topology fix.',
    heal: 'Snapshot updates targetBaseUrl or routing rule. peer_resolver uses updated pool with healthcheck filtering and circuit breaker.',
    timeToHeal: 'Minutes after approval',
    permanentFix: 'Platform team fixes service registry / DNS.',
    mendrscript: `# Routing override (not MendrScript transform)
# targetBaseUrl updated in snapshot
routingOverride:
  target: https://inventory-v2.svc:8080`,
  },
  {
    id: 'cors',
    title: 'CORS policy block',
    category: 'CORS',
    impact: 'Frontend features silently fail',
    scenario: 'Browser-facing BFF blocked by a new CORS policy on upstream API after a security team policy change. Preflight returns 403.',
    detection: 'Category CORS with preflight failure metadata. Origin header captured in failure report.',
    diagnosis: 'Proposes CORS_ALLOW or CORS_ORIGIN_OVERRIDE rule synced into snapshot — no per-request control-plane call needed.',
    heal: 'Edge applies CORS headers in header_filter per synced policy. Preflight requests now succeed.',
    timeToHeal: 'Minutes after approval',
    permanentFix: 'Upstream adds proper Access-Control-Allow-Origin; Mendr CORS rule expires.',
    mendrscript: `# CORS override (snapshot policy)
corsPolicy:
  allowedOrigins:
    - "https://app.example.com"
  allowedMethods: ["GET", "POST"]`,
  },
  {
    id: 'response-mismatch',
    title: 'Response contract drift',
    category: 'RESPONSE_MISMATCH',
    impact: 'Mobile app parsers crash',
    scenario: 'Downstream returns extra nesting around the data field, breaking mobile client JSON parsers. Upstream returns 200 but the shape no longer matches the contract.',
    detection: 'Async POST /api/internal/validate-response from log phase flags shape mismatch when route has a response contract.',
    diagnosis: 'Response-side MendrScript unwrap program. Often DOM-classified due to response transform complexity.',
    heal: 'Response transform in body_filter reshapes payload before client receives it. The 200 response reaches the client with the expected shape.',
    timeToHeal: 'Minutes after approval',
    permanentFix: 'API version negotiation + client update; response transform expires.',
    mendrscript: `meta:
  side: response
ops:
  - op: unwrap
    path: /data/payload
    into: /`,
  },
]

export default function UseCases({ navigate }: Props) {
  const [activeCase, setActiveCase] = useState(useCases[0])

  return (
    <div>
      {/* Header */}
      <HeroSpotlight className="border-b border-rule py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">Why Mendr</div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[clamp(2rem,5vw,3.2rem)] leading-[1.15] tracking-tight text-on-surface mb-5">
            Concrete use cases — not hypotheticals
          </h1>
          <p className="text-lg text-dim leading-relaxed max-w-2xl mx-auto">
            Each use case follows a consistent pattern: scenario → detection → diagnosis → heal → time-to-heal → permanent fix path.
          </p>
        </div>
      </HeroSpotlight>

      {/* Use case explorer */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Case list */}
            <div className="space-y-2">
              {useCases.map(uc => (
                <button
                  key={uc.id}
                  onClick={() => setActiveCase(uc)}
                  className={`w-full text-left rounded-xl p-4 transition-all border
                    ${activeCase.id === uc.id
                      ? 'bg-sky border-brand/30 shadow-sm'
                      : 'bg-surface border-rule hover:border-sky'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded flex-shrink-0
                      ${activeCase.id === uc.id ? 'bg-brand text-white' : 'bg-overlay text-dim'}`}>
                      {uc.category}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className={`text-sm font-semibold ${activeCase.id === uc.id ? 'text-brand' : 'text-on-surface'}`}>
                      {uc.title}
                    </div>
                    <div className="text-xs text-dim mt-0.5">{uc.impact}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Case detail */}
            <div className="lg:col-span-2">
              <div key={activeCase.id} className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
                    {activeCase.title}
                  </h2>
                  <span className="text-xs font-mono font-bold bg-sky text-sky-ink px-2.5 py-1 rounded-md">
                    {activeCase.category}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  {[
                    { label: 'Scenario', content: activeCase.scenario, color: '#FEE2E2', textColor: '#7F1D1D' },
                    { label: 'Detection', content: activeCase.detection, color: 'var(--mendr-sky)', textColor: 'var(--mendr-sky-ink)' },
                    { label: 'Diagnosis', content: activeCase.diagnosis, color: 'var(--mendr-cream)', textColor: 'var(--mendr-cream-ink)' },
                    { label: 'Heal', content: activeCase.heal, color: '#D1FAE5', textColor: '#065F46' },
                  ].map(section => (
                    <div key={section.label} className="rounded-xl overflow-hidden">
                      <div
                        className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{ backgroundColor: section.color, color: section.textColor }}
                      >
                        {section.label}
                      </div>
                      <div className="bg-surface border border-rule px-4 py-3 border-t-0 rounded-b-xl">
                        <p className="text-sm text-on-surface leading-relaxed">{section.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-canvas border border-rule rounded-xl p-4">
                    <div className="text-xs font-bold text-dim uppercase tracking-wide mb-1">Time to heal</div>
                    <div className="text-sm font-semibold text-brand">{activeCase.timeToHeal}</div>
                  </div>
                  <div className="bg-canvas border border-rule rounded-xl p-4">
                    <div className="text-xs font-bold text-dim uppercase tracking-wide mb-1">Permanent fix</div>
                    <div className="text-sm text-on-surface">{activeCase.permanentFix}</div>
                  </div>
                </div>

                <div className="bg-ink border border-rule rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs text-dim font-mono">MendrScript proposal</span>
                    <span className="text-[10px] bg-success/15 text-success px-2 py-0.5 rounded font-semibold">Verified ✓</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-muted overflow-auto leading-relaxed">
                    {activeCase.mendrscript}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI gateway use case */}
      <section className="bg-surface border-y border-rule py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-[#EDE9FE] text-[#4C1D95] text-xs font-bold px-3 py-1 rounded-full mb-4">Bonus use case</div>
              <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface mb-4">
                AI gateway governance
              </h2>
              <p className="text-dim leading-relaxed mb-5">
                Customers exposing LLM facades through Mendr AI gateway routes benefit from prompt injection detection, token burn protection, and semantic caching — all in the same edge layer that handles API healing.
              </p>
              <ul className="space-y-2.5">
                {[
                  'TPM/RPM limits per AI route — prevent token burn attacks',
                  'Prompt firewall — jailbreak pattern matching at the edge',
                  'Semantic cache for repeated queries — reduce inference cost',
                  'PII redaction policies on AI routes before model sees input',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg className="w-3.5 h-3.5 text-[#7C3AED] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-on-surface">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-canvas border border-rule rounded-2xl p-6">
              <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">AI gateway config (snapshot)</div>
              <div className="bg-ink border border-rule rounded-xl p-4 font-mono text-xs">
                <div className="text-cream">ai_route: /api/chat</div>
                <div className="text-muted mt-2">tpm_limit: 100000</div>
                <div className="text-muted">rpm_limit: 60</div>
                <div className="text-muted">prompt_firewall: enabled</div>
                <div className="text-muted">semantic_cache:</div>
                <div className="text-muted ml-4">enabled: true</div>
                <div className="text-muted ml-4">similarity_threshold: 0.95</div>
                <div className="text-muted">pii_redact:</div>
                <div className="text-muted ml-4">before_model: true</div>
              </div>
              <div className="text-xs text-dim mt-3">
                Mendr combines self-healing with AI gateway governance in one edge — not a separate product bolt-on.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl tracking-tight text-on-surface mb-3">
            See how Mendr fits your team
          </h2>
          <p className="text-sm text-dim mb-6">
            Benefits differ by role — CTO, Platform/SRE, Security, Product, and FinOps each have specific outcomes from the platform.
          </p>
          <button onClick={() => navigate('stakeholders')} className="bg-brand text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-brand-dark transition-colors text-sm">
            Benefits by role
          </button>
        </div>
      </section>
    </div>
  )
}
