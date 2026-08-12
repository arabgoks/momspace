'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { G } from '@/lib/colors';
import { IconMap, IconChart, IconClipboard, IconUsers, IconGear } from '@/components/icons';

const NAV_ITEMS = [
  { id: 'map', href: '/peta-distribusi', label: 'Peta Distribusi', icon: <IconMap /> },
  { id: 'gap', href: '/gap-score', label: 'Gap Score', icon: <IconChart /> },
  { id: 'reports', href: '/laporan-fasilitas', label: 'Laporan Fasilitas', icon: <IconClipboard /> },
  { id: 'users', href: '/aktivitas-pengguna', label: 'Aktivitas Pengguna', icon: <IconUsers /> },
  { id: 'settings', href: '/pengaturan', label: 'Pengaturan', icon: <IconGear /> },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div style={{
      width: 232, background: G.surface,
      borderRight: `1px solid ${G.line}`, display: 'flex', flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div style={{ padding: '24px 22px 20px', borderBottom: `1px solid ${G.line}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: `linear-gradient(140deg, ${G.rose}, ${G.roseDk})`,
            color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 14px rgba(232,165,152,0.4)',
          }}>M</div>
          <div>
            <div style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 14, color: G.ink,
              letterSpacing: -0.2,
            }}>MomSpace</div>
            <div style={{
              fontSize: 10.5, color: G.body, fontWeight: 600,
              fontFamily: 'var(--font-quicksand)', letterSpacing: 0.2,
            }}>Dashboard Pemerintah</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div className="mono" style={{
          fontSize: 9.5, color: '#A89991', textTransform: 'uppercase',
          letterSpacing: 1.2, padding: '6px 12px 8px',
        }}>Navigasi</div>
        {NAV_ITEMS.map((it) => {
          const on = pathname.startsWith(it.href);
          return (
            <Link key={it.id} href={it.href} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 12,
              background: on ? G.roseLt : 'transparent',
              color: on ? G.roseDk : G.body,
              cursor: 'pointer',
              fontFamily: 'var(--font-quicksand)', fontWeight: on ? 700 : 600, fontSize: 13,
              position: 'relative',
            }}>
              {on && (
                <div style={{
                  position: 'absolute', left: -12, top: 8, bottom: 8, width: 3,
                  borderRadius: 99, background: G.roseDk,
                }} />
              )}
              <span style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {it.icon}
              </span>
              {it.label}
            </Link>
          );
        })}
      </div>

      <div style={{ padding: 12, borderTop: `1px solid ${G.line}` }}>
        <div style={{
          padding: 12, borderRadius: 14, background: G.surface2,
          display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(140deg, ${G.sage}, ${G.sageDk})`,
            color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>DK</div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 11.5, color: G.ink,
              lineHeight: 1.2,
            }}>Dinas Kesehatan</div>
            <div style={{ fontSize: 10, color: G.body, marginTop: 1, fontWeight: 600 }}>
              DKI Jakarta · Admin
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 10, padding: '0 4px', fontSize: 10.5, color: '#A89991',
          fontFamily: 'var(--font-quicksand)', fontWeight: 600,
        }}>
          Dr. Sari Wibowo
          <div className="mono" style={{ fontSize: 9.5, color: '#B8A89F', marginTop: 2 }}>
            admin@dinkes.jakarta.go.id
          </div>
        </div>
      </div>
    </div>
  );
}
