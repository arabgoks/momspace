import { G } from '@/lib/colors';

export function LegendBadge({ color, label, sw = 14 }: { color: string; label: string; sw?: number }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11, color: G.body,
    }}>
      <div style={{ width: 18, height: sw, background: color, borderRadius: 4 }} />
      {label}
    </div>
  );
}
