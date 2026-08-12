'use client';

import { useState } from 'react';
import { G } from '@/lib/colors';

const PRESETS = [
  '1–17 Mei 2026',
  '1–30 April 2026',
  '1 Jan–17 Mei 2026 (YTD)',
  '3 bulan terakhir',
];

export function DateRangePicker() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(PRESETS[0]);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: G.surface, border: `1px solid ${G.lineDk}`,
          borderRadius: 12, padding: '9px 14px',
          fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 12.5, color: G.ink,
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="16" rx="2" stroke={G.ink} strokeWidth="1.8" />
          <path d="M3 9h18M8 3v4M16 3v4" stroke={G.ink} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        {selected}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke={G.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: '110%', right: 0, zIndex: 50,
            background: '#fff', borderRadius: 12, border: `1px solid ${G.line}`,
            boxShadow: '0 16px 32px rgba(60,40,30,0.18)', minWidth: 220, overflow: 'hidden',
          }}>
            {PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setSelected(preset);
                  setOpen(false);
                }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 14px', border: 0,
                  background: preset === selected ? G.roseLt : 'transparent',
                  color: preset === selected ? G.roseDk : G.ink,
                  fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 12.5,
                  cursor: 'pointer',
                }}
              >
                {preset}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
