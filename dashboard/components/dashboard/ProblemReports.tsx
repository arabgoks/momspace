'use client';

import { useState } from 'react';
import { PROBLEM_REPORTS } from '@/lib/data';
import { Panel } from '@/components/ui/Panel';
import { useToast } from '@/components/ui/Toast';
import type { ProblemReport } from '@/types/dashboard';
import { ProblemReportRow } from './ProblemReportRow';
import { ReportDetailModal } from './ReportDetailModal';

export function ProblemReports() {
  const [reports, setReports] = useState<ProblemReport[]>(PROBLEM_REPORTS);
  const [selected, setSelected] = useState<ProblemReport | null>(null);
  const { showToast } = useToast();

  const handleResolve = () => {
    if (!selected) return;
    setReports((prev) => prev.map((r) => (r.name === selected.name ? { ...r, status: 'resolved' } : r)));
    setSelected(null);
    showToast('Laporan ditandai selesai');
  };

  return (
    <Panel title="Laporan fasilitas bermasalah" subtitle="Butuh tindak lanjut · 14 laporan aktif minggu ini">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reports.map((report) => (
          <ProblemReportRow key={report.name} report={report} onTindakLanjut={() => setSelected(report)} />
        ))}
      </div>
      <ReportDetailModal report={selected} onClose={() => setSelected(null)} onResolve={handleResolve} />
    </Panel>
  );
}
