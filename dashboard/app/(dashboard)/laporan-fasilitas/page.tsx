'use client';

import { TopBar } from '@/components/layout/TopBar';

export default function LaporanFasilitasPage() {
  return (
    <>
      <TopBar
        title="Laporan Fasilitas"
        subtitle="Kelola laporan dan moderasi dari pengguna"
        onDownload={() => console.log('download')}
      />
      <div style={{ padding: '28px', flex: 1, overflow: 'auto' }}>
        <p>Placeholder: Laporan Fasilitas</p>
      </div>
    </>
  );
}
