import React from 'react';
import { useAuth } from '@workos-inc/authkit-react';
import { AUTH_ENABLED } from './tokenBridge';
import ThemeToggle from '../components/ThemeToggle';

const centered = {
  display: 'flex', flexDirection: 'column', gap: 16,
  alignItems: 'center', justifyContent: 'center',
  minHeight: '100vh',
  background: 'var(--bg-base)',
  fontFamily: 'var(--font-sans)',
  color: 'var(--text-primary)',
  position: 'relative',
};

const button = {
  padding: '12px 24px', borderRadius: 8, cursor: 'pointer',
  background: 'var(--accent-blue)', color: 'var(--text-on-accent)', border: 'none',
  fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
};

function AuthGate({ children }) {
  const { user, isLoading, signIn } = useAuth();

  if (isLoading) {
    return <div style={centered}>Loading…</div>;
  }
  if (!user) {
    return (
      <div style={centered}>
        <div style={{ position: 'absolute', top: 20, right: 20 }}>
          <ThemeToggle compact />
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 8, background: 'var(--accent-blue)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
        }}>
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
            <path d="M2 2h4v4H2zM8 2h4v4H8zM2 8h4v4H2zM8 8l3 3M11 8l-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Mendr Control Plane</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Sign in to continue</div>
        <button style={button} onClick={() => signIn()}>Sign in</button>
      </div>
    );
  }
  return children;
}

/**
 * Gates the app behind an authenticated WorkOS session. When auth is not configured
 * (no client id), it renders children directly — the safe incremental-rollout state.
 */
export default function RequireAuth({ children }) {
  if (!AUTH_ENABLED) {
    return children;
  }
  return <AuthGate>{children}</AuthGate>;
}
