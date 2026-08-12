'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { ALL_PROBLEM_REPORTS } from '@/lib/data';
import type { ProblemReport } from '@/types/dashboard';

interface ReportsContextValue {
  reports: ProblemReport[];
  resolveReport: (report: ProblemReport) => void;
}

const ReportsContext = createContext<ReportsContextValue | null>(null);

export function useReports(): ReportsContextValue {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useReports must be used within a ReportsProvider');
  return ctx;
}

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<ProblemReport[]>(ALL_PROBLEM_REPORTS);

  const resolveReport = useCallback((report: ProblemReport) => {
    setReports((prev) => prev.map((r) => (r.name === report.name ? { ...r, status: 'resolved' } : r)));
  }, []);

  return (
    <ReportsContext.Provider value={{ reports, resolveReport }}>
      {children}
    </ReportsContext.Provider>
  );
}
