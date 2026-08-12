import { G, gapColor } from '@/lib/colors';
import { KECAMATAN } from '@/lib/data';
import { Panel } from '@/components/ui/Panel';

export function ScatterPlot() {
  const W = 480, H = 320, P = { l: 44, r: 16, t: 18, b: 40 };
  const maxX = 7000, maxY = 12;
  const x = (v: number) => P.l + (v / maxX) * (W - P.l - P.r);
  const y = (v: number) => P.t + (1 - v / maxY) * (H - P.t - P.b);

  return (
    <Panel title="Distribusi: ruang laktasi vs populasi ibu potensial" subtitle="Setiap titik = satu kecamatan · warna mengikuti Gap Score">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {[0, 2000, 4000, 6000].map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={P.t} y2={y(0)} stroke={G.line} strokeDasharray="2 4" />
            <text x={x(v)} y={H - P.b + 16} textAnchor="middle" fontFamily="var(--font-jetbrains-mono)" fontSize="9" fill="#A89991">
              {(v / 1000).toFixed(0)}k
            </text>
          </g>
        ))}
        {[0, 3, 6, 9, 12].map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={G.line} strokeDasharray="2 4" />
            <text x={P.l - 6} y={y(v) + 3} textAnchor="end" fontFamily="var(--font-jetbrains-mono)" fontSize="9" fill="#A89991">{v}</text>
          </g>
        ))}
        <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="var(--font-quicksand)" fontWeight="700" fontSize="10" fill={G.body}>
          Populasi ibu potensial (jiwa)
        </text>
        <text x={12} y={H / 2} textAnchor="middle" transform={`rotate(-90 12 ${H / 2})`} fontFamily="var(--font-quicksand)" fontWeight="700" fontSize="10" fill={G.body}>
          Jumlah ruang laktasi
        </text>

        <path d={`M ${x(0)} ${y(0)} L ${x(6000)} ${y(10)}`} stroke={G.sage} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
        <text x={x(6000) - 4} y={y(10) - 6} textAnchor="end" fontFamily="var(--font-nunito)" fontWeight="800" fontSize="9" fill={G.sageDk}>
          GARIS IDEAL (Supply ≈ Demand)
        </text>

        {KECAMATAN.map((k) => (
          <g key={k.name}>
            <circle cx={x(k.ibu)} cy={y(k.rooms)} r="8" fill={gapColor(k.gap)} fillOpacity="0.85" stroke="#fff" strokeWidth="2" />
            {k.gap >= 71 && (
              <text x={x(k.ibu)} y={y(k.rooms) - 11} textAnchor="middle" fontFamily="var(--font-nunito)" fontWeight="800" fontSize="9" fill={G.roseDp}>
                {k.name}
              </text>
            )}
          </g>
        ))}
      </svg>
    </Panel>
  );
}
