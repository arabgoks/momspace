'use client';

import { useState } from 'react';
import { G } from '@/lib/colors';
import { TopBar } from '@/components/layout/TopBar';
import { Panel } from '@/components/ui/Panel';
import { useToast } from '@/components/ui/Toast';

function ToggleRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      padding: '14px 0', borderTop: `1px solid ${G.line}`,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 13, color: disabled ? '#B8A89F' : G.ink }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11.5, color: '#9E948A', marginTop: 2 }}>{description}</div>
      </div>
      <button
        onClick={disabled ? undefined : onChange}
        disabled={disabled}
        style={{
          width: 44, height: 26, borderRadius: 99, border: 0, flexShrink: 0,
          background: disabled ? '#E6DCD4' : (checked ? G.sage : G.lineDk),
          position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background 150ms',
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: checked && !disabled ? 21 : 3,
          width: 20, height: 20, borderRadius: 99, background: '#fff',
          boxShadow: '0 1px 3px rgba(60,40,30,0.24)', transition: 'left 150ms',
        }} />
      </button>
    </div>
  );
}

export default function PengaturanPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { showToast } = useToast();

  return (
    <>
      <TopBar title="Pengaturan" subtitle={<span>Jakarta · Preferensi akun &amp; dashboard</span>} showDateRange={false} />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Panel title="Akun" subtitle="Informasi administrator yang sedang masuk">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: `linear-gradient(140deg, ${G.sage}, ${G.sageDk})`,
              color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>DK</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 14, color: G.ink }}>Dr. Sari Wibowo</div>
              <div style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 12, color: G.body }}>Dinas Kesehatan DKI Jakarta · Admin</div>
              <div className="mono" style={{ fontSize: 10.5, color: '#B8A89F', marginTop: 2 }}>admin@dinkes.jakarta.go.id</div>
            </div>
          </div>
        </Panel>

        <Panel title="Preferensi" subtitle="Pengaturan lokal untuk tampilan dan notifikasi dashboard ini">
          <ToggleRow
            label="Notifikasi email"
            description="Kirim ringkasan laporan baru ke email terdaftar"
            checked={emailNotif}
            onChange={() => setEmailNotif((v) => !v)}
          />
          <ToggleRow
            label="Laporan PDF mingguan"
            description="Kirim ringkasan Gap Score mingguan setiap Senin pagi"
            checked={weeklyReport}
            onChange={() => setWeeklyReport((v) => !v)}
          />
          <ToggleRow
            label="Refresh otomatis"
            description="Perbarui data peta dan tabel setiap 5 menit"
            checked={autoRefresh}
            onChange={() => setAutoRefresh((v) => !v)}
          />
          <ToggleRow label="Mode gelap" description="Segera hadir" checked={false} disabled onChange={() => {}} />
        </Panel>

        <div>
          <button
            onClick={() => showToast('Perubahan preferensi disimpan')}
            style={{
              background: `linear-gradient(140deg, ${G.rose}, ${G.roseDk})`,
              color: '#fff', border: 0, borderRadius: 12, padding: '10px 20px',
              fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 13, cursor: 'pointer',
              boxShadow: '0 8px 18px rgba(232,165,152,0.4)',
            }}
          >
            Simpan perubahan
          </button>
        </div>
      </div>
    </>
  );
}
