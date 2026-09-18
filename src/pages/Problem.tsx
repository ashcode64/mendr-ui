import type { NavigateFn } from '../App'
import HeroSpotlight from '../components/HeroSpotlight'

interface Props { navigate: NavigateFn }

const failureCategories = [
  { category: 'SCHEMA_MISMATCH', symptom: 'Wrong or missing field, bad type, validation 4xx error', impact: 'Order submission fails; inventory sync breaks', example: 'Field renamed from tag_id to tag_sent' },
  { category: 'RESPONSE_MISMATCH', symptom: 'Response shape no longer matches what callers expect', impact: 'Apps crash or show blank data', example: 'Extra nesting breaks a JSON parser' },
  { category: 'ROUTING', symptom: 'Wrong host, DNS failure, 502/503', impact: 'Traffic goes nowhere; retries pile up', example: 'Old server retired, registry still points there' },
  { category: 'CORS', symptom: 'Browser or gateway blocks a cross-site call', impact: 'A front-end feature quietly stops working', example: 'Security tightens CORS and breaks a legitimate app' },
  { category: 'SPLICE', symptom: 'A live rewrite stops mid-stream', impact: 'Caller sees an error even when upstream returned OK', example: 'Large JSON rename under heavy traffic' },
  { category: 'UNKNOWN', symptom: 'Error does not match a known pattern', impact: 'Needs a human to investigate', example: 'Novel failure signature, no precedent' },
]

const costs = [
  { icon: '⏱️', title: 'Engineering time', desc: 'Senior engineers in war rooms instead of shipping product. On-call burns time debugging instead of building.' },
  { icon: '💸', title: 'Lost revenue', desc: 'Failed checkouts, stuck shipments, broken signups. Every minute of downtime costs money.' },
  { icon: '📋', title: 'SLA credits & penalties', desc: 'B2B platforms face contractual uptime guarantees. Integration failures trigger credit obligations and erode trust.' },
  { icon: '👥', title: 'Customer trust erosion', desc: 'Users just see "the app is broken." They do not care which microservice drifted. Trust is hard to rebuild.' },
  { icon: '⚖️', title: 'Compliance risk', desc: 'Emergency hotfixes bypass normal change process and create audit gaps. PII mishandling risks during rushed deploys.' },
]

export default function Problem({ navigate }: Props) {
  return (
    <div>
      {/* Header */}
      <HeroSpotlight className="border-b border-rule py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">The Problem</div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[clamp(2rem,5vw,3.2rem)] leading-[1.15] tracking-tight text-on-surface mb-5">
            The quiet tax of distributed systems
          </h1>
          <p className="text-lg text-dim leading-relaxed max-w-2xl mx-auto">
            When an organization adopts microservices, it inherits a surface of inter-linked services talking to each other. Each link is a shared contract about fields and routes. Those contract drift, and customers feel it before your team does.
          </p>
        </div>
      </HeroSpotlight>

      {/* Combinatorial surface */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface mb-4">
                Why this problem never goes away
              </h2>
              <p className="text-dim leading-relaxed mb-6">
                If N services each expose M endpoints, the number of ways two of them can disagree grows faster than any team can retest by hand before every production release thoroughly.
              </p>
              <p className="text-dim leading-relaxed mb-6">
                Modern release cycles are faster than they used to be. But, Production state still changes faster:
              </p>
              <ul className="space-y-3">
                {[
                  'Upstream SaaS vendors change APIs on their own schedule',
                  'Partner integrations update without synchronized deploys',
                  'Feature flags expose new code paths that alter payloads',
                  'Database migrations change serialized field shapes',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-error/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-error" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-on-surface">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Incident timeline */}
            <div className="bg-surface border border-rule rounded-2xl overflow-hidden">
              <div className="bg-error/10 border-b border-error/40 px-6 py-4">
                <div className="text-sm font-bold text-error">Typical incident timeline — integration class</div>
              </div>
              {[
                { time: '0:00', label: 'Customers start to feel it', note: 'Still silent; no alert yet' },
                { time: '0:08-20', label: 'Alert fires on SLO breach', note: 'Minutes of customer impact already' },
                { time: '0:25', label: 'On-call assembles, triage starts', note: 'Logs, traces, dashboards open' },
                { time: '1:00', label: 'Root cause isolated: contract mismatch', note: 'Not an infra outage; schema drift' },
                { time: '1:30', label: 'Fix designed, PR opened', note: 'Owning team notified' },
                { time: '2:30', label: 'CI runs, Change ticket opened, review obtained', note: 'Testing, approval gates' },
                { time: '4:00-8:00', label: 'Deploy and verify', note: 'Customers impacted the entire time' },
              ].map((row, i) => (
                <div key={i} className={`flex items-start gap-4 px-6 py-3.5 border-b border-overlay last:border-0 ${i === 0 ? 'bg-warning/15' : ''}`}>
                  <div className="w-14 flex-shrink-0">
                    <span className="text-xs font-mono text-error font-semibold">{row.time}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-on-surface">{row.label}</div>
                    <div className="text-xs text-dim">{row.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Failure categories */}
      <section className="bg-surface border-y border-rule py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Failure Taxonomy</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              Six classes of integration failures that Mendr addresses
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule">
                  <th className="text-left py-3 pr-6 text-xs font-semibold text-dim uppercase tracking-wide">Category</th>
                  <th className="text-left py-3 pr-6 text-xs font-semibold text-dim uppercase tracking-wide">Typical symptom</th>
                  <th className="text-left py-3 pr-6 text-xs font-semibold text-dim uppercase tracking-wide">Business impact</th>
                  <th className="text-left py-3 text-xs font-semibold text-dim uppercase tracking-wide">Real example</th>
                </tr>
              </thead>
              <tbody>
                {failureCategories.map((row, i) => (
                  <tr key={row.category} className={`border-b border-overlay hover:bg-canvas transition-colors ${i % 2 === 0 ? '' : ''}`}>
                    <td className="py-4 pr-6">
                      <span className="inline-block font-mono text-xs font-semibold bg-sky text-sky-ink px-2.5 py-1 rounded-md">
                        {row.category}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-on-surface">{row.symptom}</td>
                    <td className="py-4 pr-6 text-on-surface">{row.impact}</td>
                    <td className="py-4 text-dim text-xs">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Detection doesn't fix */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">The Gap</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl lg:text-[1.9rem] tracking-tight text-on-surface mb-4">
              The industry automated detection. Repair is still manual.
            </h2>
            <p className="text-dim max-w-xl mx-auto">
              Two incomplete answers dominate the market, and both leave you with an unfixed API call.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            <div className="bg-surface border border-rule rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-warning/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7..." />
                  </svg>
                </div>
                <h3 className="font-semibold text-on-surface">Detection without repair</h3>
              </div>
              <p className="text-sm text-dim leading-relaxed">
                APM, log aggregation, distributed tracing — excellent at telling operators that <span className="font-mono text-xs bg-overlay px-1 rounded">inventory→shipping</span> returned 400 when field <span className="font-mono text-xs bg-overlay px-1 rounded">tag_id</span> was expected. They do not repair the call.
              </p>
            </div>

            <div className="bg-surface border border-rule rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-sky rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-sky-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-on-surface">Routing without meaning</h3>
              </div>
              <p className="text-sm text-dim leading-relaxed">
                Gateways and meshes handle security and traffic volume well. They were not built to rename a field, fix a type, or fill a missing value safely and at streaming throughput when two systems disagree.
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto bg-brand-subtle/40 border border-brand/20 rounded-xl p-6 text-center">
            <div className="text-sm font-semibold text-brand mb-1">Mendr closes that gap</div>
            <p className="text-sm text-on-surface">
              An intelligent runtime layer that combines observability and gateway control with a policy-driven repair engine, applying verified, human-approved temporary patches to production traffic in real time.
            </p>
          </div>
        </div>
      </section>

      {/* Costs */}
      <section className="bg-ink py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Business Impact</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl lg:text-[1.9rem] tracking-tight text-white">
              What these incidents actually cost
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {costs.map(cost => (
              <div key={cost.title} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="text-2xl mb-3">{cost.icon}</div>
                <h3 className="text-sm font-semibold text-white mb-2">{cost.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{cost.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface mb-4">
            Ready to see the solution?
          </h2>
          <p className="text-dim mb-7">
            Mendr focuses on the share of these costs that come from repairable contract and routing breaks at the API boundary.
          </p>
          <button onClick={() => navigate('solution')} className="bg-brand text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-brand-dark transition-colors text-sm">
            See how Mendr fixes it
          </button>
        </div>
      </section>
    </div>
  )
}
