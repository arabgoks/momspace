'use client';

import { useState } from 'react';
import { Panel } from '@/components/ui/Panel';
import { useToast } from '@/components/ui/Toast';
import { useReports } from './ReportsContext';
import type { ProblemReport } from '@/types/dashboard';
import { ProblemReportRow } from './ProblemReportRow';
import { ReportDetailModal } from './ReportDetailModal';

export function ProblemReports() {
  const { reports, resolveReport } = useReports();
  const [selected, setSelected] = useState<ProblemReport | null>(null);
  const { showToast } = useToast();

  const handleResolve = () => {
    if (!selected) return;
    resolveReport(selected);
    setSelected(null);
    showToast('Laporan ditandai selesai');
  };

  return (
    <Panel title="Laporan fasilitas bermasalah" subtitle="Butuh tindak lanjut · 3 laporan terbaru · 14 total minggu ini">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reports.slice(0, 3).map((report) => (
          <ProblemReportRow key={report.name} report={report} onTindakLanjut={() => setSelected(report)} />
        ))}
      </div>
      <ReportDetailModal report={selected} onClose={() => setSelected(null)} onResolve={handleResolve} />
    </Panel>
  );
}
