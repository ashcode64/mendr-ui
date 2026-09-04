import { useState } from 'react'
import type { NavigateFn } from '../App'
import HeroSpotlight from '../components/HeroSpotlight'

interface Props { navigate: NavigateFn }

function ContactSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return
    setSending(true)
    setTimeout(() => { setSending(false); setSent(true) }, 1000)
  }

  return (
    <section id="contact" className="bg-canvas border-t border-rule py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left — copy */}
          <div className="lg:pt-4">
            <div className="inline-flex items-center gap-2 bg-cream text-cream-ink text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
              Get in touch
            </div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-[2.2rem] lg:text-[2.8rem] leading-[1.15] tracking-tight text-on-surface mb-5">
              {"Let's talk about"}<br />your stack
            </h2>
            <p className="text-dim leading-relaxed mb-8 max-w-sm">
              Tell us how your services talk to each other and where they keep breaking. {"We'll"} get back to you shortly.
            </p>
            <div className="mb-3 text-xs text-muted">Or email us directly</div>
            <a
              href="mailto:team.mendr@gmail.com"
              className="inline-flex items-center gap-2 text-brand font-semibold text-sm hover:text-brand-dark transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              team.mendr@gmail.com
            </a>
          </div>

          {/* Right — form */}
          <div className="bg-surface border border-rule rounded-2xl p-8 shadow-sm">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-[family-name:var(--font-display)] font-bold text-lg text-on-surface mb-2">Message sent</h3>
                <p className="text-sm text-dim">{"We'll"} be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="your name"
                    required
                    className="w-full border border-rule bg-canvas rounded-lg px-4 py-3 text-sm text-on-surface placeholder-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">Work email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full border border-rule bg-canvas rounded-lg px-4 py-3 text-sm text-on-surface placeholder-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="Company name"
                    className="w-full border border-rule bg-canvas rounded-lg px-4 py-3 text-sm text-on-surface placeholder-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">Message</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={"What's breaking, and how can we help?"}
                    required
                    rows={4}
                    className="w-full border border-rule bg-canvas rounded-lg px-4 py-3 text-sm text-on-surface placeholder-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all resize-y"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 bg-brand text-white font-semibold py-3.5 rounded-lg hover:bg-brand-dark transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending…
                      </>
                    ) : 'Send message'}
                  </button>
                  <a
                    href="mailto:team@mendr.io"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center bg-cream text-ink font-bold px-8 py-3.5 rounded-lg hover:bg-[#F5F3C0] transition-colors text-sm"
                  >
                    Get in touch
                  </a>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

export default function GetStarted({ navigate }: Props) {
  return (
    <div>
      {/* Hero */}
      <HeroSpotlight className="bg-ink py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-cream/10 text-cream text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-slow"></span>
            Now in production — August 2026
          </div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[clamp(2.4rem,6vw,4rem)] leading-[1.1] tracking-[-0.03em] text-white mb-5">
            Stop treating integration<br />failures as facts of life.
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto mb-10">
            Mendr is deployable today — SaaS hybrid or full on-prem. The complete product loop is implemented and verifiable in the current codebases.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="w-full sm:w-auto bg-cream text-ink font-bold px-8 py-4 rounded-xl hover:bg-surface transition-colors text-sm"
            >
              Contact us
            </a>
            <button
              onClick={() => navigate('architecture')}
              className="w-full sm:w-auto bg-white/10 text-white border border-white/20 font-semibold px-8 py-4 rounded-xl hover:bg-white/15 transition-colors text-sm"
            >
              View architecture docs
            </button>
          </div>
        </div>
      </HeroSpotlight>

      {/* Three paths */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Deployment Options</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              Three paths to get started
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🚀',
                title: 'SaaS hybrid',
                label: 'Fastest time-to-value',
                desc: 'Control plane hosted by Mendr. Deploy your edge gateway in your VPC or on-prem with a single Docker command. Ready in under 30 minutes.',
                steps: [
                  'Sign up and receive your GATEWAY_EDGE_API_KEY',
                  'Deploy mendr-gateway in your network',
                  'Import your first OpenAPI spec',
                  'Traffic starts healing within hours of first failure',
                ],
                cta: 'Contact sales',
                color: 'bg-sky',
                textClass: 'text-sky-ink',
                labelClass: 'text-sky-ink/60',
                ctaColor: 'bg-brand text-white',
              },
              {
                icon: '🏗️',
                title: 'Full on-prem',
                label: 'Maximum control',
                desc: 'Deploy both control plane and data plane in your own infrastructure. Air-gapped environments supported. Full docker compose stack.',
                steps: [
                  'Clone mendr-control-plane repository',
                  'docker compose up -d --build',
                  'Clone mendr-data-plane and configure',
                  'Import services and configure routing',
                ],
                cta: 'Request access',
                color: 'bg-cream',
                textClass: 'text-cream-ink',
                labelClass: 'text-cream-ink/60',
                ctaColor: 'bg-[#5C4A00] text-white',
              },
              {
                icon: '🔬',
                title: 'Technical evaluation',
                label: 'For CTOs and architects',
                desc: '1-2 day technical validation session with engineering stakeholders from platform, security, and integration teams. Validate against your specific architecture.',
                steps: [
                  'Review architecture documentation',
                  'Schedule technical validation call',
                  'Platform, security, and integration teams',
                  'Evaluate against real integration failure scenarios',
                ],
                cta: 'Schedule call',
                color: 'bg-sky',
                textClass: 'text-sky-ink',
                labelClass: 'text-sky-ink/60',
                ctaColor: 'bg-brand text-white',
              },
            ].map(path => (
              <div key={path.title} className="border border-rule rounded-2xl overflow-hidden flex flex-col">
                <div className={`px-6 pt-6 pb-5 ${path.color}`}>
                  <div className="text-2xl mb-3">{path.icon}</div>
                  <div className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${path.labelClass}`}>{path.label}</div>
                  <h3 className={`font-[family-name:var(--font-display)] font-bold text-lg mb-2 ${path.textClass}`}>{path.title}</h3>
                  <p className={`text-xs leading-relaxed ${path.textClass}`}>{path.desc}</p>
                </div>
                <div className="bg-surface p-6 flex-1 flex flex-col">
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {path.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-overlay flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-dim mt-0.5">
                          {i + 1}
                        </div>
                        <span className="text-xs text-on-surface">{step}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${path.ctaColor} hover:opacity-90`}>
                    {path.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick-start code */}
      <section className="bg-surface border-y border-rule py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Quick Start</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              Full on-prem in three commands
            </h2>
          </div>
          <div className="space-y-3">
            {[
              {
                label: '# Clone and start control plane',
                cmd: `git clone https://github.com/mendr/mendr-control-plane
cd mendr-control-plane
cp .env.example .env  # Configure LLM keys, WorkOS, etc.
docker compose up -d --build`,
              },
              {
                label: '# Clone and start data plane',
                cmd: `git clone https://github.com/mendr/mendr-data-plane
cd mendr-data-plane
MENDR_CONTROL_PLANE_URL=http://localhost:8095 \\
  GATEWAY_EDGE_API_KEY=your_key \\
  docker compose up -d`,
              },
              {
                label: '# Register your first service',
                cmd: `# Import OpenAPI spec
curl -X POST http://localhost:8095/api/services/import-openapi \\
  -H "Authorization: Bearer $TOKEN" \\
  -F "file=@./openapi.yaml"

# Or use mendr.yaml manifest
curl -X POST http://localhost:8095/api/gateway/gitops/manifest \\
  -H "Content-Type: application/yaml" \\
  --data-binary @mendr.yaml`,
              },
            ].map((block, i) => (
              <div key={i} className="bg-ink rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/10">
                  <span className="text-[10px] text-dim font-mono">{block.label}</span>
                </div>
                <pre className="p-5 text-xs font-mono text-muted overflow-auto leading-relaxed whitespace-pre">
                  {block.cmd}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigate to docs */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Learn More</div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface">
              Everything you need to evaluate Mendr
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'How It Works', desc: 'Four-step healing loop overview', page: 'solution' as const, bg: 'bg-sky', text: 'text-sky-ink', descText: 'text-sky-ink/70' },
              { label: 'Architecture', desc: 'Two-plane design deep dive', page: 'architecture' as const, bg: 'bg-cream', text: 'text-cream-ink', descText: 'text-cream-ink/70' },
              { label: 'Security', desc: 'HITL, compliance, multi-tenancy', page: 'safety' as const, bg: 'bg-success/15', text: 'text-success', descText: 'text-success/80' },
              { label: 'Business Impact', desc: 'ROI framework and calculator', page: 'roi' as const, bg: 'bg-sky', text: 'text-sky-ink', descText: 'text-sky-ink/70' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.page)}
                className={`text-left border border-rule-strong rounded-xl p-5 hover:border-brand/30 hover:shadow-sm transition-all group ${item.bg}`}
              >
                <div className={`text-sm font-bold mb-1 group-hover:text-brand transition-colors ${item.text}`}>{item.label}</div>
                <div className={`text-xs ${item.descText}`}>{item.desc}</div>
                <div className="mt-3 text-xs text-brand font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — Get in touch */}
      <ContactSection />
    </div>
  )
}
