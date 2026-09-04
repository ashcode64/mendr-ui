import type { PageId } from '../App'

interface FooterProps {
  navigate: (p: PageId) => void
}

const footerLinks: { label: string; items: { id: PageId; label: string }[] }[] = [
  {
    label: 'Product',
    items: [
      { id: 'problem', label: 'The Problem' },
      { id: 'solution', label: 'How It Works' },
      { id: 'the-loop', label: 'The Healing Loop' },
      { id: 'use-cases', label: 'Use Cases' },
    ],
  },
  {
    label: 'Technology',
    items: [
      { id: 'architecture', label: 'Architecture' },
      { id: 'mendrscript', label: 'MendrScript' },
      { id: 'safety', label: 'Safety & Trust' },
      { id: 'developer-experience', label: 'Dashboard' },
    ],
  },
  {
    label: 'Company',
    items: [
      { id: 'competitive', label: 'Competitive' },
      { id: 'stakeholders', label: 'For Your Team' },
      { id: 'deployment', label: 'Deployment' },
      { id: 'roadmap', label: 'Roadmap' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { id: 'roi', label: 'Business Impact' },
      { id: 'get-started', label: 'Get Started' },
    ],
  },
]

export default function Footer({ navigate }: FooterProps) {
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-cream rounded-[6px] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2h4v4H2zM8 2h4v4H8zM2 8h4v4H2zM8 8l3 3M11 8l-3 3" stroke="#12171A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-[family-name:var(--font-display)] font-bold text-[17px] tracking-tight">mendr</span>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-[200px]">
              Self-healing API infrastructure for enterprise teams.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map(col => (
            <div key={col.label}>
              <div className="text-[10px] font-semibold text-dim uppercase tracking-widest mb-4">{col.label}</div>
              <ul className="space-y-2.5">
                {col.items.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => navigate(item.id)}
                      className="text-sm text-muted hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-dim">
            © 2026 Mendr Technologies, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-dim hover:text-white transition-colors cursor-pointer">Privacy</span>
            <span className="text-xs text-dim hover:text-white transition-colors cursor-pointer">Terms</span>
            <span className="text-xs text-dim hover:text-white transition-colors cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
