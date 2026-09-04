import { useState } from 'react'
import type { NavigateFn } from '../App'

interface Props { navigate: NavigateFn }

type Step = 1 | 2

const plans = [
  {
    id: 'hybrid',
    name: 'SaaS Hybrid',
    price: 'Contact us',
    desc: 'Control plane hosted by Mendr. Deploy your edge gateway in your own VPC.',
    features: ['Managed control plane', 'Unlimited edge deployments', '99.9% SLA', 'SOC 2 compliant'],
    badge: 'Most popular',
    badgeColor: 'bg-sky text-sky-ink',
  },
  {
    id: 'onprem',
    name: 'Full On-Prem',
    price: 'Contact us',
    desc: 'Both planes in your own infrastructure. Air-gapped environments supported.',
    features: ['Complete data sovereignty', 'Air-gap compatible', 'Self-managed upgrades', 'Enterprise SLA'],
    badge: 'Enterprise',
    badgeColor: 'bg-cream text-cream-ink',
  },
]

export default function SignUp({ navigate }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState({ name: '', email: '', company: '', role: '', plan: 'hybrid' })
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (field: keyof typeof form, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const validateStep1 = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Work email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.company.trim()) e.company = 'Company is required'
    return e
  }

  const validateStep2 = () => {
    const e: Record<string, string> = {}
    if (!password) e.password = 'Password is required'
    else if (password.length < 8) e.password = 'Password must be at least 8 characters'
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!agreed) e.agreed = 'You must accept the terms to continue'
    return e
  }

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    const e2 = validateStep1()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setErrors({})
    setStep(2)
  }

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    const e2 = validateStep2()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setErrors({})
    setLoading(true)
    setTimeout(() => setLoading(false), 1400)
  }

  const passwordStrength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) ? 4 : 3

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', '#D92D20', '#F59E0B', '#3B82F6', '#22C55E']

  return (
    <div className="min-h-[calc(100vh-60px)] grid lg:grid-cols-2">
      {/* Left — steps panel */}
      <div className="hidden lg:flex flex-col bg-ink px-14 py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-brand/20 blur-[100px]"></div>
          <div className="absolute bottom-1/3 right-10 w-72 h-72 rounded-full bg-cream/6 blur-[80px]"></div>
        </div>

        <div className="relative flex-1 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-8 h-8 bg-cream rounded-[7px] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M2 2h4v4H2zM8 2h4v4H8zM2 8h4v4H2zM8 8l3 3M11 8l-3 3" stroke="#12171A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-[family-name:var(--font-display)] font-bold text-[18px] text-white tracking-tight">mendr</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="font-[family-name:var(--font-display)] font-bold text-[2rem] leading-[1.15] tracking-tight text-white mb-4">
              Start healing APIs<br />
              <span className="text-cream">in minutes.</span>
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-10 max-w-xs">
              Join organizations using Mendr to turn integration incidents from hours-long war rooms into minutes of dashboard review.
            </p>

            {/* Step indicators */}
            <div className="space-y-4">
              {[
                { num: 1, title: 'Account details', desc: 'Name, email, and company' },
                { num: 2, title: 'Password & plan', desc: 'Secure your account and choose deployment' },
                { num: 3, title: 'Connect your first service', desc: "Import an OpenAPI spec or mendr.yaml — you're ready to go" },
              ].map(s => (
                <div key={s.num} className="flex items-start gap-4">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 transition-all
                    ${s.num < step ? 'bg-success text-white' : s.num === step ? 'bg-brand text-white ring-2 ring-brand/40' : 'bg-white/10 text-dim'}`}>
                    {s.num < step ? (
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : s.num}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${s.num <= step ? 'text-white' : 'text-dim'}`}>{s.title}</div>
                    <div className="text-xs text-dim mt-0.5">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust note */}
          <div className="mt-10 border-t border-white/10 pt-8 flex flex-col gap-3">
            {[
              { icon: '🔒', text: 'SOC 2 Type II compliant' },
              { icon: '🛡️', text: 'FORCE RLS multi-tenant isolation' },
              { icon: '📋', text: 'HITL by default — AI never auto-deploys' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-2.5 text-xs text-muted">
                <span>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center px-6 py-14 bg-canvas">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-7 h-7 bg-brand rounded-[6px] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2h4v4H2zM8 2h4v4H8zM2 8h4v4H2zM8 8l3 3M11 8l-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-[family-name:var(--font-display)] font-bold text-[17px] text-brand tracking-tight">mendr</span>
          </div>

          {/* Step header */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-dim uppercase tracking-widest">Step {step} of 2</span>
              <div className="flex gap-1.5 ml-2">
                {([1, 2] as Step[]).map(n => (
                  <div key={n} className={`h-1 rounded-full transition-all ${n <= step ? 'bg-brand' : 'bg-rule'} ${n === step ? 'w-6' : 'w-3'}`}></div>
                ))}
              </div>
            </div>
            <h1 className="font-[family-name:var(--font-display)] font-bold text-[1.65rem] tracking-tight text-on-surface">
              {step === 1 ? 'Create your account' : 'Secure your account'}
            </h1>
            <p className="text-sm text-dim mt-1">
              {step === 1 ? 'Start your Mendr journey — free to evaluate.' : 'Choose a strong password and your deployment model.'}
            </p>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">Full name</label>
                  <input
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder="Jane Smith"
                    className={`w-full border bg-surface rounded-lg px-3.5 py-3 text-sm text-on-surface placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand/15 transition-all
                      ${errors.name ? 'border-error focus:border-error' : 'border-rule focus:border-brand'}`}
                  />
                  {errors.name && <p className="text-[10px] text-error mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">Role</label>
                  <select
                    value={form.role}
                    onChange={e => update('role', e.target.value)}
                    className="w-full border border-rule bg-surface rounded-lg px-3.5 py-3 text-sm text-on-surface focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
                  >
                    <option value="">Select…</option>
                    <option>CTO / VP Eng</option>
                    <option>Platform / SRE</option>
                    <option>Security / GRC</option>
                    <option>API / Integration</option>
                    <option>Product</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">Work email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="you@company.com"
                  className={`w-full border bg-surface rounded-lg px-3.5 py-3 text-sm text-on-surface placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand/15 transition-all
                    ${errors.email ? 'border-error focus:border-error' : 'border-rule focus:border-brand'}`}
                />
                {errors.email && <p className="text-[10px] text-error mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">Company</label>
                <input
                  value={form.company}
                  onChange={e => update('company', e.target.value)}
                  placeholder="Acme Corp"
                  className={`w-full border bg-surface rounded-lg px-3.5 py-3 text-sm text-on-surface placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand/15 transition-all
                    ${errors.company ? 'border-error focus:border-error' : 'border-rule focus:border-brand'}`}
                />
                {errors.company && <p className="text-[10px] text-error mt-1">{errors.company}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-brand text-white font-semibold py-3.5 rounded-lg hover:bg-brand-dark transition-colors text-sm mt-2 flex items-center justify-center gap-2"
              >
                Continue
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-5" noValidate>
              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className={`w-full border bg-surface rounded-lg px-3.5 py-3 pr-11 text-sm text-on-surface placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand/15 transition-all
                      ${errors.password ? 'border-error' : 'border-rule focus:border-brand'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dim">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      {showPassword
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>}
                    </svg>
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3, 4].map(n => (
                        <div key={n} className="flex-1 h-1 rounded-full transition-all" style={{ backgroundColor: n <= passwordStrength ? strengthColor[passwordStrength] : 'var(--mendr-rule)' }}></div>
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: strengthColor[passwordStrength] }}>{strengthLabel[passwordStrength]}</span>
                  </div>
                )}
                {errors.password && <p className="text-[10px] text-error mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className={`w-full border bg-surface rounded-lg px-3.5 py-3 text-sm text-on-surface placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand/15 transition-all
                    ${errors.confirmPassword ? 'border-error' : confirmPassword && password === confirmPassword ? 'border-success focus:border-success' : 'border-rule focus:border-brand'}`}
                />
                {errors.confirmPassword && <p className="text-[10px] text-error mt-1">{errors.confirmPassword}</p>}
                {confirmPassword && password === confirmPassword && <p className="text-[10px] text-success mt-1 flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>Passwords match</p>}
              </div>

              {/* Plan selection */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-2.5">Deployment model</label>
                <div className="space-y-2.5">
                  {plans.map(plan => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => update('plan', plan.id)}
                      className={`w-full text-left border rounded-xl p-4 transition-all
                        ${form.plan === plan.id ? 'border-brand bg-sky/30 ring-1 ring-brand/20' : 'border-rule bg-surface hover:border-sky'}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                            ${form.plan === plan.id ? 'border-brand bg-brand' : 'border-rule-strong'}`}>
                            {form.plan === plan.id && <div className="w-1.5 h-1.5 rounded-full bg-surface"></div>}
                          </div>
                          <span className="text-sm font-semibold text-on-surface">{plan.name}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${plan.badgeColor}`}>{plan.badge}</span>
                      </div>
                      <p className="text-xs text-dim ml-6 leading-relaxed">{plan.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <div
                    onClick={() => setAgreed(!agreed)}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all cursor-pointer
                      ${agreed ? 'bg-brand border-brand' : errors.agreed ? 'border-error' : 'border-rule-strong'}`}
                  >
                    {agreed && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                  </div>
                  <span className="text-xs text-on-surface leading-relaxed">
                    I agree to Mendr{"'"}s{' '}
                    <span className="text-brand underline cursor-pointer">Terms of Service</span>
                    {' '}and{' '}
                    <span className="text-brand underline cursor-pointer">Privacy Policy</span>
                  </span>
                </label>
                {errors.agreed && <p className="text-[10px] text-error mt-1.5 ml-7">{errors.agreed}</p>}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setStep(1); setErrors({}); }}
                  className="flex items-center gap-1.5 border border-rule bg-surface text-dim font-medium px-5 py-3.5 rounded-lg hover:bg-canvas transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand text-white font-semibold py-3.5 rounded-lg hover:bg-brand-dark transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Creating account…
                    </>
                  ) : 'Create account'}
                </button>
              </div>
            </form>
          )}

          {/* Sign in link */}
          <p className="text-center text-sm text-dim mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('sign-in')}
              className="text-brand font-semibold hover:text-brand-dark transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
