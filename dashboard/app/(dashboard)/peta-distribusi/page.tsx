'use client';

import { TopBar } from '@/components/layout/TopBar';

export default function PetaDistribusiPage() {
  return (
    <>
      <TopBar
        title="Peta Distribusi"
        subtitle="Lokasi ruang laktasi di Jakarta"
        onDownload={() => console.log('download')}
      />
      <div style={{ padding: '28px', flex: 1, overflow: 'auto' }}>
        <p>Placeholder: Peta Distribusi</p>
      </div>
    </>
  );
}
