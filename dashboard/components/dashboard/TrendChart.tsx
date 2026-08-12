import { G } from '@/lib/colors';
import { TREND } from '@/lib/data';
import { Panel } from '@/components/ui/Panel';
import { LegendDot } from '@/components/ui/LegendDot';

export function TrendChart() {
  const W = 480, H = 200, P = { l: 36, r: 16, t: 16, b: 30 };
  const maxY = 1100;
  const x = (i: number) => P.l + (i / (TREND.length - 1)) * (W - P.l - P.r);
  const y = (v: number) => P.t + (1 - v / maxY) * (H - P.t - P.b);
  const path = (k: 'pos' | 'neg') => TREND.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d[k])}`).join(' ');
  const area = (k: 'pos' | 'neg') => `${path(k)} L ${x(TREND.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;

  return (
    <Panel title="Tren laporan kondisi" subtitle="6 bulan terakhir · positif vs negatif">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {[0, 250, 500, 750, 1000].map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={G.line} strokeDasharray="2 4" />
            <text x={P.l - 6} y={y(v) + 3} textAnchor="end" fontFamily="var(--font-jetbrains-mono)" fontSize="9" fill="#A89991">{v}</text>
          </g>
        ))}
        {TREND.map((d, i) => (
          <text key={d.m} x={x(i)} y={H - 10} textAnchor="middle" fontFamily="var(--font-nunito)" fontWeight="700" fontSize="10" fill={G.body}>{d.m}</text>
        ))}
        <path d={area('pos')} fill={G.sageLt} />
        <path d={area('neg')} fill="rgba(232,153,138,0.16)" />
        <path d={path('pos')} fill="none" stroke={G.sage} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={path('neg')} fill="none" stroke={G.roseDk} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {TREND.map((d, i) => (
          <g key={d.m}>
            <circle cx={x(i)} cy={y(d.pos)} r="3.5" fill="#fff" stroke={G.sage} strokeWidth="2" />
            <circle cx={x(i)} cy={y(d.neg)} r="3.5" fill="#fff" stroke={G.roseDk} strokeWidth="2" />
          </g>
        ))}
        <text x={x(5) + 8} y={y(1020)} fontFamily="var(--font-nunito)" fontWeight="800" fontSize="11" fill={G.sageDk}>1.020</text>
        <text x={x(5) + 8} y={y(227)} fontFamily="var(--font-nunito)" fontWeight="800" fontSize="11" fill={G.roseDp}>227</text>
      </svg>
      <div style={{ display: 'flex', gap: 16, marginTop: 6, paddingLeft: 36 }}>
        <LegendDot color={G.sage} label="Laporan positif" />
        <LegendDot color={G.roseDk} label="Laporan negatif" />
      </div>
    </Panel>
  );
}
