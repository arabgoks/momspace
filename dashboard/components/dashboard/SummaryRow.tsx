import type { ReactNode } from 'react';
import { G } from '@/lib/colors';
import { IconHouse, IconStar, IconAlert, IconReport } from '@/components/icons';

function SummaryCard({
  icon,
  value,
  label,
  trend,
  trendTone = 'up',
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  trend: string;
  trendTone?: 'up' | 'down';
}) {
  const trendUp = trendTone === 'up';
  return (
    <div style={{
      background: G.surface, borderRadius: 16, padding: 20,
      border: `1px solid ${G.line}`,
      display: 'flex', flexDirection: 'column', gap: 8,
      minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, background: G.roseLt,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: G.roseDk,
        }}>{icon}</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 8px', borderRadius: 99,
          background: trendUp ? G.sageLt : 'rgba(201,122,110,0.12)',
          color: trendUp ? G.sageDk : G.roseDp,
          fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 11,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d={trendUp ? 'M6 14l6-6 6 6' : 'M6 10l6 6 6-6'} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {trend}
        </div>
      </div>
      <div style={{
        fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 28, color: G.ink,
        letterSpacing: -0.6, lineHeight: 1.1, marginTop: 4,
      }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 12, color: G.body, lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}

export function SummaryRow() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <SummaryCard icon={<IconHouse />} value="284" label="Total ruang laktasi terdaftar" trend="+12 bulan ini" trendTone="up" />
      <SummaryCard
        icon={<IconStar />}
        value={<>4.3<span style={{ fontSize: 16, color: G.body, fontWeight: 700 }}> / 5</span></>}
        label="Rata-rata rating fasilitas"
        trend="+0.2" trendTone="up"
      />
      <SummaryCard icon={<IconAlert />} value="12" label="Kecamatan underserved (Gap >70)" trend="−3 vs. April" trendTone="up" />
      <SummaryCard icon={<IconReport />} value="1.247" label="Laporan masuk bulan ini" trend="+18%" trendTone="up" />
    </div>
  );
}
