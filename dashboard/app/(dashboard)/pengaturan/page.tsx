'use client';

import { TopBar } from '@/components/layout/TopBar';

export default function PengaturanPage() {
  return (
    <>
      <TopBar
        title="Pengaturan"
        subtitle="Kelola preferensi dashboard dan konfigurasi sistem"
        showDateRange={false}
      />
      <div style={{ padding: '28px', flex: 1, overflow: 'auto' }}>
        <p>Placeholder: Pengaturan</p>
      </div>
    </>
  );
}
