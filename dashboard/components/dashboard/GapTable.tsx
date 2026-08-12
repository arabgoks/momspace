'use client';

import { useState } from 'react';
import { G, gapColor } from '@/lib/colors';
import { TOP5, KECAMATAN } from '@/lib/data';
import { Panel } from '@/components/ui/Panel';
import type { Kecamatan } from '@/types/dashboard';
import type { ReactNode } from 'react';

function Th({ children, right }: { children: ReactNode; right?: boolean }) {
  return (
    <th style={{
      fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 10, color: '#9E948A',
      textTransform: 'uppercase', letterSpacing: 1.2,
      padding: '8px 0 10px', textAlign: right ? 'right' : 'left',
    }}>{children}</th>
  );
}

function Td({ children, right }: { children: ReactNode; right?: boolean }) {
  return <td style={{ padding: '11px 0', textAlign: right ? 'right' : 'left' }}>{children}</td>;
}

export function GapTable() {
  const [expanded, setExpanded] = useState(false);
  const rows: Kecamatan[] = expanded ? [...KECAMATAN].sort((a, b) => b.gap - a.gap) : TOP5;

  return (
    <Panel
      title="Kecamatan prioritas intervensi"
      subtitle={expanded ? 'Seluruh 14 kecamatan, diurutkan berdasarkan Gap Score' : 'Top 5 kecamatan dengan Gap Score tertinggi'}
      action={
        <span style={{
          fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 11,
          color: G.roseDk, background: G.roseLt,
          padding: '4px 10px', borderRadius: 99, whiteSpace: 'nowrap',
        }}>{expanded ? '14 / 14' : '5 / 14'}</span>
      }
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-quicksand)' }}>
        <thead>
          <tr style={{ textAlign: 'left' }}>
            <Th>#</Th><Th>Kecamatan</Th><Th right>Gap</Th><Th right>Ruang</Th><Th right>Ibu</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((k, i) => (
            <tr key={k.name} style={{ borderTop: `1px solid ${G.line}` }}>
              <Td>
                <span className="mono" style={{ fontSize: 11, color: i === 0 ? G.roseDp : G.body, fontWeight: 700 }}>{i + 1}</span>
              </Td>
              <Td>
                <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 12.5, color: G.ink }}>{k.name}</div>
              </Td>
              <Td right>
                <span style={{
                  display: 'inline-block', padding: '3px 9px', borderRadius: 99,
                  background: gapColor(k.gap),
                  color: k.gap >= 65 ? '#fff' : G.ink,
                  fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 11,
                  fontVariantNumeric: 'tabular-nums',
                }}>{k.gap}</span>
              </Td>
              <Td right>
                <span className="mono" style={{ fontSize: 11, color: G.ink, fontWeight: 700 }}>{k.rooms}</span>
              </Td>
              <Td right>
                <span className="mono" style={{ fontSize: 11, color: G.ink, fontWeight: 700 }}>{k.ibu.toLocaleString('id')}</span>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{
        marginTop: 14, paddingTop: 12, borderTop: `1px solid ${G.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11, color: G.body }}>
          {expanded ? 'Seluruh kecamatan ditampilkan' : '9 kecamatan lain dengan Gap ≥ 50'}
        </span>
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
            fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 11.5, color: G.roseDk,
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          {expanded ? 'Sembunyikan' : 'Lihat semua kecamatan'}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ transform: expanded ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 150ms' }}>
            <path d="M9 6l6 6-6 6" stroke={G.roseDk} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </Panel>
  );
}
