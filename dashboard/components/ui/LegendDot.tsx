import { G } from '@/lib/colors';

export function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11, color: G.body,
    }}>
      <div style={{ width: 10, height: 10, borderRadius: 99, background: color }} />
      {label}
    </div>
  );
}
