'use client';

import type { ReactNode } from 'react';
import { G } from '@/lib/colors';
import { DateRangePicker } from './DateRangePicker';

export function TopBar({
  title,
  subtitle,
  onDownload,
  showDateRange = true,
}: {
  title: string;
  subtitle: ReactNode;
  /** Omit on pages with nothing report-shaped to export (Pengaturan, Aktivitas Pengguna) — the download button only renders when this is provided. */
  onDownload?: () => void;
  showDateRange?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '22px 28px', borderBottom: `1px solid ${G.line}`,
      background: G.surface,
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 22, color: G.ink,
          letterSpacing: -0.3,
        }}>{title}</div>
        <div style={{
          fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 12.5, color: G.body,
          marginTop: 3, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {subtitle}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {showDateRange && <DateRangePicker />}
        {onDownload && (
          <button onClick={onDownload} style={{
            background: `linear-gradient(140deg, ${G.rose}, ${G.roseDk})`,
            color: '#fff', border: 0, borderRadius: 12, padding: '10px 16px',
            fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 12.5,
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            boxShadow: '0 8px 18px rgba(232,165,152,0.4)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v12M6 11l6 6 6-6M4 21h16" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Unduh Laporan
          </button>
        )}
      </div>
    </div>
  );
}
