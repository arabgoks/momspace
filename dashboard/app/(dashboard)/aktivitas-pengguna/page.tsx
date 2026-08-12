'use client';

import { TopBar } from '@/components/layout/TopBar';

export default function AktivitasPenggunaPage() {
  return (
    <>
      <TopBar
        title="Aktivitas Pengguna"
        subtitle="Monitor penggunaan aplikasi dan kontribusi pengguna"
        showDateRange={true}
      />
      <div style={{ padding: '28px', flex: 1, overflow: 'auto' }}>
        <p>Placeholder: Aktivitas Pengguna</p>
      </div>
    </>
  );
}
