'use client';

import { TopBar } from '@/components/layout/TopBar';

export default function GapScorePage() {
  return (
    <>
      <TopBar
        title="Gap Score"
        subtitle="Analisis kesenjangan fasilitas per kecamatan"
        onDownload={() => console.log('download')}
      />
      <div style={{ padding: '28px', flex: 1, overflow: 'auto' }}>
        <p>Placeholder: Gap Score</p>
      </div>
    </>
  );
}
