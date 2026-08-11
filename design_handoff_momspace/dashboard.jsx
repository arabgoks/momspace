// MomSpace · Government Dashboard (Dinas Kesehatan DKI Jakarta)
// Shared chrome + Peta Distribusi page + Gap Score Analytics page.

// ─────────────────────────────────────────────────────────────
// Tokens & data
// ─────────────────────────────────────────────────────────────
const G = {
  rose:    '#E8A598',
  roseDk:  '#D88B7C',
  roseLt:  '#FBEEEA',
  roseDp:  '#C97A6E',
  rose03:  '#F2C6B8',
  rose05:  '#F8DED4',
  sage:    '#8FAF8F',
  sageLt:  'rgba(143,175,143,0.18)',
  sageDk:  '#6B8A6B',
  muted:   '#AAB995',
  surface: '#FEFEFE',
  surface2:'#FBF6F1',
  ink:     '#333727',
  body:    '#5C5347',
  line:    'rgba(60,40,30,0.08)',
  lineDk:  'rgba(60,40,30,0.12)',
  alert:   '#E8998A',
};

// gap-score color ramp (0 → 100)
function gapColor(score) {
  if (score >= 80) return G.roseDp;
  if (score >= 65) return G.roseDk;
  if (score >= 50) return G.rose;
  if (score >= 35) return G.rose03;
  if (score >= 20) return G.rose05;
  return G.roseLt;
}

// 14 simplified Jakarta kecamatan regions for the choropleth.
// Coords are abstract — Jakarta-ish silhouette, not geographic truth.
const KECAMATAN = [
  // ── North ──
  { name: 'Penjaringan',   gap: 81, rooms: 3,  ibu: 5100, points: '60,40 200,40 260,90 200,140 80,140 50,90' },
  { name: 'Tanjung Priok', gap: 56, rooms: 5,  ibu: 4900, points: '260,90 380,60 460,100 440,160 320,170 200,140' },
  { name: 'Cilincing',     gap: 42, rooms: 4,  ibu: 3600, points: '380,60 540,70 580,140 460,160 460,100' },
  // ── Central / West ──
  { name: 'Tambora',       gap: 68, rooms: 3,  ibu: 5800, points: '50,140 200,140 220,220 80,240' },
  { name: 'Taman Sari',    gap: 76, rooms: 2,  ibu: 3800, points: '200,140 320,170 320,240 220,220' },
  { name: 'Gambir',        gap: 87, rooms: 2,  ibu: 4200, points: '320,170 440,160 440,240 320,240' },
  { name: 'Sawah Besar',   gap: 71, rooms: 4,  ibu: 4600, points: '440,160 580,140 600,220 440,240' },
  // ── South-center / South ──
  { name: 'Grogol',        gap: 48, rooms: 5,  ibu: 4100, points: '80,240 220,220 240,320 110,340' },
  { name: 'Menteng',       gap: 32, rooms: 8,  ibu: 3400, points: '220,220 320,240 320,320 240,320' },
  { name: 'Setiabudi',     gap: 24, rooms: 9,  ibu: 3200, points: '320,240 440,240 440,320 320,320' },
  { name: 'Tebet',         gap: 38, rooms: 6,  ibu: 3700, points: '440,240 600,220 600,320 440,320' },
  { name: 'Kebayoran B.',  gap: 28, rooms: 7,  ibu: 4000, points: '110,340 240,320 260,430 130,450' },
  { name: 'Pancoran',      gap: 41, rooms: 5,  ibu: 4300, points: '240,320 440,320 420,430 260,430' },
  { name: 'Pasar Rebo',    gap: 52, rooms: 4,  ibu: 4800, points: '440,320 600,320 580,420 420,430' },
];

const TOP5 = [...KECAMATAN].sort((a,b) => b.gap - a.gap).slice(0, 5);
const TOP10_BAR = [...KECAMATAN].sort((a,b) => b.gap - a.gap).slice(0, 10);

// 6-month trend data
const TREND = [
  { m: 'Des', pos: 720,  neg: 180 },
  { m: 'Jan', pos: 820,  neg: 210 },
  { m: 'Feb', pos: 760,  neg: 260 },
  { m: 'Mar', pos: 880,  neg: 230 },
  { m: 'Apr', pos: 950,  neg: 240 },
  { m: 'Mei', pos: 1020, neg: 227 },
];

// ─────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────
function Sidebar({ active = 'map' }) {
  const items = [
    { id: 'map',     label: 'Peta Distribusi',  icon: <IconMap />     },
    { id: 'gap',     label: 'Gap Score',        icon: <IconChart />   },
    { id: 'reports', label: 'Laporan Fasilitas',icon: <IconClipboard />},
    { id: 'users',   label: 'Aktivitas Pengguna',icon: <IconUsers />  },
    { id: 'settings',label: 'Pengaturan',       icon: <IconGear />    },
  ];
  return (
    <div style={{
      width: 232, background: G.surface,
      borderRight: `1px solid ${G.line}`, display: 'flex', flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* logo */}
      <div style={{ padding: '24px 22px 20px', borderBottom: `1px solid ${G.line}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: `linear-gradient(140deg, ${G.rose}, ${G.roseDk})`,
            color: '#fff', fontFamily: 'Nunito', fontWeight: 900, fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 14px rgba(232,165,152,0.4)',
          }}>M</div>
          <div>
            <div style={{
              fontFamily: 'Nunito', fontWeight: 900, fontSize: 14, color: G.ink,
              letterSpacing: -0.2,
            }}>MomSpace</div>
            <div style={{
              fontSize: 10.5, color: G.body, fontWeight: 600,
              fontFamily: 'Quicksand', letterSpacing: 0.2,
            }}>Dashboard Pemerintah</div>
          </div>
        </div>
      </div>

      {/* nav */}
      <div style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div className="mono" style={{
          fontSize: 9.5, color: '#A89991', textTransform: 'uppercase',
          letterSpacing: 1.2, padding: '6px 12px 8px',
        }}>Navigasi</div>
        {items.map((it) => {
          const on = it.id === active;
          return (
            <div key={it.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 12,
              background: on ? G.roseLt : 'transparent',
              color: on ? G.roseDk : G.body,
              cursor: 'pointer',
              fontFamily: 'Quicksand', fontWeight: on ? 700 : 600, fontSize: 13,
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
            </div>
          );
        })}
      </div>

      {/* footer */}
      <div style={{ padding: 12, borderTop: `1px solid ${G.line}` }}>
        <div style={{
          padding: 12, borderRadius: 14, background: G.surface2,
          display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(140deg, ${G.sage}, ${G.sageDk})`,
            color: '#fff', fontFamily: 'Nunito', fontWeight: 900, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>DK</div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'Nunito', fontWeight: 800, fontSize: 11.5, color: G.ink,
              lineHeight: 1.2,
            }}>Dinas Kesehatan</div>
            <div style={{ fontSize: 10, color: G.body, marginTop: 1, fontWeight: 600 }}>
              DKI Jakarta · Admin
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 10, padding: '0 4px', fontSize: 10.5, color: '#A89991',
          fontFamily: 'Quicksand', fontWeight: 600,
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

// ─────────────────────────────────────────────────────────────
// Topbar
// ─────────────────────────────────────────────────────────────
function TopBar({ title, subtitle }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '22px 28px', borderBottom: `1px solid ${G.line}`,
      background: G.surface,
    }}>
      <div>
        <div style={{
          fontFamily: 'Nunito', fontWeight: 900, fontSize: 22, color: G.ink,
          letterSpacing: -0.3,
        }}>{title}</div>
        <div style={{
          fontFamily: 'Quicksand', fontWeight: 600, fontSize: 12.5, color: G.body,
          marginTop: 3, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {subtitle}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button style={{
          background: G.surface, border: `1px solid ${G.lineDk}`,
          borderRadius: 12, padding: '9px 14px',
          fontFamily: 'Quicksand', fontWeight: 700, fontSize: 12.5, color: G.ink,
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke={G.ink} strokeWidth="1.8"/>
            <path d="M3 9h18M8 3v4M16 3v4" stroke={G.ink} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          1 – 17 Mei 2026
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke={G.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button style={{
          background: `linear-gradient(140deg, ${G.rose}, ${G.roseDk})`,
          color: '#fff', border: 0, borderRadius: 12, padding: '10px 16px',
          fontFamily: 'Nunito', fontWeight: 800, fontSize: 12.5,
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
          boxShadow: '0 8px 18px rgba(232,165,152,0.4)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 3v12M6 11l6 6 6-6M4 21h16"
              stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Unduh Laporan
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Summary cards
// ─────────────────────────────────────────────────────────────
function SummaryCard({ icon, value, label, trend, trendTone = 'up' }) {
  const trendUp = trendTone === 'up';
  return (
    <div style={{
      background: G.surface, borderRadius: 16, padding: 20,
      border: `1px solid ${G.line}`,
      display: 'flex', flexDirection: 'column', gap: 8,
      minWidth: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, background: G.roseLt,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: G.roseDk,
        }}>{icon}</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 8px', borderRadius: 99,
          background: trendUp ? G.sageLt : 'rgba(201,122,110,0.12)',
          color:      trendUp ? G.sageDk : G.roseDp,
          fontFamily: 'Quicksand', fontWeight: 700, fontSize: 11,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d={trendUp ? "M6 14l6-6 6 6" : "M6 10l6 6 6-6"}
              stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {trend}
        </div>
      </div>
      <div style={{
        fontFamily: 'Nunito', fontWeight: 900, fontSize: 28, color: G.ink,
        letterSpacing: -0.6, lineHeight: 1.1, marginTop: 4,
      }}>{value}</div>
      <div style={{
        fontFamily: 'Quicksand', fontWeight: 600, fontSize: 12, color: G.body,
        lineHeight: 1.3,
      }}>{label}</div>
    </div>
  );
}

function SummaryRow() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
    }}>
      <SummaryCard
        icon={<IconHouse />}
        value="284"
        label="Total ruang laktasi terdaftar"
        trend="+12 bulan ini" trendTone="up" />
      <SummaryCard
        icon={<IconStar />}
        value={<>4.3<span style={{ fontSize: 16, color: G.body, fontWeight: 700 }}> / 5</span></>}
        label="Rata-rata rating fasilitas"
        trend="+0.2" trendTone="up" />
      <SummaryCard
        icon={<IconAlert />}
        value="12"
        label="Kecamatan underserved (Gap >70)"
        trend="−3 vs. April" trendTone="up" />
      <SummaryCard
        icon={<IconReport />}
        value="1.247"
        label="Laporan masuk bulan ini"
        trend="+18%" trendTone="up" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Choropleth map
// ─────────────────────────────────────────────────────────────
function ChoroplethMap() {
  const [hover, setHover] = React.useState(null);
  return (
    <Panel title="Peta sebaran ruang laktasi · Jakarta"
      subtitle="Warna menunjukkan Gap Score per kecamatan (semakin gelap, semakin kurang terlayani)">
      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <svg viewBox="0 0 640 460" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* water/background hint */}
            <rect x="0" y="0" width="640" height="60" fill="rgba(91,141,239,0.06)"/>
            <text x="540" y="36" fontFamily="Nunito" fontWeight="700" fontSize="10"
              fill="#9EAEC4">TELUK JAKARTA</text>

            {KECAMATAN.map((k) => {
              const isHover = hover === k.name;
              const isGambir = k.name === 'Gambir';
              return (
                <g key={k.name}
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

            {/* labels on big regions */}
            {KECAMATAN.map((k) => {
              const cx = avgX(k.points), cy = avgY(k.points);
              return (
                <text key={`l-${k.name}`}
                  x={cx} y={cy}
                  textAnchor="middle"
                  fontFamily="Nunito" fontWeight="700" fontSize="9.5"
                  fill={k.gap >= 65 ? '#fff' : G.ink}
                  opacity="0.95"
                  style={{ pointerEvents: 'none' }}
                >{k.name}</text>
              );
            })}

            {/* Gambir flag */}
            <FlagMarker x={385} y={195} />
          </svg>

          {hover && (
            <Tooltip k={KECAMATAN.find((x) => x.name === hover)} />
          )}
          {!hover && (
            <Tooltip k={KECAMATAN.find((x) => x.name === 'Gambir')} pinned />
          )}
        </div>

        {/* Legend column */}
        <div style={{ width: 150, flexShrink: 0 }}>
          <div className="mono" style={{
            fontSize: 10, color: '#A89991', textTransform: 'uppercase',
            letterSpacing: 1.2, marginBottom: 10,
          }}>Legenda · Gap Score</div>
          <div style={{
            height: 12, borderRadius: 6, marginBottom: 6,
            background: `linear-gradient(90deg, ${G.roseLt} 0%, ${G.rose05} 20%, ${G.rose03} 40%, ${G.rose} 60%, ${G.roseDk} 80%, ${G.roseDp} 100%)`,
          }} />
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontFamily: 'Quicksand', fontWeight: 700, fontSize: 10, color: G.body,
          }}>
            <span>0 — Terlayani</span>
            <span>100 — Krisis</span>
          </div>

          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <LegendBadge color={G.sage} label="Batas kecamatan" sw={3} />
            <LegendBadge color={G.sageDk} label="Highlight intervensi" sw={3} />
          </div>

          <div style={{
            marginTop: 22, padding: 12, borderRadius: 12, background: G.surface2,
            fontFamily: 'Quicksand', fontWeight: 600, fontSize: 11, color: G.body,
            lineHeight: 1.5,
          }}>
            <b style={{ fontFamily: 'Nunito', fontWeight: 800, color: G.ink }}>
              Hover kecamatan
            </b><br/>
            untuk melihat detail Gap Score, jumlah ruang laktasi, dan populasi
            ibu potensial.
          </div>
        </div>
      </div>
    </Panel>
  );
}

function FlagMarker({ x, y }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y-32} stroke={G.sageDk} strokeWidth="1.5"/>
      <path d={`M${x} ${y-32} L${x+22} ${y-28} L${x+18} ${y-22} L${x+22} ${y-16} L${x} ${y-18} Z`}
        fill={G.sageDk}/>
    </g>
  );
}

function Tooltip({ k, pinned }) {
  if (!k) return null;
  return (
    <div style={{
      position: 'absolute', top: 12, left: 12,
      padding: '10px 14px', background: '#fff', borderRadius: 12,
      boxShadow: '0 12px 28px rgba(60,40,30,0.18), 0 1px 3px rgba(60,40,30,0.06)',
      border: `1px solid ${G.line}`,
      minWidth: 180, pointerEvents: 'none',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
      }}>
        <div style={{
          width: 10, height: 10, borderRadius: 99, background: gapColor(k.gap),
        }} />
        <div style={{
          fontFamily: 'Nunito', fontWeight: 800, fontSize: 13, color: G.ink,
        }}>{k.name}</div>
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
function TipRow({ label, value, accent }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '3px 0', fontFamily: 'Quicksand', fontWeight: 600, fontSize: 11.5,
    }}>
      <span style={{ color: G.body }}>{label}</span>
      <span className="mono" style={{
        fontWeight: 700, color: accent ? G.roseDp : G.ink,
      }}>{value}</span>
    </div>
  );
}
function LegendBadge({ color, label, sw = 14 }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: 'Quicksand', fontWeight: 600, fontSize: 11, color: G.body,
    }}>
      <div style={{ width: 18, height: sw, background: color, borderRadius: 4 }} />
      {label}
    </div>
  );
}

function avgX(points) {
  const pts = points.split(' ').map((p) => p.split(',').map(Number));
  return pts.reduce((s, [x]) => s + x, 0) / pts.length;
}
function avgY(points) {
  const pts = points.split(' ').map((p) => p.split(',').map(Number));
  return pts.reduce((s, [, y]) => s + y, 0) / pts.length;
}

// ─────────────────────────────────────────────────────────────
// Panel chrome
// ─────────────────────────────────────────────────────────────
function Panel({ title, subtitle, action, children, padding = 22 }) {
  return (
    <div style={{
      background: G.surface, borderRadius: 16, padding,
      border: `1px solid ${G.line}`,
      display: 'flex', flexDirection: 'column', minWidth: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 14, gap: 12,
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, color: G.ink,
            letterSpacing: -0.2,
          }}>{title}</div>
          {subtitle && (
            <div style={{
              fontFamily: 'Quicksand', fontWeight: 600, fontSize: 11.5, color: G.body,
              marginTop: 3, lineHeight: 1.4,
            }}>{subtitle}</div>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Gap score table
// ─────────────────────────────────────────────────────────────
function GapTable() {
  return (
    <Panel
      title="Kecamatan prioritas intervensi"
      subtitle="Top 5 kecamatan dengan Gap Score tertinggi"
      action={
        <span style={{
          fontFamily: 'Quicksand', fontWeight: 700, fontSize: 11,
          color: G.roseDk, background: G.roseLt,
          padding: '4px 10px', borderRadius: 99, whiteSpace: 'nowrap',
        }}>5 / 14</span>
      }
    >
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        fontFamily: 'Quicksand',
      }}>
        <thead>
          <tr style={{ textAlign: 'left' }}>
            <Th>#</Th><Th>Kecamatan</Th><Th right>Gap</Th><Th right>Ruang</Th><Th right>Ibu</Th>
          </tr>
        </thead>
        <tbody>
          {TOP5.map((k, i) => (
            <tr key={k.name} style={{
              borderTop: `1px solid ${G.line}`,
            }}>
              <Td>
                <span className="mono" style={{
                  fontSize: 11, color: i === 0 ? G.roseDp : G.body, fontWeight: 700,
                }}>{i + 1}</span>
              </Td>
              <Td>
                <div style={{
                  fontFamily: 'Nunito', fontWeight: 800, fontSize: 12.5, color: G.ink,
                }}>{k.name}</div>
              </Td>
              <Td right>
                <span style={{
                  display: 'inline-block', padding: '3px 9px', borderRadius: 99,
                  background: gapColor(k.gap),
                  color: k.gap >= 65 ? '#fff' : G.ink,
                  fontFamily: 'Nunito', fontWeight: 800, fontSize: 11,
                  fontVariantNumeric: 'tabular-nums',
                }}>{k.gap}</span>
              </Td>
              <Td right>
                <span className="mono" style={{
                  fontSize: 11, color: G.ink, fontWeight: 700,
                }}>{k.rooms}</span>
              </Td>
              <Td right>
                <span className="mono" style={{
                  fontSize: 11, color: G.ink, fontWeight: 700,
                }}>{k.ibu.toLocaleString('id')}</span>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{
        marginTop: 14, paddingTop: 12, borderTop: `1px solid ${G.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: 'Quicksand', fontWeight: 600, fontSize: 11, color: G.body,
        }}>9 kecamatan lain dengan Gap ≥ 50</span>
        <span style={{
          fontFamily: 'Quicksand', fontWeight: 700, fontSize: 11.5, color: G.roseDk,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          Lihat semua kecamatan
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke={G.roseDk} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </Panel>
  );
}
function Th({ children, right }) {
  return (
    <th style={{
      fontFamily: 'Quicksand', fontWeight: 700, fontSize: 10, color: '#9E948A',
      textTransform: 'uppercase', letterSpacing: 1.2,
      padding: '8px 0 10px', textAlign: right ? 'right' : 'left',
    }}>{children}</th>
  );
}
function Td({ children, right }) {
  return (
    <td style={{ padding: '11px 0', textAlign: right ? 'right' : 'left' }}>
      {children}
    </td>
  );
}

// ─────────────────────────────────────────────────────────────
// Problem reports
// ─────────────────────────────────────────────────────────────
function ProblemReports() {
  const items = [
    { name: 'Grand Indonesia · Lt. 3', issue: 'Kulkas mati',     time: '2 jam lalu',  initial: 'G' },
    { name: 'Stasiun Sudirman',        issue: 'Ruangan terkunci',time: '5 jam lalu',  initial: 'S' },
    { name: 'RS Cipto Mangunkusumo',   issue: 'Fasilitas rusak', time: '1 hari lalu', initial: 'R' },
  ];
  return (
    <Panel title="Laporan fasilitas bermasalah"
      subtitle="Butuh tindak lanjut · 14 laporan aktif minggu ini">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it) => (
          <div key={it.name} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: 12, borderRadius: 12,
            background: G.surface2, border: `1px solid ${G.line}`,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: `linear-gradient(140deg, ${G.rose}, ${G.roseDk})`,
              color: '#fff', fontFamily: 'Nunito', fontWeight: 900, fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{it.initial}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Nunito', fontWeight: 800, fontSize: 13, color: G.ink,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{it.name}</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginTop: 4,
              }}>
                <span style={{
                  fontFamily: 'Quicksand', fontWeight: 700, fontSize: 10.5,
                  color: G.roseDp, background: 'rgba(201,122,110,0.12)',
                  padding: '2px 8px', borderRadius: 99,
                }}>{it.issue}</span>
                <span style={{
                  fontSize: 10.5, color: '#9E948A', fontWeight: 600,
                  fontFamily: 'Quicksand',
                }}>· {it.time}</span>
              </div>
            </div>
            <button style={{
              background: '#fff', border: `1.5px solid ${G.rose}`,
              color: G.roseDk, borderRadius: 99, padding: '7px 14px',
              fontFamily: 'Nunito', fontWeight: 800, fontSize: 11.5,
              cursor: 'pointer', flexShrink: 0,
            }}>Tindak lanjut</button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ─────────────────────────────────────────────────────────────
// Trend mini chart
// ─────────────────────────────────────────────────────────────
function TrendChart() {
  const W = 480, H = 200, P = { l: 36, r: 16, t: 16, b: 30 };
  const maxY = 1100;
  const x = (i) => P.l + (i / (TREND.length - 1)) * (W - P.l - P.r);
  const y = (v) => P.t + (1 - v / maxY) * (H - P.t - P.b);
  const path = (k) => TREND.map((d, i) =>
    `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d[k])}`).join(' ');
  const area = (k) => `${path(k)} L ${x(TREND.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;

  return (
    <Panel title="Tren laporan kondisi"
      subtitle="6 bulan terakhir · positif vs negatif">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {/* grid lines */}
        {[0, 250, 500, 750, 1000].map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)}
              stroke={G.line} strokeDasharray="2 4"/>
            <text x={P.l - 6} y={y(v) + 3} textAnchor="end"
              fontFamily="JetBrains Mono" fontSize="9" fill="#A89991">{v}</text>
          </g>
        ))}
        {/* x-axis labels */}
        {TREND.map((d, i) => (
          <text key={d.m} x={x(i)} y={H - 10} textAnchor="middle"
            fontFamily="Nunito" fontWeight="700" fontSize="10" fill={G.body}>
            {d.m}
          </text>
        ))}
        {/* areas */}
        <path d={area('pos')} fill={G.sageLt}/>
        <path d={area('neg')} fill="rgba(232,153,138,0.16)"/>
        {/* lines */}
        <path d={path('pos')} fill="none" stroke={G.sage}    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d={path('neg')} fill="none" stroke={G.roseDk} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* dots */}
        {TREND.map((d, i) => (
          <g key={d.m}>
            <circle cx={x(i)} cy={y(d.pos)} r="3.5" fill="#fff" stroke={G.sage}    strokeWidth="2"/>
            <circle cx={x(i)} cy={y(d.neg)} r="3.5" fill="#fff" stroke={G.roseDk} strokeWidth="2"/>
          </g>
        ))}
        {/* last value label */}
        <text x={x(5) + 8} y={y(1020)} fontFamily="Nunito" fontWeight="800" fontSize="11" fill={G.sageDk}>1.020</text>
        <text x={x(5) + 8} y={y(227)}  fontFamily="Nunito" fontWeight="800" fontSize="11" fill={G.roseDp}>227</text>
      </svg>
      {/* legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 6, paddingLeft: 36 }}>
        <LegendDot color={G.sage}    label="Laporan positif" />
        <LegendDot color={G.roseDk} label="Laporan negatif" />
      </div>
    </Panel>
  );
}
function LegendDot({ color, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontFamily: 'Quicksand', fontWeight: 600, fontSize: 11, color: G.body,
    }}>
      <div style={{ width: 10, height: 10, borderRadius: 99, background: color }} />
      {label}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Peta Distribusi page (variant A)
// ─────────────────────────────────────────────────────────────
function PetaDistribusiPage() {
  return (
    <div style={{
      display: 'flex', height: '100%', background: G.surface2,
      fontFamily: 'Quicksand', color: G.ink,
    }}>
      <Sidebar active="map" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar
          title="Peta Distribusi Ruang Laktasi"
          subtitle={<>
            <span>Jakarta · Diperbarui 17 Mei 2026</span>
            <span style={{
              padding: '3px 8px', borderRadius: 99, background: G.sageLt,
              color: G.sageDk, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3,
            }}>LIVE</span>
          </>}
        />
        <div style={{
          flex: 1, overflowY: 'auto', padding: 24,
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          <SummaryRow />
          <div style={{
            display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 16,
          }}>
            <ChoroplethMap />
            <GapTable />
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
          }}>
            <ProblemReports />
            <TrendChart />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Gap Score Analytics page (variant B)
// ─────────────────────────────────────────────────────────────
function BarChartTop10() {
  const W = 640, H = 320, P = { l: 36, r: 24, t: 18, b: 70 };
  const max = 100;
  const bw = (W - P.l - P.r) / TOP10_BAR.length - 8;
  const x = (i) => P.l + i * ((W - P.l - P.r) / TOP10_BAR.length);
  const y = (v) => P.t + (1 - v / max) * (H - P.t - P.b);

  return (
    <Panel title="Top 10 kecamatan berdasarkan Gap Score"
      subtitle="Bilah lebih panjang & gelap = prioritas intervensi tertinggi">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {/* gridlines */}
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)}
              stroke={G.line} strokeDasharray="2 4"/>
            <text x={P.l - 6} y={y(v) + 3} textAnchor="end"
              fontFamily="JetBrains Mono" fontSize="9" fill="#A89991">{v}</text>
          </g>
        ))}
        {/* threshold line */}
        <line x1={P.l} x2={W - P.r} y1={y(70)} y2={y(70)}
          stroke={G.roseDp} strokeWidth="1" strokeDasharray="4 3"/>
        <text x={W - P.r - 4} y={y(70) - 4} textAnchor="end"
          fontFamily="Nunito" fontWeight="800" fontSize="9.5" fill={G.roseDp}>
          AMBANG INTERVENSI · 70
        </text>
        {/* bars */}
        {TOP10_BAR.map((k, i) => {
          const bx = x(i) + 4;
          const by = y(k.gap);
          const bh = y(0) - by;
          return (
            <g key={k.name}>
              <rect x={bx} y={by} width={bw} height={bh} rx="4"
                fill={gapColor(k.gap)} />
              <text x={bx + bw / 2} y={by - 6} textAnchor="middle"
                fontFamily="Nunito" fontWeight="800" fontSize="10" fill={G.ink}>
                {k.gap}
              </text>
              <text x={bx + bw / 2} y={H - P.b + 14} textAnchor="end"
                fontFamily="Quicksand" fontWeight="700" fontSize="10" fill={G.body}
                transform={`rotate(-32 ${bx + bw / 2} ${H - P.b + 14})`}>
                {k.name}
              </text>
            </g>
          );
        })}
        {/* axis */}
        <line x1={P.l} x2={W - P.r} y1={y(0)} y2={y(0)} stroke={G.lineDk}/>
      </svg>
    </Panel>
  );
}

function ScatterPlot() {
  const W = 480, H = 320, P = { l: 44, r: 16, t: 18, b: 40 };
  const maxX = 7000, maxY = 12;
  const x = (v) => P.l + (v / maxX) * (W - P.l - P.r);
  const y = (v) => P.t + (1 - v / maxY) * (H - P.t - P.b);

  return (
    <Panel title="Distribusi: ruang laktasi vs populasi ibu potensial"
      subtitle="Setiap titik = satu kecamatan · warna mengikuti Gap Score">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {/* gridlines */}
        {[0, 2000, 4000, 6000].map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={P.t} y2={y(0)} stroke={G.line} strokeDasharray="2 4"/>
            <text x={x(v)} y={H - P.b + 16} textAnchor="middle"
              fontFamily="JetBrains Mono" fontSize="9" fill="#A89991">
              {(v / 1000).toFixed(0)}k
            </text>
          </g>
        ))}
        {[0, 3, 6, 9, 12].map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={G.line} strokeDasharray="2 4"/>
            <text x={P.l - 6} y={y(v) + 3} textAnchor="end"
              fontFamily="JetBrains Mono" fontSize="9" fill="#A89991">{v}</text>
          </g>
        ))}
        {/* axes labels */}
        <text x={W / 2} y={H - 4} textAnchor="middle"
          fontFamily="Quicksand" fontWeight="700" fontSize="10" fill={G.body}>
          Populasi ibu potensial (jiwa)
        </text>
        <text x={12} y={H / 2} textAnchor="middle"
          transform={`rotate(-90 12 ${H/2})`}
          fontFamily="Quicksand" fontWeight="700" fontSize="10" fill={G.body}>
          Jumlah ruang laktasi
        </text>

        {/* expected supply line — illustrative */}
        <path d={`M ${x(0)} ${y(0)} L ${x(6000)} ${y(10)}`}
          stroke={G.sage} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6"/>
        <text x={x(6000) - 4} y={y(10) - 6} textAnchor="end"
          fontFamily="Nunito" fontWeight="800" fontSize="9" fill={G.sageDk}>
          GARIS IDEAL (Supply ≈ Demand)
        </text>

        {/* dots */}
        {KECAMATAN.map((k) => (
          <g key={k.name}>
            <circle cx={x(k.ibu)} cy={y(k.rooms)} r="8"
              fill={gapColor(k.gap)} fillOpacity="0.85" stroke="#fff" strokeWidth="2"/>
            {k.gap >= 71 && (
              <text x={x(k.ibu)} y={y(k.rooms) - 11} textAnchor="middle"
                fontFamily="Nunito" fontWeight="800" fontSize="9" fill={G.roseDp}>
                {k.name}
              </text>
            )}
          </g>
        ))}
      </svg>
    </Panel>
  );
}

function FormulaCard() {
  return (
    <Panel title="Metodologi Gap Score"
      subtitle="Formula perhitungan & sumber data">
      <div style={{
        padding: 18, borderRadius: 14, background: G.surface2,
        fontFamily: 'JetBrains Mono', fontSize: 13, color: G.ink,
        lineHeight: 1.6, textAlign: 'center', marginBottom: 14,
      }}>
        Gap Score = <span style={{ color: G.roseDp }}>(Demand − Supply)</span>
        <span style={{ color: G.body }}> / </span>
        <span style={{ color: G.sageDk }}>Demand</span>
        <span style={{ color: G.body }}> × 100</span>
      </div>
      <div style={{
        fontFamily: 'Quicksand', fontWeight: 600, fontSize: 12, color: G.body,
        lineHeight: 1.55, marginBottom: 14,
      }}>
        <b style={{ color: G.ink, fontFamily: 'Nunito', fontWeight: 800 }}>Demand Index</b>{' '}
        dihitung dari populasi ibu menyusui per kecamatan (BPS 2023) dan
        kepadatan ruang publik. <b style={{ color: G.ink, fontFamily: 'Nunito', fontWeight: 800 }}>Supply Index</b>{' '}
        merupakan jumlah ruang laktasi aktif tertimbang oleh rating fasilitas
        dari laporan crowdsourcing MomSpace.
      </div>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 12,
        borderTop: `1px solid ${G.line}`,
      }}>
        <SourcePill label="BPS DKI Jakarta 2023" />
        <SourcePill label="Crowdsourcing MomSpace 2026" />
        <SourcePill label="Dinas Kesehatan DKI" />
      </div>
      <div style={{
        marginTop: 14, padding: 12, borderRadius: 12, background: G.roseLt,
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <div style={{ flexShrink: 0, marginTop: 1, color: G.roseDp }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8v5M12 16.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{
          fontFamily: 'Quicksand', fontWeight: 600, fontSize: 11.5, color: G.ink,
          lineHeight: 1.45,
        }}>
          <b style={{ fontFamily: 'Nunito', fontWeight: 800 }}>Catatan:</b> Gap
          Score di atas 70 menandakan kebutuhan intervensi prioritas oleh Dinas
          Kesehatan. Data diperbarui setiap awal bulan.
        </div>
      </div>
    </Panel>
  );
}
function SourcePill({ label }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px', borderRadius: 99,
      background: '#fff', border: `1px solid ${G.line}`,
      fontFamily: 'Quicksand', fontWeight: 700, fontSize: 10.5, color: G.body,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: 99, background: G.sage,
      }} />
      {label}
    </div>
  );
}

function GapAnalyticsPage() {
  return (
    <div style={{
      display: 'flex', height: '100%', background: G.surface2,
      fontFamily: 'Quicksand', color: G.ink,
    }}>
      <Sidebar active="gap" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar
          title="Analisis Gap Score"
          subtitle={<>
            <span>Jakarta · Diperbarui 17 Mei 2026</span>
            <span style={{
              padding: '3px 8px', borderRadius: 99, background: G.roseLt,
              color: G.roseDk, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3,
            }}>METODOLOGI v2.1</span>
          </>}
        />
        <div style={{
          flex: 1, overflowY: 'auto', padding: 24,
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          <SummaryRow />
          <BarChartTop10 />
          <div style={{
            display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 16,
          }}>
            <ScatterPlot />
            <FormulaCard />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Icons (sidebar + cards)
// ─────────────────────────────────────────────────────────────
function IconMap() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M9 4v14M15 6v14" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  );
}
function IconChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 19V5M20 19H4M8 19V13M12 19V9M16 19V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function IconClipboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="9" y="2" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M9 11h6M9 15h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="17" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M14 18c.5-2.5 2.5-3.8 4.8-3.8 1 0 1.9.2 2.7.6"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function IconGear() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1A1.7 1.7 0 004.6 9a1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  );
}
function IconHouse() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l3 6.5 7 1-5 5 1.2 7L12 19l-6.2 3.5L7 15.5 2 10.5l7-1L12 3z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15"/>
    </svg>
  );
}
function IconAlert() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l10 18H2L12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M12 10v5M12 17.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function IconReport() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8 10h8M8 13h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

Object.assign(window, {
  PetaDistribusiPage, GapAnalyticsPage,
  Sidebar, TopBar, SummaryRow, Panel, ChoroplethMap, GapTable,
  ProblemReports, TrendChart, BarChartTop10, ScatterPlot, FormulaCard,
  KECAMATAN, gapColor, G,
});
