import { useState } from 'react'
import type { NavigateFn } from '../App'
import HeroSpotlight from '../components/HeroSpotlight'

interface Props { navigate: NavigateFn }

export default function ROI({ navigate }: Props) {
  const [incidents, setIncidents] = useState(24)
  const [hoursPerIncident, setHoursPerIncident] = useState(4)
  const [engineerCost, setEngineerCost] = useState(200)
  const [revenueAtRisk, setRevenueAtRisk] = useState(10000)
  const [healPercent, setHealPercent] = useState(65)

  const totalWithout = incidents * hoursPerIncident * (engineerCost + revenueAtRisk)
  const healedIncidents = Math.round(incidents * (healPercent / 100))
  const unhealedIncidents = incidents - healedIncidents
  const mendrMTTR = 0.1
  const totalWith = (unhealedIncidents * hoursPerIncident * (engineerCost + revenueAtRisk)) +
    (healedIncidents * mendrMTTR * (engineerCost + revenueAtRisk))
  const savings = totalWithout - totalWith
  const savingsFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(savings)
  const withoutFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalWithout)
  const withFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalWith)

  return (
    <div>
      {/* Header */}
      <HeroSpotlight className="border-b border-rule py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">Platform</div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[clamp(2rem,5vw,3.2rem)] leading-[1.15] tracking-tight text-on-surface mb-5">
            Business impact & ROI
          </h1>
          <p className="text-lg text-dim leading-relaxed max-w-2xl mx-auto">
            Populate the worksheet with your organization{"'"}s numbers. Mendr targets the subset of incident costs attributable to repairable contract and routing failures at the API boundary.
          </p>
        </div>
      </HeroSpotlight>

      {/* ROI calculator */}
      <section className="py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Inputs */}
            <div>
              <h2 className="font-[family-name:var(--font-display)] font-bold text-xl tracking-tight text-on-surface mb-6">
                Your organization{"'"}s numbers
              </h2>
              <div className="space-y-5">
                {[
                  { label: 'Integration-class P1/P2 incidents per year', var: 'I', value: incidents, setter: setIncidents, min: 1, max: 200, step: 1, format: (v: number) => `${v} incidents/yr` },
                  { label: 'Average hours to restore via deploy/rollback', var: 'H', value: hoursPerIncident, setter: setHoursPerIncident, min: 1, max: 24, step: 0.5, format: (v: number) => `${v} hours` },
                  { label: 'Fully loaded engineer cost per hour ($)', var: 'E', value: engineerCost, setter: setEngineerCost, min: 50, max: 1000, step: 25, format: (v: number) => `$${v}/hr` },
                  { label: 'Revenue at risk per hour during incident ($)', var: 'R', value: revenueAtRisk, setter: setRevenueAtRisk, min: 0, max: 100000, step: 1000, format: (v: number) => `$${v.toLocaleString()}/hr` },
                  { label: 'Percent of incidents Mendr can heal (0–100)', var: 'P', value: healPercent, setter: setHealPercent, min: 0, max: 100, step: 5, format: (v: number) => `${v}%` },
                ].map(input => (
                  <div key={input.var}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-on-surface">
                        <span className="font-mono text-brand font-bold mr-2">{input.var}</span>
                        {input.label}
                      </label>
                      <span className="text-sm font-semibold text-on-surface min-w-[80px] text-right">{input.format(input.value)}</span>
                    </div>
                    <input
                      type="range"
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      value={input.value}
                      onChange={e => input.setter(Number(e.target.value))}
                      className="w-full h-1.5 bg-rule rounded-full appearance-none cursor-pointer accent-brand"
                    />
                    <div className="flex justify-between text-[10px] text-muted mt-1">
                      <span>{input.format(input.min)}</span>
                      <span>{input.format(input.max)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col gap-5">
              <h2 className="font-[family-name:var(--font-display)] font-bold text-xl tracking-tight text-on-surface">
                Annual cost comparison
              </h2>

              <div className="bg-error/10 border border-error/40 rounded-xl p-6">
                <div className="text-xs font-bold text-error uppercase tracking-wide mb-2">Without Mendr</div>
                <div className="font-[family-name:var(--font-display)] font-bold text-3xl text-error">{withoutFormatted}</div>
                <div className="text-xs text-error mt-1">
                  {incidents} incidents × {hoursPerIncident}h × (${engineerCost} eng + ${revenueAtRisk.toLocaleString()} rev)/hr
                </div>
              </div>

              <div className="bg-success/10 border border-success/40 rounded-xl p-6">
                <div className="text-xs font-bold text-[#16A34A] uppercase tracking-wide mb-2">With Mendr</div>
                <div className="font-[family-name:var(--font-display)] font-bold text-3xl text-[#16A34A]">{withFormatted}</div>
                <div className="text-xs text-success mt-1">
                  {unhealedIncidents} unhealed × full cost + {healedIncidents} healed × ~6min repair cost
                </div>
              </div>

              <div className="bg-sky border border-brand/20 rounded-xl p-6 flex-1">
                <div className="text-xs font-bold text-brand uppercase tracking-wide mb-1">Annual savings potential</div>
                <div className="font-[family-name:var(--font-display)] font-bold text-4xl text-brand mb-2">{savingsFormatted}</div>
                <div className="text-xs text-sky-ink">
                  {healedIncidents} of {incidents} incidents healed ({healPercent}%) — Mendr MTTR ~6 minutes vs {hoursPerIncident}h status quo
                </div>
              </div>

              <div className="bg-cream border border-rule rounded-xl p-4">
                <div className="text-xs font-bold text-cream-ink mb-1">Note on conservative assumptions</div>
                <div className="text-xs text-cream-ink opacity-80">
                  This model excludes war-room fatigue, partner onboarding acceleration, compliance confidence value, and LLM cost savings — all material but harder to quantify.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Non-quantified benefits */}
      <section className="bg-surface border-y border-rule py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Additional Value</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              Non-quantified benefits
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: '😴', title: 'Reduced war-room fatigue', desc: 'On-call engineers approve verified patches instead of debugging from scratch at 3am. Human time spent on signal, not noise.' },
              { icon: '🤝', title: 'Faster partner onboarding', desc: 'OpenAPI import + virtual patches bridge version gaps during migration windows. Reduce API version negotiation friction.' },
              { icon: '📋', title: 'Compliance confidence', desc: 'Audit trail for every virtual patch — who approved what, when, with what verification proof. HITL by construction satisfies change management.' },
              { icon: '💡', title: 'LLM cost control', desc: 'Admission gate prevents runaway inference bills during failure storms. FinOps teams can set per-tenant budgets independently.' },
            ].map(item => (
              <div key={item.title} className="border border-rule rounded-xl p-5">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="text-sm font-semibold text-on-surface mb-2">{item.title}</h3>
                <p className="text-xs text-dim leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formula reference */}
      <section className="py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Framework</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              ROI worksheet formula
            </h2>
          </div>
          <div className="bg-ink border border-rule rounded-2xl p-8 font-mono text-xs">
            <div className="text-dim mb-4"># Variables</div>
            <div className="text-cream">I  = Integration-class P1/P2 incidents per year</div>
            <div className="text-cream">H  = Average hours to restore via deploy/rollback</div>
            <div className="text-cream">E  = Fully loaded engineer cost per hour</div>
            <div className="text-cream">R  = Average revenue at risk per hour during incident</div>
            <div className="text-cream">P  = Percent of incidents Mendr can heal (0-100)</div>
            <div className="text-cream">M  = Mendr mean time to heal after approval (~0.05-0.5h)</div>

            <div className="text-dim mt-5 mb-3"># Cost of status quo (annual)</div>
            <div className="text-success">Incident_cost = I × H × (E + R)</div>

            <div className="text-dim mt-4 mb-3"># Cost with Mendr (annual, simplified)</div>
            <div className="text-brand">Healed_incidents = I × (P/100)</div>
            <div className="text-brand">Unhealed_incidents = I - Healed_incidents</div>
            <div className="text-brand">Mendr_cost = Unhealed × H × (E+R) + Healed × M × (E+R)</div>
            <div className="text-success mt-2">Savings = Incident_cost - Mendr_cost - Mendr_platform_cost</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-subtle/40 border-y border-rule py-14 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl tracking-tight text-on-surface mb-3">
            Ready to get started?
          </h2>
          <p className="text-sm text-dim mb-6">
            Mendr is deployable today. SaaS hybrid or full on-prem. Integration failures that take hours now take minutes.
          </p>
          <button onClick={() => navigate('get-started')} className="bg-brand text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-brand-dark transition-colors text-sm">
            Get started
          </button>
        </div>
      </section>
    </div>
  )
}
