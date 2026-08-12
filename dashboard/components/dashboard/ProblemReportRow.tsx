import { G } from '@/lib/colors';
import type { ProblemReport } from '@/types/dashboard';

export function ProblemReportRow({ report, onTindakLanjut }: { report: ProblemReport; onTindakLanjut: () => void }) {
  const resolved = report.status === 'resolved';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: 12, borderRadius: 12,
      background: G.surface2, border: `1px solid ${G.line}`,
      opacity: resolved ? 0.55 : 1,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        background: `linear-gradient(140deg, ${G.rose}, ${G.roseDk})`,
        color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 15,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{report.initial}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 13, color: G.ink,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          textDecoration: resolved ? 'line-through' : 'none',
        }}>{report.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span style={{
            fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 10.5,
            color: G.roseDp, background: 'rgba(201,122,110,0.12)',
            padding: '2px 8px', borderRadius: 99,
          }}>{report.issue}</span>
          <span style={{ fontSize: 10.5, color: '#9E948A', fontWeight: 600, fontFamily: 'var(--font-quicksand)' }}>· {report.time}</span>
        </div>
      </div>
      {resolved ? (
        <span style={{
          background: G.sageLt, color: G.sageDk, borderRadius: 99, padding: '7px 14px',
          fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 11.5, flexShrink: 0,
        }}>Selesai ✓</span>
      ) : (
        <button onClick={onTindakLanjut} style={{
          background: '#fff', border: `1.5px solid ${G.rose}`,
          color: G.roseDk, borderRadius: 99, padding: '7px 14px',
          fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 11.5,
          cursor: 'pointer', flexShrink: 0,
        }}>Tindak lanjut</button>
      )}
    </div>
  );
}
