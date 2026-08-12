'use client';

import { useMemo, useState } from 'react';
import { G } from '@/lib/colors';
import { ALL_PROBLEM_REPORTS } from '@/lib/data';
import { downloadCSV } from '@/lib/export';
import { TopBar } from '@/components/layout/TopBar';
import { Panel } from '@/components/ui/Panel';
import { useToast } from '@/components/ui/Toast';
import { ProblemReportRow } from '@/components/dashboard/ProblemReportRow';
import { ReportDetailModal } from '@/components/dashboard/ReportDetailModal';
import type { ProblemReport } from '@/types/dashboard';

type FilterTab = 'all' | 'open' | 'resolved';

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'open', label: 'Belum ditangani' },
  { id: 'resolved', label: 'Selesai' },
];

export default function LaporanFasilitasPage() {
  const [reports, setReports] = useState<ProblemReport[]>(ALL_PROBLEM_REPORTS);
  const [tab, setTab] = useState<FilterTab>('all');
  const [selected, setSelected] = useState<ProblemReport | null>(null);
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    if (tab === 'all') return reports;
    return reports.filter((r) => r.status === tab);
  }, [reports, tab]);

  const handleResolve = () => {
    if (!selected) return;
    setReports((prev) => prev.map((r) => (r.name === selected.name ? { ...r, status: 'resolved' } : r)));
    setSelected(null);
    showToast('Laporan ditandai selesai');
  };

  const handleDownload = () => {
    downloadCSV(
      `momspace-laporan-fasilitas-${new Date().toISOString().slice(0, 10)}.csv`,
      reports.map((r) => ({ lokasi: r.name, masalah: r.issue, waktu: r.time, status: r.status })),
    );
  };

  return (
    <>
      <TopBar
        title="Laporan Fasilitas"
        subtitle={<span>Jakarta · {reports.filter((r) => r.status === 'open').length} laporan belum ditangani</span>}
        onDownload={handleDownload}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Panel title="Semua laporan fasilitas bermasalah" subtitle="Filter berdasarkan status penanganan">
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: '7px 14px', borderRadius: 99, cursor: 'pointer',
                  border: tab === t.id ? 'none' : `1px solid ${G.lineDk}`,
                  background: tab === t.id ? G.roseDk : '#fff',
                  color: tab === t.id ? '#fff' : G.body,
                  fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 12,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.length === 0 ? (
              <div style={{
                padding: 20, textAlign: 'center',
                fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 12.5, color: G.body,
              }}>Tidak ada laporan pada kategori ini.</div>
            ) : (
              filtered.map((report) => (
                <ProblemReportRow key={report.name} report={report} onTindakLanjut={() => setSelected(report)} />
              ))
            )}
          </div>
        </Panel>
      </div>
      <ReportDetailModal report={selected} onClose={() => setSelected(null)} onResolve={handleResolve} />
    </>
  );
}
