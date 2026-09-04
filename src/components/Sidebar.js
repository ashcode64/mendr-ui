import React from 'react';
import { NavLink } from 'react-router-dom';
import UserMenu from '../auth/UserMenu';
import ThemeToggle from './ThemeToggle';

const NAV = [
  { to: '/',         icon: '⬡',  label: 'Overview'      },
  { to: '/failures', icon: '⚡',  label: 'Failures'      },
  { to: '/analysis', icon: '🧠',  label: 'AI Analysis'   },
  { to: '/rules',    icon: '⚙️',  label: 'Active Rules'  },
  { to: '/services', icon: '🔌',  label: 'Services'      },
  { to: '/portal',   icon: '📚',  label: 'Dev Portal'    },
  { to: '/simulate', icon: '🎯',  label: 'Simulate'      },
  { to: '/audit',    icon: '📋',  label: 'Audit Log'     },
];

export default function Sidebar({ pendingCount = 0 }) {
  return (
    <aside style={s.aside}>
      {/* Logo */}
      <div style={s.logo}>
        <div style={s.logoIcon}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2h4v4H2zM8 2h4v4H8zM2 8h4v4H2zM8 8l3 3M11 8l-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div style={s.logoName}>mendr</div>
          <div style={s.logoSub}>Self-Healing API</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={s.nav}>
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
            ...s.link,
            ...(isActive ? s.linkActive : {}),
          })}>
            <span style={s.linkIcon}>{icon}</span>
            <span>{label}</span>
            {label === 'AI Analysis' && pendingCount > 0 && (
              <span style={s.badge}>{pendingCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Theme + status footer */}
      <div style={s.footerBlock}>
        <ThemeToggle />
        <div style={s.footer}>
          <div style={s.footerDot} />
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>System Status</div>
            <div style={{ fontSize: 11, color: 'var(--accent-green)', fontWeight: 600 }}>All Services Online</div>
          </div>
        </div>
      </div>

      <UserMenu />
    </aside>
  );
}

const s = {
  aside: {
    width: 220,
    minWidth: 220,
    height: '100vh',
    background: 'var(--bg-surface)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 12px',
    position: 'sticky',
    top: 0,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '4px 8px 20px',
    borderBottom: '1px solid var(--border)',
    marginBottom: 16,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'var(--accent-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoName: {
    fontFamily: 'var(--font-display)',
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--accent-blue)',
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  logoSub: { fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.04em' },
  nav: { display: 'flex', flexDirection: 'column', gap: 2, flex: 1 },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 500,
    transition: 'var(--transition)',
    position: 'relative',
    border: '1px solid transparent',
  },
  linkActive: {
    background: 'var(--accent-blue-muted)',
    color: 'var(--accent-blue)',
    border: '1px solid var(--accent-blue-border)',
  },
  linkIcon: { fontSize: 16, width: 20, textAlign: 'center' },
  badge: {
    marginLeft: 'auto',
    background: 'var(--accent-red)',
    color: 'var(--text-on-accent)',
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 10,
    padding: '1px 6px',
    minWidth: 18,
    textAlign: 'center',
  },
  footerBlock: {
    marginTop: 'auto',
    paddingTop: 16,
    borderTop: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '0 8px',
  },
  footerDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--accent-green)',
    flexShrink: 0,
  },
};
