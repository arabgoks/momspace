import { G } from '@/lib/colors';
import { Panel } from '@/components/ui/Panel';
import { SourcePill } from '@/components/ui/SourcePill';

export function FormulaCard() {
  return (
    <Panel title="Metodologi Gap Score" subtitle="Formula perhitungan & sumber data">
      <div style={{
        padding: 18, borderRadius: 14, background: G.surface2,
        fontFamily: 'var(--font-jetbrains-mono)', fontSize: 13, color: G.ink,
        lineHeight: 1.6, textAlign: 'center', marginBottom: 14,
      }}>
        Gap Score = <span style={{ color: G.roseDp }}>(Demand − Supply)</span>
        <span style={{ color: G.body }}> / </span>
        <span style={{ color: G.sageDk }}>Demand</span>
        <span style={{ color: G.body }}> × 100</span>
      </div>
      <div style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 12, color: G.body, lineHeight: 1.55, marginBottom: 14 }}>
        <b style={{ color: G.ink, fontFamily: 'var(--font-nunito)', fontWeight: 800 }}>Demand Index</b>{' '}
        dihitung dari populasi ibu menyusui per kecamatan (BPS 2023) dan kepadatan ruang publik.{' '}
        <b style={{ color: G.ink, fontFamily: 'var(--font-nunito)', fontWeight: 800 }}>Supply Index</b>{' '}
        merupakan jumlah ruang laktasi aktif tertimbang oleh rating fasilitas dari laporan crowdsourcing MomSpace.
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 12, borderTop: `1px solid ${G.line}` }}>
        <SourcePill label="BPS DKI Jakarta 2023" />
        <SourcePill label="Crowdsourcing MomSpace 2026" />
        <SourcePill label="Dinas Kesehatan DKI" />
      </div>
      <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: G.roseLt, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0, marginTop: 1, color: G.roseDp }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v5M12 16.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11.5, color: G.ink, lineHeight: 1.45 }}>
          <b style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800 }}>Catatan:</b> Gap Score di atas 70 menandakan kebutuhan intervensi
          prioritas oleh Dinas Kesehatan. Data diperbarui setiap awal bulan.
        </div>
      </div>
    </Panel>
  );
}
