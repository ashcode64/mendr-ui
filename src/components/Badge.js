import React from 'react';

const COLORS = {
  OPEN:             { bg: 'var(--accent-yellow-muted)', color: 'var(--accent-yellow)', dot: true, pulse: true },
  ANALYZING:        { bg: 'var(--accent-blue-muted)',   color: 'var(--accent-blue)',   dot: true, pulse: true },
  RESOLVED:         { bg: 'var(--accent-green-muted)',  color: 'var(--accent-green)',  dot: true },
  IGNORED:          { bg: 'var(--accent-muted-gray)',   color: 'var(--text-secondary)', dot: true },
  PENDING_APPROVAL: { bg: 'var(--accent-yellow-muted)', color: 'var(--accent-yellow)', dot: true, pulse: true },
  APPROVED:         { bg: 'var(--accent-green-muted)',  color: 'var(--accent-green)',  dot: true },
  REJECTED:         { bg: 'var(--accent-red-muted)',    color: 'var(--accent-red)',    dot: true },
  HIGH:             { bg: 'var(--accent-red-muted)',    color: 'var(--accent-red)' },
  MEDIUM:           { bg: 'var(--accent-yellow-muted)', color: 'var(--accent-yellow)' },
  LOW:              { bg: 'var(--accent-green-muted)',  color: 'var(--accent-green)' },
  ACTIVE:           { bg: 'var(--accent-blue-muted)',   color: 'var(--accent-blue)',   dot: true },
  SCHEMA_MISMATCH:  { bg: 'var(--accent-orange-muted)', color: 'var(--accent-orange)' },
  FIELD_RENAME:     { bg: 'var(--accent-purple-muted)', color: 'var(--accent-purple)' },
  TYPE_COERCE:      { bg: 'var(--accent-cyan-muted)',   color: 'var(--accent-cyan)' },
  ADD_DEFAULT:      { bg: 'var(--accent-green-muted)',  color: 'var(--accent-green)' },
  REMOVE_FIELD:     { bg: 'var(--accent-red-muted)',    color: 'var(--accent-red)' },
};

export default function Badge({ status }) {
  if (!status) return null;
  const key = status.toUpperCase().replace(/ /g, '_');
  const cfg = COLORS[key] || { bg: 'var(--accent-blue-muted)', color: 'var(--text-secondary)' };
  const label = status.replace(/_/g, ' ');

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '9999px',
      fontSize: '11px', fontWeight: 600,
      letterSpacing: '0.05em', textTransform: 'uppercase',
      background: cfg.bg, color: cfg.color,
      whiteSpace: 'nowrap',
    }}>
      {cfg.dot && (
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: cfg.color, flexShrink: 0,
          ...(cfg.pulse ? { animation: 'pulse-glow 1.5s infinite' } : {}),
        }} />
      )}
      {label}
    </span>
  );
}
