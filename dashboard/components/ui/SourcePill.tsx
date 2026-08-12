import { G } from '@/lib/colors';

export function SourcePill({ label }: { label: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px', borderRadius: 99,
      background: '#fff', border: `1px solid ${G.line}`,
      fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 10.5, color: G.body,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: G.sage }} />
      {label}
    </div>
  );
}
