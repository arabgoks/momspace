'use client';

import { SummaryRow } from '@/components/dashboard/SummaryRow';
import { BarChartTop10 } from '@/components/dashboard/BarChartTop10';
import { ScatterPlot } from '@/components/dashboard/ScatterPlot';
import { FormulaCard } from '@/components/dashboard/FormulaCard';
import { TopBar } from '@/components/layout/TopBar';
import { G } from '@/lib/colors';
import { TOP10_BAR } from '@/lib/data';
import { downloadCSV } from '@/lib/export';

export default function GapScorePage() {
  const handleDownload = () => {
    downloadCSV(
      `momspace-gap-score-${new Date().toISOString().slice(0, 10)}.csv`,
      TOP10_BAR.map((k) => ({ kecamatan: k.name, gap_score: k.gap, ruang_laktasi: k.rooms, ibu_potensial: k.ibu })),
    );
  };

  return (
    <>
      <TopBar
        title="Analisis Gap Score"
        subtitle={
          <>
            <span>Jakarta · Diperbarui 17 Mei 2026</span>
            <span style={{
              padding: '3px 8px', borderRadius: 99, background: G.roseLt,
              color: G.roseDk, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3,
            }}>METODOLOGI v2.1</span>
          </>
        }
        onDownload={handleDownload}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SummaryRow />
        <BarChartTop10 />
        <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 16 }}>
          <ScatterPlot />
          <FormulaCard />
        </div>
      </div>
    </>
  );
}
