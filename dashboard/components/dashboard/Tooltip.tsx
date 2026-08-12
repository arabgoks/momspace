import { G, gapColor } from '@/lib/colors';
import type { Kecamatan } from '@/types/dashboard';

function TipRow({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '3px 0', fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11.5,
    }}>
      <span style={{ color: G.body }}>{label}</span>
      <span className="mono" style={{ fontWeight: 700, color: accent ? G.roseDp : G.ink }}>{value}</span>
    </div>
  );
}

export function Tooltip({ k, pinned }: { k: Kecamatan | undefined; pinned?: boolean }) {
  if (!k) return null;
  return (
    <div style={{
      position: 'absolute', top: 12, left: 12,
      padding: '10px 14px', background: '#fff', borderRadius: 12,
      boxShadow: '0 12px 28px rgba(60,40,30,0.18), 0 1px 3px rgba(60,40,30,0.06)',
      border: `1px solid ${G.line}`,
      minWidth: 180, pointerEvents: 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: 99, background: gapColor(k.gap) }} />
        <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 13, color: G.ink }}>{k.name}</div>
        {pinned && (
          <div style={{
            marginLeft: 'auto', fontSize: 9, fontWeight: 800, color: G.roseDp,
            background: 'rgba(201,122,110,0.12)', padding: '2px 6px', borderRadius: 99,
            letterSpacing: 0.4,
          }}>PRIORITAS</div>
        )}
      </div>
      <TipRow label="Gap Score" value={k.gap} accent />
      <TipRow label="Ruang laktasi" value={k.rooms} />
      <TipRow label="Ibu potensial" value={k.ibu.toLocaleString('id')} />
    </div>
  );
}
