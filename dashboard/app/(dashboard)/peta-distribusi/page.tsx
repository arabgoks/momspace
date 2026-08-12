'use client';

import { SummaryRow } from '@/components/dashboard/SummaryRow';
import { ChoroplethMap } from '@/components/dashboard/ChoroplethMap';
import { GapTable } from '@/components/dashboard/GapTable';
import { ProblemReports } from '@/components/dashboard/ProblemReports';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { TopBar } from '@/components/layout/TopBar';
import { G } from '@/lib/colors';
import { KECAMATAN } from '@/lib/data';
import { downloadCSV } from '@/lib/export';

export default function PetaDistribusiPage() {
  const handleDownload = () => {
    downloadCSV(
      `momspace-peta-distribusi-${new Date().toISOString().slice(0, 10)}.csv`,
      KECAMATAN.map((k) => ({ kecamatan: k.name, gap_score: k.gap, ruang_laktasi: k.rooms, ibu_potensial: k.ibu })),
    );
  };

  return (
    <>
      <TopBar
        title="Peta Distribusi Ruang Laktasi"
        subtitle={
          <>
            <span>Jakarta · Diperbarui 17 Mei 2026</span>
            <span style={{
              padding: '3px 8px', borderRadius: 99, background: G.sageLt,
              color: G.sageDk, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3,
            }}>LIVE</span>
          </>
        }
        onDownload={handleDownload}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SummaryRow />
        <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 16 }}>
          <ChoroplethMap />
          <GapTable />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ProblemReports />
          <TrendChart />
        </div>
      </div>
    </>
  );
}
