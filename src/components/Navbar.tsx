import { useState } from 'react'
import type { PageId } from '../App'
import { useTheme } from '../theme'

interface NavbarProps {
  currentPage: PageId
  navigate: (p: PageId) => void
}

const navGroups = [
  {
    label: 'Product',
    items: [
      { id: 'problem' as PageId, label: 'The Problem', desc: 'Why APIs break in production' },
      { id: 'solution' as PageId, label: 'How It Works', desc: 'The four-step healing loop' },
      { id: 'the-loop' as PageId, label: 'The Loop', desc: 'Detect · Diagnose · Approve · Heal' },
    ],
  },
  {
    label: 'Technology',
    items: [
      { id: 'architecture' as PageId, label: 'Architecture', desc: 'Two-plane design' },
      { id: 'mendrscript' as PageId, label: 'MendrScript', desc: 'Verified transform DSL' },
      { id: 'safety' as PageId, label: 'Safety & Trust', desc: 'Human-in-the-loop by design' },
    ],
  },
  {
    label: 'Why Mendr',
    items: [
      { id: 'use-cases' as PageId, label: 'Use Cases', desc: 'Field rename, CORS, routing...' },
      { id: 'competitive' as PageId, label: 'Competitive', desc: 'A new category' },
      { id: 'stakeholders' as PageId, label: 'For Your Team', desc: 'CTO · SRE · Security · Product' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { id: 'deployment' as PageId, label: 'Deployment', desc: 'SaaS hybrid or full on-prem' },
      { id: 'developer-experience' as PageId, label: 'Dashboard', desc: 'Operator UI & developer portal' },
      { id: 'roadmap' as PageId, label: 'Roadmap', desc: "What's shipped, what's next" },
      { id: 'roi' as PageId, label: 'Business Impact', desc: 'ROI framework' },
    ],
  },
]

export default function Navbar({ currentPage, navigate }: NavbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 bg-canvas/95 backdrop-blur-sm border-b border-rule">
      <div className="max-w-7xl mx-auto px-6 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => { navigate('home'); setMobileOpen(false); }}
          className="flex items-center gap-2.5"
        >
          <div className="w-7 h-7 bg-brand rounded-[6px] flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2h4v4H2zM8 2h4v4H8zM2 8h4v4H2zM8 8l3 3M11 8l-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-[family-name:var(--font-display)] font-bold text-[17px] text-brand tracking-tight">mendr</span>
        </button>

        {/* Desktop nav groups */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navGroups.map(group => (
            <div
              key={group.label}
              className="relative"
              onMouseEnter={() => setActiveDropdown(group.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`flex items-center gap-1 px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors
                ${group.items.some(i => i.id === currentPage)
                  ? 'text-brand'
                  : 'text-dim hover:text-on-surface'}`}>
                {group.label}
                <svg className={`w-3 h-3 transition-transform ${activeDropdown === group.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === group.label && (
                <div className="absolute top-full left-0 pt-2 w-64">
                  <div className="bg-surface border border-rule rounded-xl shadow-lg shadow-black/5 py-2 overflow-hidden">
                    {group.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => { navigate(item.id); setActiveDropdown(null); }}
                        className={`w-full text-left px-4 py-2.5 transition-colors hover:bg-canvas group
                          ${currentPage === item.id ? 'bg-brand-subtle/40' : ''}`}
                      >
                        <div className={`text-sm font-medium ${currentPage === item.id ? 'text-brand' : 'text-on-surface'}`}>
                          {item.label}
                        </div>
                        <div className="text-xs text-dim mt-0.5">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg border border-rule text-dim hover:text-on-surface hover:bg-overlay transition-colors"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05L5.636 5.636m12.728 0l-1.414 1.414M7.05 16.95l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => navigate('sign-in')}
            className="hidden lg:block text-sm font-medium text-dim hover:text-on-surface transition-colors"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('get-started')}
            className="bg-brand text-white text-sm font-semibold px-4 py-[9px] rounded-lg hover:bg-brand-dark transition-colors leading-none"
          >
            Get started
          </button>
          <button className="lg:hidden p-1.5 text-dim" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-rule bg-surface max-h-[80vh] overflow-y-auto">
          {navGroups.map(group => (
            <div key={group.label} className="border-b border-rule last:border-0">
              <div className="px-6 pt-3 pb-1 text-[10px] font-semibold text-dim uppercase tracking-widest">
                {group.label}
              </div>
              {group.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => { navigate(item.id); setMobileOpen(false); }}
                  className={`w-full text-left px-6 py-3 text-sm hover:bg-canvas transition-colors
                    ${currentPage === item.id ? 'text-brand font-medium' : 'text-on-surface'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </nav>
  )
}
