'use client';

import { G } from '@/lib/colors';
import { Modal } from '@/components/ui/Modal';
import type { ProblemReport } from '@/types/dashboard';

export function ReportDetailModal({
  report,
  onClose,
  onResolve,
}: {
  report: ProblemReport | null;
  onClose: () => void;
  onResolve: () => void;
}) {
  return (
    <Modal open={report !== null} onClose={onClose}>
      {report && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `linear-gradient(140deg, ${G.rose}, ${G.roseDk})`,
              color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>{report.initial}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 15, color: G.ink }}>{report.name}</div>
              <div style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11, color: '#9E948A' }}>{report.time}</div>
            </div>
          </div>
          <span style={{
            display: 'inline-block', marginBottom: 12,
            fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 11,
            color: G.roseDp, background: 'rgba(201,122,110,0.12)', padding: '4px 10px', borderRadius: 99,
          }}>{report.issue}</span>
          <p style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 13, color: G.body, lineHeight: 1.6, marginBottom: 20 }}>
            {report.detail}
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{
              flex: 1, background: '#fff', border: `1.5px solid ${G.lineDk}`, borderRadius: 12,
              padding: '10px 0', fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 13, color: G.body, cursor: 'pointer',
            }}>Tutup</button>
            {report.status === 'open' ? (
              <button onClick={onResolve} style={{
                flex: 1, background: G.sage, border: 0, borderRadius: 12,
                padding: '10px 0', fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 13, color: '#fff', cursor: 'pointer',
              }}>Tandai selesai</button>
            ) : (
              <div style={{
                flex: 1, textAlign: 'center', background: G.sageLt, borderRadius: 12,
                padding: '10px 0', fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 13, color: G.sageDk,
              }}>Selesai ✓</div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
