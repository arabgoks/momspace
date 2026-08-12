import { G, gapColor } from '@/lib/colors';
import { TOP10_BAR } from '@/lib/data';
import { Panel } from '@/components/ui/Panel';

export function BarChartTop10() {
  const W = 640, H = 320, P = { l: 36, r: 24, t: 18, b: 70 };
  const max = 100;
  const bw = (W - P.l - P.r) / TOP10_BAR.length - 8;
  const x = (i: number) => P.l + i * ((W - P.l - P.r) / TOP10_BAR.length);
  const y = (v: number) => P.t + (1 - v / max) * (H - P.t - P.b);

  return (
    <Panel title="Top 10 kecamatan berdasarkan Gap Score" subtitle="Bilah lebih panjang & gelap = prioritas intervensi tertinggi">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={G.line} strokeDasharray="2 4" />
            <text x={P.l - 6} y={y(v) + 3} textAnchor="end" fontFamily="var(--font-jetbrains-mono)" fontSize="9" fill="#A89991">{v}</text>
          </g>
        ))}
        <line x1={P.l} x2={W - P.r} y1={y(70)} y2={y(70)} stroke={G.roseDp} strokeWidth="1" strokeDasharray="4 3" />
        <text x={W - P.r - 4} y={y(70) - 4} textAnchor="end" fontFamily="var(--font-nunito)" fontWeight="800" fontSize="9.5" fill={G.roseDp}>
          AMBANG INTERVENSI · 70
        </text>
        {TOP10_BAR.map((k, i) => {
          const bx = x(i) + 4;
          const by = y(k.gap);
          const bh = y(0) - by;
          return (
            <g key={k.name}>
              <rect x={bx} y={by} width={bw} height={bh} rx="4" fill={gapColor(k.gap)} />
              <text x={bx + bw / 2} y={by - 6} textAnchor="middle" fontFamily="var(--font-nunito)" fontWeight="800" fontSize="10" fill={G.ink}>
                {k.gap}
              </text>
              <text
                x={bx + bw / 2} y={H - P.b + 14} textAnchor="end"
                fontFamily="var(--font-quicksand)" fontWeight="700" fontSize="10" fill={G.body}
                transform={`rotate(-32 ${bx + bw / 2} ${H - P.b + 14})`}
              >
                {k.name}
              </text>
            </g>
          );
        })}
        <line x1={P.l} x2={W - P.r} y1={y(0)} y2={y(0)} stroke={G.lineDk} />
      </svg>
    </Panel>
  );
}
