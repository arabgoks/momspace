// MomSpace Home / Map screen — warm-toned map, search, pins, floating buttons,
// bottom sheet with 3 variants, and the Classic Pill navbar.

const C = {
  rose:   '#E8A598',
  roseDk: '#D88B7C',
  roseLt: '#FBEEEA',
  sage:   '#8FAF8F',
  muted:  '#AAB995',
  gray:   '#C9C2BD',
  surface:'#FEFEFE',
  ink:    '#333727',
  body:   '#5C5347',
  beige:  '#FAF1E8',
  land:   '#F4E8DA',
  blockA: '#F0E0CC',
  blockB: '#EFDBC4',
  park:   '#C6D8C2',
  water:  '#DCE7EB',
  closed: '#BFB6AE',
  blue:   '#5B8DEF',
};

// ─────────────────────────────────────────────────────────────
// Warm map background — beige land, sage parks, white roads
// ─────────────────────────────────────────────────────────────
function WarmMapBg() {
  return (
    <svg viewBox="0 0 380 800" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <rect width="380" height="800" fill={C.land} />

      {/* big sage park */}
      <path d="M-20 420 Q60 380 120 430 T240 410 Q300 400 330 460 L340 540 Q280 580 200 560 T60 600 L-20 580 Z"
        fill={C.park} opacity="0.85"/>
      {/* small park top right */}
      <path d="M260 100 Q310 90 340 130 L350 200 Q310 220 280 200 T240 160 Z"
        fill={C.park} opacity="0.85"/>
      {/* water sliver bottom right */}
      <path d="M280 720 Q340 700 400 720 L400 820 L280 820 Z"
        fill={C.water} opacity="0.95"/>

      {/* blocks (warm tan tiles) */}
      <g fill={C.blockA} opacity="0.65">
        <rect x="20" y="180"  width="120" height="80"  rx="6"/>
        <rect x="160" y="180" width="80"  height="80"  rx="6"/>
        <rect x="20" y="280"  width="80"  height="100" rx="6"/>
        <rect x="120" y="280" width="120" height="60"  rx="6"/>
        <rect x="200" y="620" width="100" height="80"  rx="6"/>
        <rect x="20" y="660"  width="100" height="80"  rx="6"/>
      </g>
      <g fill={C.blockB} opacity="0.5">
        <rect x="140" y="280" width="60" height="40"  rx="4"/>
        <rect x="60" y="360"  width="60" height="40"  rx="4"/>
        <rect x="250" y="280" width="50" height="50"  rx="4"/>
        <rect x="40" y="700"  width="60" height="40"  rx="4"/>
      </g>

      {/* main road network */}
      <g stroke="#FFFFFF" strokeLinecap="round" fill="none">
        <path d="M-10 260 Q100 270 200 250 T390 240" strokeWidth="22"/>
        <path d="M-10 380 Q120 400 220 380 T390 360" strokeWidth="18"/>
        <path d="M-10 640 Q120 650 220 640 T390 620" strokeWidth="20"/>
        <path d="M180 -10 Q170 200 200 380 T230 820" strokeWidth="22"/>
        <path d="M60 -10 Q80 180 50 380 T80 820"     strokeWidth="16"/>
      </g>
      {/* road centerlines */}
      <g stroke={C.roseLt} strokeLinecap="round" fill="none" strokeDasharray="6 8" opacity="0.7">
        <path d="M-10 260 Q100 270 200 250 T390 240" strokeWidth="1.5"/>
        <path d="M180 -10 Q170 200 200 380 T230 820" strokeWidth="1.5"/>
      </g>
      {/* secondary streets */}
      <g stroke="#FFFFFF" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.85">
        <path d="M20 480 L360 470"/>
        <path d="M20 540 L360 530"/>
        <path d="M120 100 L130 800"/>
        <path d="M300 100 L310 800"/>
      </g>

      {/* labels (subtle) */}
      <g fill="#B9A38F" fontFamily="Nunito, system-ui" fontWeight="700" fontSize="9" opacity="0.7">
        <text x="46" y="220" transform="rotate(-2 46 220)">JL. THAMRIN</text>
        <text x="220" y="500" transform="rotate(3 220 500)">SUDIRMAN</text>
        <text x="260" y="160">MENTENG</text>
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Pins
// ─────────────────────────────────────────────────────────────
function Pin({ x, y, state = 'available', size = 1 }) {
  const fill =
    state === 'selected'   ? C.roseDk :
    state === 'available'  ? C.rose   :
                             C.closed;
  const scale = state === 'selected' ? 1.35 * size : 1 * size;
  const filter = state === 'selected'
    ? 'drop-shadow(0 8px 14px rgba(216,139,124,0.55))'
    : 'drop-shadow(0 3px 5px rgba(60,40,30,0.18))';
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      transform: `translate(-50%, -100%) scale(${scale})`,
      transformOrigin: 'bottom center',
      filter,
    }}>
      {state === 'selected' && (
        <div style={{
          position: 'absolute', bottom: -8, left: '50%',
          transform: 'translateX(-50%)',
          width: 36, height: 10, borderRadius: '50%',
          background: 'rgba(216,139,124,0.25)', filter: 'blur(2px)',
        }} />
      )}
      <svg width="28" height="36" viewBox="0 0 28 36">
        <path d="M14 1.5C7.1 1.5 1.5 7 1.5 13.8c0 9.7 12.5 20.7 12.5 20.7s12.5-11 12.5-20.7C26.5 7 20.9 1.5 14 1.5z"
          fill={fill} stroke="#fff" strokeWidth="2.5"/>
        <circle cx="14" cy="13.5" r="4.4" fill="#fff"/>
        {state === 'selected' && <circle cx="14" cy="13.5" r="1.8" fill={C.roseDk}/>}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// User location dot (blue with pulse ring)
// ─────────────────────────────────────────────────────────────
function UserDot({ x, y }) {
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      transform: 'translate(-50%, -50%)',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        width: 48, height: 48, borderRadius: '50%',
        background: 'rgba(91,141,239,0.18)',
        transform: 'translate(-50%, -50%)', left: '50%', top: '50%',
        animation: 'momPulse 2s ease-out infinite',
      }} />
      <div style={{
        width: 18, height: 18, borderRadius: '50%',
        background: C.blue, border: '3px solid #fff',
        boxShadow: '0 2px 8px rgba(91,141,239,0.35)',
      }} />
      <style>{`
        @keyframes momPulse {
          0%   { transform: translate(-50%,-50%) scale(0.6); opacity: 0.7; }
          100% { transform: translate(-50%,-50%) scale(1.6); opacity: 0;   }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Search bar
// ─────────────────────────────────────────────────────────────
function SearchBar() {
  return (
    <div style={{
      position: 'absolute', top: 56, left: 14, right: 14,
      height: 50, borderRadius: 25,
      background: C.roseLt,
      border: '1px solid rgba(232,165,152,0.25)',
      boxShadow: '0 10px 24px rgba(60,40,30,0.10), 0 1px 2px rgba(60,40,30,0.04)',
      display: 'flex', alignItems: 'center', padding: '0 8px 0 18px', gap: 10,
      zIndex: 4,
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke={C.roseDk} strokeWidth="2.2"/>
        <path d="M20 20l-3.8-3.8" stroke={C.roseDk} strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
      <div style={{
        flex: 1, fontFamily: 'Quicksand, system-ui',
        fontWeight: 600, fontSize: 13.5, color: '#A68A82',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        Cari ruang laktasi terdekat...
      </div>
      <button style={{
        border: 0, cursor: 'pointer',
        width: 38, height: 38, borderRadius: 19, background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(60,40,30,0.10)',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h10M18 7h2M4 17h2M10 17h10M4 12h6M14 12h6"
            stroke={C.roseDk} strokeWidth="2.2" strokeLinecap="round"/>
          <circle cx="16" cy="7"  r="2.2" stroke={C.roseDk} strokeWidth="2.2" fill="#fff"/>
          <circle cx="8"  cy="17" r="2.2" stroke={C.roseDk} strokeWidth="2.2" fill="#fff"/>
          <circle cx="12" cy="12" r="2.2" stroke={C.roseDk} strokeWidth="2.2" fill="#fff"/>
        </svg>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Floating map buttons (right side, stacked)
// ─────────────────────────────────────────────────────────────
function FloatingActions({ bottom }) {
  const Btn = ({ children, active }) => (
    <button style={{
      width: 46, height: 46, borderRadius: 23,
      background: active ? C.rose : '#fff',
      color: active ? '#fff' : C.ink,
      border: 0, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 6px 16px rgba(60,40,30,0.18), 0 1px 2px rgba(60,40,30,0.06)',
    }}>{children}</button>
  );
  return (
    <div style={{
      position: 'absolute', right: 14, bottom,
      display: 'flex', flexDirection: 'column', gap: 10, zIndex: 5,
    }}>
      <Btn>
        {/* layers */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 3l9 5-9 5-9-5 9-5z"   stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"/>
          <path d="M3 13l9 5 9-5"            stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round"/>
          <path d="M3 17l9 5 9-5"            stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" opacity="0.5"/>
        </svg>
      </Btn>
      <Btn active>
        {/* crosshair / locate me */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3.5" fill="currentColor"/>
          <circle cx="12" cy="12" r="7"   stroke="currentColor" strokeWidth="2" opacity="0.5"/>
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </Btn>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom sheet shells & variants
// ─────────────────────────────────────────────────────────────
function SheetShell({ children, height = 178 }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 88,
      height, background: C.surface,
      borderTopLeftRadius: 26, borderTopRightRadius: 26,
      boxShadow: '0 -16px 36px rgba(60,40,30,0.12), 0 -1px 0 rgba(60,40,30,0.04)',
      paddingTop: 12, zIndex: 6,
      fontFamily: 'Quicksand, system-ui',
    }}>
      <div style={{
        width: 40, height: 4, borderRadius: 2, background: '#E6DCD4',
        margin: '0 auto 12px',
      }} />
      {children}
    </div>
  );
}

// — DEFAULT: selected location detail —
function SheetDefault() {
  return (
    <SheetShell height={188}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '0 16px' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18, flexShrink: 0,
          background: `linear-gradient(140deg, ${C.rose}, #F2C6B8)`,
          color: '#fff', fontFamily: 'Nunito', fontWeight: 900, fontSize: 26,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 14px rgba(232,165,152,0.4)',
        }}>P</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Nunito', fontWeight: 800, fontSize: 16,
            color: C.ink, lineHeight: 1.25,
          }}>Plaza Indonesia · Level 4</div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginTop: 4,
            fontSize: 12.5, fontWeight: 600, color: C.body,
          }}>
            <span>220 m</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{
                width: 7, height: 7, borderRadius: 99,
                background: C.sage, boxShadow: `0 0 0 3px rgba(143,175,143,0.2)`,
              }} />
              <span style={{ color: C.sage, fontWeight: 700 }}>Buka sekarang</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <Star /> <Star /> <Star /> <Star /> <Star half />
            <span className="mono" style={{
              fontSize: 12, fontWeight: 600, color: C.ink, marginLeft: 4,
            }}>4.8</span>
            <span style={{ fontSize: 11.5, color: '#9E948A' }}>(124)</span>
          </div>
        </div>

        <button style={{
          width: 36, height: 36, borderRadius: 18,
          background: C.roseLt, border: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginTop: 4,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke={C.roseDk} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div style={{
        display: 'flex', gap: 6, padding: '14px 16px 0', flexWrap: 'wrap',
      }}>
        <Tag>✓ Bersih</Tag>
        <Tag>Kulkas</Tag>
        <Tag>AC</Tag>
        <Tag>Stroller</Tag>
      </div>
    </SheetShell>
  );
}

// — EMPTY: horizontal scroll list of nearby rooms —
function SheetEmpty() {
  const items = [
    { initial: 'P', name: 'Plaza Indonesia',  sub: '220 m · Lt. 4',  rating: 4.8 },
    { initial: 'G', name: 'Grand Indonesia',  sub: '480 m · Lt. 3A', rating: 4.6 },
    { initial: 'S', name: 'Senayan City',     sub: '1.2 km · Lt. 5', rating: 4.7 },
    { initial: 'P', name: 'Pacific Place',    sub: '1.8 km · Lt. 2', rating: 4.5 },
  ];
  return (
    <SheetShell height={210}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px 10px',
      }}>
        <div style={{
          fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, color: C.ink,
        }}>Ruang laktasi terdekat</div>
        <div style={{
          fontSize: 12, fontWeight: 700, color: C.roseDk,
          fontFamily: 'Quicksand',
        }}>Lihat semua</div>
      </div>
      <div style={{
        display: 'flex', gap: 10, overflowX: 'auto', padding: '0 16px 12px',
        scrollbarWidth: 'none',
      }}>
        {items.map((it, i) => (
          <div key={i} style={{
            minWidth: 156, padding: 12, borderRadius: 16,
            background: '#FBF6F1', border: '1px solid rgba(60,40,30,0.06)',
            flexShrink: 0,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(140deg, ${C.rose}, #F2C6B8)`,
              color: '#fff', fontFamily: 'Nunito', fontWeight: 900, fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 8,
            }}>{it.initial}</div>
            <div style={{
              fontFamily: 'Nunito', fontWeight: 800, fontSize: 13, color: C.ink,
              lineHeight: 1.25, marginBottom: 2,
            }}>{it.name}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.body }}>
              {it.sub}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4, marginTop: 6,
            }}>
              <Star size={10} />
              <span className="mono" style={{
                fontSize: 11, fontWeight: 600, color: C.ink,
              }}>{it.rating}</span>
              <span style={{
                marginLeft: 'auto', fontSize: 9.5, fontWeight: 700,
                color: C.sage, background: 'rgba(143,175,143,0.15)',
                padding: '2px 6px', borderRadius: 99,
              }}>BUKA</span>
            </div>
          </div>
        ))}
      </div>
    </SheetShell>
  );
}

// — LOADING: skeleton shimmer —
function SheetLoading() {
  return (
    <SheetShell height={188}>
      <div style={{ display: 'flex', gap: 12, padding: '0 16px' }}>
        <Skeleton w={64} h={64} r={18} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
          <Skeleton w="70%" h={14} r={4} />
          <Skeleton w="50%" h={11} r={4} />
          <Skeleton w="40%" h={11} r={4} />
        </div>
        <Skeleton w={36} h={36} r={18} />
      </div>
      <div style={{ display: 'flex', gap: 6, padding: '16px 16px 0' }}>
        <Skeleton w={64} h={22} r={11} />
        <Skeleton w={56} h={22} r={11} />
        <Skeleton w={44} h={22} r={11} />
        <Skeleton w={70} h={22} r={11} />
      </div>
      <style>{`
        @keyframes momShimmer {
          0%   { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
      `}</style>
    </SheetShell>
  );
}

function Skeleton({ w, h, r = 6 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'linear-gradient(90deg, #EEE3D9 0%, #F6ECE3 50%, #EEE3D9 100%)',
      backgroundSize: '400px 100%',
      animation: 'momShimmer 1.4s ease-in-out infinite',
    }} />
  );
}

function Tag({ children }) {
  return (
    <div style={{
      fontSize: 11.5, fontWeight: 700, color: C.sage,
      background: 'rgba(143,175,143,0.15)',
      padding: '5px 10px', borderRadius: 99,
      fontFamily: 'Quicksand',
    }}>{children}</div>
  );
}

function Star({ half, size = 13 }) {
  const id = React.useId();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={id}>
          <stop offset="50%" stopColor={C.rose}/>
          <stop offset="50%" stopColor="#E6D9CE"/>
        </linearGradient>
      </defs>
      <path d="M12 2l3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5L7 14.5 2 9.5l7-1L12 2z"
        fill={half ? `url(#${id})` : C.rose}/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Map "world" — pins + user dot
// ─────────────────────────────────────────────────────────────
function MapWorld({ sheetVariant }) {
  // when "empty" no pin is selected
  const sel = sheetVariant === 'default';
  return (
    <>
      <Pin x={52} y={48}  state={sel ? 'selected' : 'available'} />
      <Pin x={28} y={36}  state="available" />
      <Pin x={72} y={32}  state="available" />
      <Pin x={36} y={62}  state="closed" />
      <Pin x={78} y={62}  state="available" />
      <Pin x={20} y={70}  state="available" />
      <Pin x={62} y={78}  state="closed" />
      <UserDot x={45} y={66} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Home / Map full screen
// ─────────────────────────────────────────────────────────────
function HomeMapScreen({ sheetVariant = 'default' }) {
  const [tab, setTab] = useState(0);
  const Sheet =
    sheetVariant === 'empty'   ? SheetEmpty   :
    sheetVariant === 'loading' ? SheetLoading :
                                  SheetDefault;
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.land }}>
      <WarmMapBg />
      <MapWorld sheetVariant={sheetVariant} />
      <SearchBar />
      <FloatingActions bottom={sheetVariant === 'empty' ? 308 : 286} />
      <Sheet />
      <NavbarClassic active={tab} onChange={setTab} labelOn={true} />
    </div>
  );
}

Object.assign(window, { HomeMapScreen, C, Pin, WarmMapBg, MapWorld });
