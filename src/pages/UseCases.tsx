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
    detection: 'The edge logs the 400 and classifies it as a schema mismatch. A deduped failure report includes the request and response (PII redacted) plus the route template.',
    diagnosis: 'Mendr compares the payload to both services\' OpenAPI contracts, finds the mismatch at /tag_id, and proposes a rename to /tag_sent.',
    heal: 'After approval, the edge rewrites the request in flight so shipping gets the field name it expects.',
    timeToHeal: 'Minutes after approval',
    permanentFix: 'Shipping updates its validation schema. The temporary Mendr rule expires on its TTL.',
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
    detection: 'A 400 with a schema validation error is deduped and scrubbed of PII before reporting.',
    diagnosis: 'Mendr flags a type mismatch and proposes a strict coerce of /amount to a number.',
    heal: 'The edge converts valid numeric strings to numbers. Non-numeric values fail closed so  non-numeric strings data is never silently changed.',
    timeToHeal: 'Minutes after approval',
    permanentFix: 'Payment fixes its serializer. The coerce rule expires.',
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
    scenario: 'A legacy client omits "region" field, which the downstream service now requires. Every call from that client returns 400.',
    detection: 'A field-required error in the response is classified as a schema mismatch.',
    diagnosis: 'Mendr proposes a default value when the field is absent. When confidence is low, the operator must approve the choice.',
    heal: 'The edge injects the approved default (for example, "US") before the request reaches upstream.',
    timeToHeal: 'Minutes (operator reviews the default value)',
    permanentFix: 'The legacy client starts sending region. The default rule expires.',
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
    detection: 'Classified as a routing failure. Topology analysis finds healthy paths from the service graph.',
    diagnosis: 'Mendr proposes routing traffic to a healthy instance pool. No payload transform is needed; this is a topology fix.',
    heal: 'After approval, the edge updates the target base url and uses health checks plus a circuit breaker on the new pool.',
    timeToHeal: 'Minutes after approval',
    permanentFix: 'Platform fixes the service registry or DNS.',
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
    scenario: 'Security tightens CORS on an upstream API. The browser-facing BFF fails preflight with 403, so frontend features stop working.',
    detection: 'Classified as CORS with preflight failure details. The Origin header is captured in the failure report.',
    diagnosis: 'Mendr proposes a CORS allow or origin override, synced into the edge snapshot (no per-request control-plane call).',
    heal: 'The edge applies the approved CORS headers. Preflight requests succeed again.',
    timeToHeal: 'Minutes after approval',
    permanentFix: 'Upstream sets Access-Control-Allow-Origin correctly. The Mendr CORS rule expires.',
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
    detection: 'Async response validation flags a shape mismatch when the route has a response contract.',
    diagnosis: 'Mendr proposes a response-side copy from /customer/details/id to /customer_id so older clients see the field they expect. Higher-risk transforms often need human review.',
    heal: 'After approval, the edge adds customer_id back onto the response before it reaches the client.',
    timeToHeal: 'Minutes after approval',
    permanentFix: 'API version negotiation and a client update. The response transform expires.',
    mendrscript: `meta:
  side: response
ops:
  - op: copy
    from: /customer/details/id
    to: /customer_id`,
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
            Concrete use cases for production traffic
          </h1>
          <p className="text-lg text-dim leading-relaxed max-w-2xl mx-auto">
            Each case follows the same path: what broke, how Mendr found it, what it proposed, how traffic healed, and how the permanent fix replaces the temporary patch.
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
                If you expose LLM routes through Mendr, the same edge layer can enforce prompt injection checks, token burn limits, and semantic caching alongside API healing.
              </p>
              <ul className="space-y-2.5">
                {[
                  'TPM/RPM limits per AI route to stop token burn attacks',
                  'Prompt firewall: jailbreak pattern matching at the edge',
                  'Semantic cache for repeated queries to cut inference cost',
                  'PII redaction on AI routes before the model sees input',
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
                Self-healing and AI gateway controls in one edge layer.
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
            Benefits differ by role. CTO, Platform/SRE, Security, Product, and FinOps each have specific benefits from Mendr.
          </p>
          <button onClick={() => navigate('stakeholders')} className="bg-brand text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-brand-dark transition-colors text-sm">
            Benefits by role
          </button>
        </div>
      </section>
    </div>
  )
}
