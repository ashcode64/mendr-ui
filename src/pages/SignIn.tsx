import { useState } from 'react'
import type { NavigateFn } from '../App'

interface Props { navigate: NavigateFn }

export default function SignIn({ navigate }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError('')
    setLoading(true)
    setTimeout(() => setLoading(false), 1200)
  }

  return (
    <div className="min-h-[calc(100vh-60px)] grid lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="hidden lg:flex flex-col bg-ink px-14 py-16 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-brand/25 blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-0 w-72 h-72 rounded-full bg-cream/8 blur-[80px]"></div>
        </div>

        <div className="relative flex-1 flex flex-col">
          {/* Logo wordmark */}
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-8 h-8 bg-cream rounded-[7px] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M2 2h4v4H2zM8 2h4v4H8zM2 8h4v4H2zM8 8l3 3M11 8l-3 3" stroke="#12171A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-[family-name:var(--font-display)] font-bold text-[18px] text-white tracking-tight">mendr</span>
          </div>

          {/* Headline */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-cream/10 text-cream text-xs font-semibold px-3 py-1.5 rounded-full mb-8 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-slow"></span>
              Self-healing API platform
            </div>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-[2.2rem] leading-[1.15] tracking-tight text-white mb-5">
              Services break in real-time.<br />
              <span className="text-cream">Mendr fixes them</span><br />
              in real-time.
            </h2>
            <p className="text-muted leading-relaxed text-sm max-w-sm">
              Detect integration failures at the gateway layer, diagnose with AI, approve in the dashboard, and heal at the edge — without redeploys or downtime.
            </p>
          </div>

          {/* Recent heal log */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mt-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-slow"></div>
              <span className="text-xs font-semibold text-muted uppercase tracking-wide">Live heals</span>
            </div>
            <div className="space-y-2.5">
              {[
                { time: '2m ago', route: 'inventory→shipping', op: 'rename /mag_sent → /tag_sent', badge: 'bg-sky/30 text-sky-ink' },
                { time: '1h ago', route: 'payment→billing', op: 'coerce /amount string→number', badge: 'bg-cream/30 text-cream-ink' },
                { time: '3h ago', route: 'bff→catalog', op: 'CORS allow origin', badge: 'bg-success/20 text-success' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] flex-shrink-0 ${item.badge}`}>
                    healed
                  </span>
                  <span className="font-mono text-dim">{item.route}</span>
                  <span className="ml-auto text-dim whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center px-6 py-16 bg-canvas">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-7 h-7 bg-brand rounded-[6px] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2h4v4H2zM8 2h4v4H8zM2 8h4v4H2zM8 8l3 3M11 8l-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-[family-name:var(--font-display)] font-bold text-[17px] text-brand tracking-tight">mendr</span>
          </div>

          <h1 className="font-[family-name:var(--font-display)] font-bold text-[1.75rem] tracking-tight text-on-surface mb-1.5">
            Welcome back
          </h1>
          <p className="text-sm text-dim mb-8">
            Sign in to your Mendr operator dashboard.
          </p>

          {/* SSO buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              {
                label: 'Continue with SSO',
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="9" height="9" rx="1.5" fill="#4285F4"/>
                    <rect x="13" y="2" width="9" height="9" rx="1.5" fill="#EA4335"/>
                    <rect x="2" y="13" width="9" height="9" rx="1.5" fill="#34A853"/>
                    <rect x="13" y="13" width="9" height="9" rx="1.5" fill="#FBBC05"/>
                  </svg>
                ),
              },
              {
                label: 'Continue with OIDC',
                icon: (
                  <svg className="w-4 h-4 text-on-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
              },
            ].map(btn => (
              <button
                key={btn.label}
                className="flex items-center justify-center gap-2 border border-rule bg-surface rounded-lg py-2.5 text-xs font-medium text-on-surface hover:bg-canvas transition-colors"
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-rule"></div>
            <span className="text-xs text-muted">or sign in with email</span>
            <div className="flex-1 h-px bg-rule"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">Work email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full border border-rule bg-surface rounded-lg px-4 py-3 text-sm text-on-surface placeholder-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-on-surface">Password</label>
                <button type="button" className="text-xs text-brand hover:text-brand-dark transition-colors font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-rule bg-surface rounded-lg px-4 py-3 pr-11 text-sm text-on-surface placeholder-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dim transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-error/10 border border-error/40 rounded-lg px-4 py-3 text-xs text-error font-medium">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand text-white font-semibold py-3.5 rounded-lg hover:bg-brand-dark transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Signing in…
                </>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-dim mt-6">
            {"Don't have an account? "}
            <button
              onClick={() => navigate('sign-up')}
              className="text-brand font-semibold hover:text-brand-dark transition-colors"
            >
              Create one
            </button>
          </p>

          {/* Footer note */}
          <p className="text-center text-[10px] text-muted mt-8 leading-relaxed">
            By signing in, you agree to Mendr{"'"}s{' '}
            <span className="underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
