'use client';

import { useState } from 'react';
import { G, gapColor } from '@/lib/colors';
import { KECAMATAN } from '@/lib/data';
import { avgX, avgY } from '@/lib/svg-utils';
import { Panel } from '@/components/ui/Panel';
import { LegendBadge } from '@/components/ui/LegendBadge';
import { FlagMarker } from './FlagMarker';
import { Tooltip } from './Tooltip';

export function ChoroplethMap() {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <Panel title="Peta sebaran ruang laktasi · Jakarta" subtitle="Warna menunjukkan Gap Score per kecamatan (semakin gelap, semakin kurang terlayani)">
      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <svg viewBox="0 0 640 460" style={{ width: '100%', height: 'auto', display: 'block' }}>
            <rect x="0" y="0" width="640" height="60" fill="rgba(91,141,239,0.06)" />
            <text x="540" y="36" fontFamily="var(--font-nunito)" fontWeight="700" fontSize="10" fill="#9EAEC4">TELUK JAKARTA</text>

            {KECAMATAN.map((k) => {
              const isHover = hover === k.name;
              const isGambir = k.name === 'Gambir';
              return (
                <g
                  key={k.name}
                  onMouseEnter={() => setHover(k.name)}
                  onMouseLeave={() => setHover(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <polygon
                    points={k.points}
                    fill={gapColor(k.gap)}
                    stroke={isHover || isGambir ? G.sageDk : G.sage}
                    strokeWidth={isHover || isGambir ? 2.5 : 1.5}
                    style={{ transition: 'all 150ms' }}
                  />
                </g>
              );
            })}

            {KECAMATAN.map((k) => {
              const cx = avgX(k.points);
              const cy = avgY(k.points);
              return (
                <text
                  key={`l-${k.name}`}
                  x={cx} y={cy}
                  textAnchor="middle"
                  fontFamily="var(--font-nunito)" fontWeight="700" fontSize="9.5"
                  fill={k.gap >= 65 ? '#fff' : G.ink}
                  opacity="0.95"
                  style={{ pointerEvents: 'none' }}
                >{k.name}</text>
              );
            })}

            <FlagMarker x={385} y={195} />
          </svg>

          {hover && <Tooltip k={KECAMATAN.find((x) => x.name === hover)} />}
          {!hover && <Tooltip k={KECAMATAN.find((x) => x.name === 'Gambir')} pinned />}
        </div>

        <div style={{ width: 150, flexShrink: 0 }}>
          <div className="mono" style={{ fontSize: 10, color: '#A89991', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>
            Legenda · Gap Score
          </div>
          <div style={{
            height: 12, borderRadius: 6, marginBottom: 6,
            background: `linear-gradient(90deg, ${G.roseLt} 0%, ${G.rose05} 20%, ${G.rose03} 40%, ${G.rose} 60%, ${G.roseDk} 80%, ${G.roseDp} 100%)`,
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 10, color: G.body }}>
            <span>0 — Terlayani</span>
            <span>100 — Krisis</span>
          </div>

          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <LegendBadge color={G.sage} label="Batas kecamatan" sw={3} />
            <LegendBadge color={G.sageDk} label="Highlight intervensi" sw={3} />
          </div>

          <div style={{
            marginTop: 22, padding: 12, borderRadius: 12, background: G.surface2,
            fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11, color: G.body,
            lineHeight: 1.5,
          }}>
            <b style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: G.ink }}>Hover kecamatan</b><br />
            untuk melihat detail Gap Score, jumlah ruang laktasi, dan populasi ibu potensial.
          </div>
        </div>
      </div>
    </Panel>
  );
}
