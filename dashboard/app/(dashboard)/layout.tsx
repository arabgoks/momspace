import type { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ReportsProvider } from '@/components/dashboard/ReportsContext';
import { G } from '@/lib/colors';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ReportsProvider>
      <div style={{
        display: 'flex', height: '100vh', background: G.surface2,
        fontFamily: 'var(--font-quicksand)', color: G.ink,
      }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {children}
        </div>
      </div>
    </ReportsProvider>
  );
}
