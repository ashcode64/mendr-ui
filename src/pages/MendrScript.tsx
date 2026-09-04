import type { NavigateFn } from '../App'
import HeroSpotlight from '../components/HeroSpotlight'

interface Props { navigate: NavigateFn }

const opcodes = [
  { op: 'rename', category: 'Structural', desc: 'Rename field at JSON pointer', stream: '✓ splice-capable' },
  { op: 'move', category: 'Structural', desc: 'Move value between pointers', stream: '✓ splice-capable' },
  { op: 'copy', category: 'Structural', desc: 'Copy value between pointers', stream: '✓ structural' },
  { op: 'remove', category: 'Structural', desc: 'Delete path from document', stream: '✓ structural' },
  { op: 'wrap', category: 'Structural', desc: 'Wrap value in new object key', stream: '✓ structural' },
  { op: 'unwrap', category: 'Structural', desc: 'Unwrap nested key', stream: '⚠ often DOM' },
  { op: 'wrap_array', category: 'Structural', desc: 'Ensure array wrapping', stream: '✓ structural' },
  { op: 'unwrap_array', category: 'Structural', desc: 'Unwrap array nesting', stream: '✓ structural' },
  { op: 'strip_unknown', category: 'Structural', desc: 'Remove undeclared fields', stream: '✓ structural' },
  { op: 'default', category: 'Value', desc: 'Inject if ABSENT / NULL / BOTH', stream: '⚠ may require DOM' },
  { op: 'coalesce', category: 'Value', desc: 'First non-null path wins', stream: '⚠ value-dependent' },
  { op: 'coerce', category: 'Value', desc: 'Type coercion, strict fail-closed', stream: '⚠ DOM' },
  { op: 'scale', category: 'Value', desc: 'Rational multiply with bounds', stream: '⚠ DOM' },
  { op: 'arith', category: 'Value', desc: 'Arithmetic on numeric fields', stream: '⚠ DOM' },
  { op: 'map_value', category: 'Value', desc: 'Value lookup table substitution', stream: '⚠ value-dependent' },
  { op: 'reformat_date', category: 'Value', desc: 'Date format conversion', stream: '⚠ value-dependent' },
  { op: 'string', category: 'Value', desc: 'concat/split/lower/upper/trim/format', stream: '⚠ DOM' },
  { op: 'conditional', category: 'Control', desc: 'Branch on structured predicate', stream: '✗ always DOM' },
]

const planClasses = [
  { cls: 'PASSTHROUGH', desc: 'No transform overhead — program is a no-op', strategy: 'Skip entirely' },
  { cls: 'PREFILTERABLE', desc: 'Literal pre-scan allows fast-exit miss', strategy: 'Skip transform on miss' },
  { cls: 'FORWARD_ONLY', desc: 'Forward-only structural changes', strategy: 'splice.lua HBM streaming' },
  { cls: 'BOUNDED_WINDOW', desc: 'Bounded streaming window (256KB cap)', strategy: 'splice.lua HBM streaming' },
  { cls: 'UNBOUNDED', desc: 'Requires full body or conditionals present', strategy: 'Buffer full body → DOM' },
]

export default function MendrScript({ navigate }: Props) {
  return (
    <div>
      {/* Header */}
      <HeroSpotlight className="border-b border-rule py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">Technology</div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[clamp(2rem,5vw,3.2rem)] leading-[1.15] tracking-tight text-on-surface mb-5">
            MendrScript — a verified transform DSL
          </h1>
          <p className="text-lg text-dim leading-relaxed max-w-2xl mx-auto">
            A closed-opcode domain-specific language that runs verified, minimized programs at the edge — never raw LLM output, never arbitrary code, never Lua-JIT sandbox risk.
          </p>
        </div>
      </HeroSpotlight>

      {/* Why a DSL */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface mb-4">
                Why a closed DSL instead of plugins or scripts?
              </h2>
              <p className="text-dim leading-relaxed mb-5">
                Fixed rule types required Java + Lua + DB enum + consumer branch for every new capability. MendrScript lifts transforms into composable programs while keeping the hot path safe.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { icon: '🔒', title: 'No LLM-generated Lua on the edge', desc: 'LuaJIT sandbox is unsafe per 2026 security advisories. MendrScript programs are precompiled JSON with known opcodes — no code generation at the gateway.' },
                  { icon: '✅', title: 'Tri-runtime parity', desc: 'Java executor, Lua edge interpreter, and Rust minimization oracle share semantics verified by parity fixtures. CI gates enforce cross-runtime equivalence.' },
                  { icon: '🧮', title: 'Minimization before deployment', desc: 'The Rust sidecar applies ddmin necessity, egg EqSat rewrite rules, and a prove_minimal subsequence search. Programs are as small as provably possible.' },
                  { icon: '🛡️', title: 'Re-verify on every path', desc: 'Chat-synthesized programs submitted from the UI are re-verified server-side by the Java verifier before staging. The conversation engine cannot bypass safety gates.' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-3.5">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-on-surface mb-0.5">{item.title}</div>
                      <div className="text-xs text-dim leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Three tiers */}
            <div className="space-y-4">
              <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">Three-Tier Design</div>
              {[
                {
                  tier: 'Tier 1',
                  label: 'Verified MendrScript',
                  status: 'Shipped',
                  statusColor: 'bg-success/20 text-success',
                  desc: 'Closed opcodes, Java + Lua execution, parity fixtures, CI-verified minimization.',
                },
                {
                  tier: 'Tier 2',
                  label: 'Governed opcode registry',
                  status: 'Partial / Planned',
                  statusColor: 'bg-warning/20 text-warning',
                  desc: 'Human-promoted new opcodes via formal review process. Extends the closed set without full codebase changes.',
                },
                {
                  tier: 'Tier 3',
                  label: 'Sandboxed Lua shadow lab',
                  status: 'Planned',
                  statusColor: 'bg-overlay text-dim',
                  desc: 'Off-hot-path lab learns candidate primitives. Only human-promoted opcodes enter the closed registry. LLM-generated Lua never reaches production.',
                },
              ].map(tier => (
                <div key={tier.tier} className="bg-surface border border-rule rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-sky text-sky-ink px-2 py-0.5 rounded font-semibold">{tier.tier}</span>
                      <span className="text-sm font-semibold text-on-surface">{tier.label}</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tier.statusColor}`}>{tier.status}</span>
                  </div>
                  <p className="text-xs text-dim leading-relaxed">{tier.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Example program */}
      <section className="bg-surface border-y border-rule py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Program Examples</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              MendrScript programs in practice
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: 'Field rename',
                category: 'SCHEMA_MISMATCH',
                code: `schemaVersion: mendrscript/v1
ops:
  - op: rename
    from: /tag_id
    to: /tag_sent`,
              },
              {
                title: 'Type coercion',
                category: 'SCHEMA_MISMATCH',
                code: `schemaVersion: mendrscript/v1
ops:
  - op: coerce
    path: /amount
    targetType: number
    strict: true`,
              },
              {
                title: 'Default injection',
                category: 'SCHEMA_MISMATCH',
                code: `schemaVersion: mendrscript/v1
ops:
  - op: default
    path: /region
    value: "US"
    policy: on: ABSENT`,
              },
              {
                title: 'Nested unwrap',
                category: 'RESPONSE_MISMATCH',
                code: `schemaVersion: mendrscript/v1
meta:
  side: response
ops:
  - op: unwrap
    path: /data/payload
    into: /`,
              },
              {
                title: 'Conditional field',
                category: 'SCHEMA_MISMATCH',
                code: `schemaVersion: mendrscript/v1
ops:
  - op: conditional
    if:
      op: exists
      path: /legacy_id
    then:
      - op: rename
        from: /legacy_id
        to: /id`,
              },
              {
                title: 'Value map',
                category: 'SCHEMA_MISMATCH',
                code: `schemaVersion: mendrscript/v1
ops:
  - op: map_value
    path: /status
    mapping:
      "active": "ACTIVE"
      "closed": "INACTIVE"`,
              },
            ].map(ex => (
              <div key={ex.title} className="bg-ink rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{ex.title}</span>
                  <span className="text-[10px] font-mono bg-sky/15 text-[#93C5FD] px-2 py-0.5 rounded">{ex.category}</span>
                </div>
                <pre className="p-4 text-xs font-mono text-muted overflow-auto leading-relaxed whitespace-pre">
                  {ex.code}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification pipeline */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Verification Pipeline</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              VeriGuard-style synthesis loop
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col gap-3">
              {[
                { step: 'Propose', detail: 'LLM generates MendrScript AST with closed opcodes from ErrorSignature context', color: 'var(--mendr-sky)', text: 'var(--mendr-sky-ink)' },
                { step: 'Verify', detail: 'verify_program MCP tool checks structural validity; counterexamples send the loop back to Propose', color: 'var(--mendr-cream)', text: 'var(--mendr-cream-ink)' },
                { step: 'Simulate', detail: 'simulate_transform runs program against sample request/response payloads; wrong diffs send the loop back', color: '#E8F5E9', text: '#1B5E20' },
                { step: 'Minimize', detail: 'Rust sidecar applies ddmin necessity, egg EqSat rewrites, prove_minimal; program is as small as provably possible', color: '#EDE9FE', text: '#4C1D95' },
                { step: 'Safety gate', detail: 'Conformal + Venn-Abers evaluation → PENDING_APPROVAL or (opt-in) APPROVED', color: '#FEE2E2', text: '#D92D20' },
                { step: 'Deploy', detail: 'Kafka → rule-engine → Postgres → snapshot → edge Redis → live transform at gateway', color: 'var(--mendr-brand)', text: '#FFFFFF' },
              ].map((item, i) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: item.color, color: item.text }}
                    >
                      {i + 1}
                    </div>
                    {i < 5 && <div className="w-px h-6 bg-rule mt-1"></div>}
                  </div>
                  <div className="pt-2">
                    <div className="text-sm font-semibold text-on-surface">{item.step}</div>
                    <div className="text-xs text-dim mt-0.5 leading-relaxed">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Opcode reference */}
      <section className="bg-surface border-y border-rule py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Opcode Reference</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              Complete initial opcode set
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule bg-canvas">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-dim uppercase tracking-wide">Opcode</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-dim uppercase tracking-wide">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-dim uppercase tracking-wide">Purpose</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-dim uppercase tracking-wide">Streamability</th>
                </tr>
              </thead>
              <tbody>
                {opcodes.map((row, i) => (
                  <tr key={row.op} className={`border-b border-overlay hover:bg-canvas transition-colors`}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-brand bg-[#F0F4FF]">{row.op}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        row.category === 'Structural' ? 'bg-sky text-sky-ink' :
                        row.category === 'Value' ? 'bg-cream text-cream-ink' :
                        'bg-[#EDE9FE] text-[#4C1D95]'
                      }`}>
                        {row.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface text-xs">{row.desc}</td>
                    <td className="px-4 py-3 text-xs font-mono text-dim">{row.stream}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Plan classes */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Edge Execution</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              Plan classes — how programs execute at the edge
            </h2>
            <p className="text-dim mt-3 text-sm max-w-2xl">
              Programs are classified at the edge into five execution tiers. Streaming splice is preferred for structural ops; DOM buffering handles complex transformations.
            </p>
          </div>
          <div className="space-y-3">
            {planClasses.map((pc, i) => (
              <div key={pc.cls} className="flex items-start gap-4 bg-surface border border-rule rounded-xl p-4">
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                  ${i === 0 ? 'bg-success/20 text-success' : i === 1 ? 'bg-sky text-sky-ink' : i === 2 ? 'bg-cream text-cream-ink' : i === 3 ? 'bg-warning/20 text-warning' : 'bg-error/15 text-error'}`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="font-mono text-xs font-bold text-on-surface">{pc.cls}</span>
                  </div>
                  <div className="text-xs text-on-surface mb-1">{pc.desc}</div>
                  <div className="text-xs text-dim font-medium">Strategy: {pc.strategy}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream border-y border-rule py-14 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl tracking-tight text-cream-ink mb-3">
            How does safety govern all of this?
          </h2>
          <p className="text-sm text-cream-ink/75 mb-6">
            MendrScript programs must pass the safety gate before any edge deployment. Human-in-the-loop is a structural guarantee — not a configuration option.
          </p>
          <button onClick={() => navigate('safety')} className="bg-brand text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-brand-dark transition-colors text-sm">
            Explore safety & trust
          </button>
        </div>
      </section>
    </div>
  )
}
