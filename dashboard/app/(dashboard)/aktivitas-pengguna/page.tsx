import { G } from '@/lib/colors';
import { TopBar } from '@/components/layout/TopBar';
import { Panel } from '@/components/ui/Panel';
import { IconUsers } from '@/components/icons';

const PLACEHOLDER_METRICS = ['Pengguna aktif harian', 'Sesi rata-rata', 'Tingkat retensi'];

export default function AktivitasPenggunaPage() {
  return (
    <>
      <TopBar title="Aktivitas Pengguna" subtitle={<span>Jakarta · Modul dalam pengembangan</span>} showDateRange={false} />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Panel title="Modul aktivitas pengguna sedang dikembangkan" subtitle="Belum ada sumber data untuk metrik ini pada versi ini">
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            padding: '32px 20px', textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: G.surface2,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B8A89F',
            }}>
              <IconUsers />
            </div>
            <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 14, color: G.ink, maxWidth: 360 }}>
              Data aktivitas pengguna (sesi, retensi, pola penggunaan) belum tersedia di build ini
            </div>
            <div style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 12.5, color: G.body, maxWidth: 360, lineHeight: 1.5 }}>
              Modul ini akan menampilkan data nyata setelah tersambung ke backend analitik. Untuk saat ini kami memilih untuk tidak
              menampilkan data contoh agar tidak menyesatkan.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 8 }}>
            {PLACEHOLDER_METRICS.map((label) => (
              <div key={label} style={{
                border: `1.5px dashed ${G.lineDk}`, borderRadius: 14, padding: 16,
                textAlign: 'center', color: '#B8A89F',
              }}>
                <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 20, marginBottom: 4 }}>—</div>
                <div style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11 }}>{label}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
