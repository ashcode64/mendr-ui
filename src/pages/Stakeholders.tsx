import { useState } from 'react'
import type { NavigateFn } from '../App'
import HeroSpotlight from '../components/HeroSpotlight'

interface Props { navigate: NavigateFn }

const roles = [
  {
    id: 'cto',
    title: 'CTO / VP Engineering',
    icon: '🏗️',
    pain: 'P1 integration incidents erode release confidence',
    headline: 'Stop emergency redeploys for temporary contract mismatches',
    outcomes: [
      'Temporary patches restore traffic in minutes while teams ship the permanent fix on their timeline',
      'Immutable audit trail satisfies compliance: who approved what patch, when, for which route',
      'Auto-expiring patches ensure virtual fixes never become permanent undocumented adapters',
      'Mean time to recovery for integration-class incidents drops from hours to minutes',
    ],
    stat: { value: 'Hours → minutess', label: 'MTTR for integration class' },
  },
  {
    id: 'sre',
    title: 'Platform Engineering / SRE',
    icon: '⚙️',
    pain: 'Gateway outages during control-plane incidents',
    headline: 'Keep serving from last-known-good during outages',
    outcomes: [
      'Edge serves from last-known-good snapshots if the control plane is unreachable',
      'Periodic full resync every 5 minutes catches missed updates',
      'Failed config rebuilds do not advance the local version; traffic keeps the last good state',
      'Circuit breaker, health checks, and upstream retries on 502/503/504',
      'Failure dedup at the edge prevents telemetry storms during long outages',
    ],
    stat: { value: 'LKG serving', label: 'During control-plane outage' },
  },
  {
    id: 'security',
    title: 'Security / GRC',
    icon: '🔐',
    pain: 'AI auto-remediation risk and audit gaps',
    headline: 'Human approval by default, fail-closed edge, audit-ready artifacts',
    outcomes: [
      'Human approval is the default; auto-apply needs explicit opt-in after calibration',
      'When confidence is low, Mendr abstains and asks an operator',
      'Database row-level security: no tenant context means no rows returned',
      'PII scrubbed at the edge before failure reports leave your network',
      'Chat cannot deploy; prompt injection cannot bypass our code verifier',
      'Append-only audit log for every virtual patch approval and deployment',
    ],
    stat: { value: '0', label: 'LLM-generated code on hot path' },
  },
  {
    id: 'product',
    title: 'Product / Customer Success',
    icon: '📈',
    pain: 'Customer-visible broken flows and support ticket spikes',
    headline: 'Restore traffic before customers see failure',
    outcomes: [
      'Approved heals restore traffic without a customer-facing deploy, usually within minutes',
      'Simulate page with pre-built failure scenarios for demos and training',
      'Users see success rates recover instead of "the app is broken"',
      'Fewer support spikes during integration incidents that used to mean hours of downtime',
    ],
    stat: { value: '< 2 min', label: 'Typical time-to-heal after approval' },
  },
  {
    id: 'api',
    title: 'API / Integration Teams',
    icon: '🔗',
    pain: 'OpenAPI drift across teams and slow onboarding',
    headline: 'GitOps-friendly service registry with dry-run and portal',
    outcomes: [
      'Import OpenAPI specs via file, JSON, or URL',
      'Dry-run preview shows what would change before you write',
      'Manifest import supports mendr.yaml GitOps workflows',
      'Developer portal for catalog, specs, API keys, usage, and AI route config',
      'Service topology builds from manifests, OpenAPI, traffic, and code analysis',
    ],
    stat: { value: 'GitOps', label: 'Declarative service registration' },
  },
  {
    id: 'finops',
    title: 'FinOps',
    icon: '💰',
    pain: 'LLM cost storms during integration incidents',
    headline: 'Inference treated as a gated, metered resource',
    outcomes: [
      'Duplicate analyses coalesce so you get one LLM call per failure window',
      'Semaphore caps concurrent LLM calls (default: 2)',
      'Global and per-tenant budgets; over-budget work is deferred, not storm-retried',
      'Deferred work with Kafka ack prevents runaway cost during incident storms',
      'Usage metering per tenant per day for FinOps reporting',
    ],
    stat: { value: 'Zero', label: 'LLM retry storms on budget exceed' },
  },
]

export default function Stakeholders({ navigate }: Props) {
  const [activeRole, setActiveRole] = useState(roles[0])

  return (
    <div>
      {/* Header */}
      <HeroSpotlight className="border-b border-rule py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">Why Mendr</div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[clamp(2rem,5vw,3.2rem)] leading-[1.15] tracking-tight text-on-surface mb-5">
            Value by stakeholder
          </h1>
          <p className="text-lg text-dim leading-relaxed max-w-2xl mx-auto">
            Mendr delivers differentiated outcomes across the executive and engineering hierarchy. Every outcome maps to code-backed implementation, not aspirational marketing claims.
          </p>
        </div>
      </HeroSpotlight>

      {/* Summary table */}
      <section className="bg-surface border-y border-rule py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Summary</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              Benefits matrix
            </h2>
          </div>
          <div className="overflow-x-auto border border-rule-strong rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule-strong bg-overlay">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface uppercase tracking-wide">Stakeholder</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface uppercase tracking-wide">Pain</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface uppercase tracking-wide">Key outcome</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface uppercase tracking-wide">Code evidence</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-b border-rule-strong last:border-0 hover:bg-overlay/60 transition-colors cursor-pointer" onClick={() => setActiveRole(role)}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span>{role.icon}</span>
                        <span className="font-medium text-on-surface text-sm">{role.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-on-surface">{role.pain}</td>
                    <td className="px-4 py-3.5 text-xs text-on-surface">{role.headline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Role explorer */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Role selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all
                  ${activeRole.id === role.id
                    ? 'bg-sky border-brand/30'
                    : 'bg-surface border-rule hover:border-sky'}`}
              >
                <span className="text-2xl">{role.icon}</span>
                <span className={`text-xs font-semibold leading-tight ${activeRole.id === role.id ? 'text-brand' : 'text-on-surface'}`}>
                  {role.title.split(' / ')[0]}
                </span>
              </button>
            ))}
          </div>

          {/* Role detail */}
          <div key={activeRole.id} className="animate-fade-in">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left panel */}
              <div>
                <div className="text-4xl mb-4">{activeRole.icon}</div>
                <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface mb-2">
                  {activeRole.title}
                </h2>
                <div className="bg-error/15 rounded-lg px-4 py-3 mb-4">
                  <div className="text-[10px] font-bold text-error uppercase tracking-wide mb-0.5">Primary pain</div>
                  <div className="text-sm text-error">{activeRole.pain}</div>
                </div>
                <div className="bg-sky rounded-lg px-4 py-3 mb-5">
                  <div className="text-[10px] font-bold text-brand uppercase tracking-wide mb-0.5">Mendr outcome</div>
                  <div className="text-sm text-sky-ink font-medium">{activeRole.headline}</div>
                </div>
                <div className="bg-ink border border-rule rounded-xl p-5 text-center">
                  <div className="font-[family-name:var(--font-display)] font-bold text-2xl text-white mb-1">{activeRole.stat.value}</div>
                  <div className="text-xs text-muted">{activeRole.stat.label}</div>
                </div>
              </div>

              {/* Outcomes */}
              <div className="lg:col-span-2">
                <h3 className="text-sm font-bold text-dim uppercase tracking-wide mb-4">Concrete outcomes</h3>
                <div className="space-y-3 mb-6">
                  {activeRole.outcomes.map(outcome => (
                    <div key={outcome} className="flex items-start gap-3 bg-surface border border-rule rounded-lg p-4">
                      <svg className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-on-surface leading-relaxed">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl tracking-tight text-on-surface mb-3">
            Deploy where your data lives
          </h2>
          <p className="text-sm text-dim mb-6">
            SaaS hybrid, full on-prem, or air-gapped. Mendr meets your infrastructure requirements.
          </p>
          <button onClick={() => navigate('deployment')} className="bg-brand text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-brand-dark transition-colors text-sm">
            View deployment models
          </button>
        </div>
      </section>
    </div>
  )
}
