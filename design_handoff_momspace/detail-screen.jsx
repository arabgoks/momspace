// MomSpace Detail screen — single lactation room.
// Two variants: 'open' and 'closed'.

const D = window.C || {
  rose:'#E8A598', roseDk:'#D88B7C', roseLt:'#FBEEEA',
  sage:'#8FAF8F', muted:'#AAB995', surface:'#FEFEFE', ink:'#333727',
};

// ─────────────────────────────────────────────────────────────
// Photo placeholder — warm "room" illustration (abstract shapes)
// ─────────────────────────────────────────────────────────────
function RoomPhoto({ closed }) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: 220, overflow: 'hidden',
      background: 'linear-gradient(165deg, #F4DCC7 0%, #F8E7D7 55%, #EFD4C2 100%)',
    }}>
      {/* window light beam */}
      <div style={{
        position: 'absolute', left: '60%', top: -20, width: 110, height: 280,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0))',
        transform: 'rotate(12deg)', filter: 'blur(8px)',
      }} />
      {/* floor */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 70,
        background: 'linear-gradient(180deg, #E2C0A5 0%, #D8B095 100%)',
      }} />
      {/* rug */}
      <div style={{
        position: 'absolute', left: 60, right: 90, bottom: 14, height: 24, borderRadius: 12,
        background: 'rgba(232,165,152,0.45)',
      }} />
      {/* chair / nursing seat */}
      <div style={{
        position: 'absolute', left: 90, bottom: 28,
        width: 150, height: 110, borderRadius: '30px 30px 14px 14px',
        background: 'linear-gradient(165deg, #E8A598, #D88B7C)',
        boxShadow: '0 18px 30px rgba(216,139,124,0.35)',
      }}>
        {/* cushion */}
        <div style={{
          position: 'absolute', left: 18, right: 18, top: 26, bottom: 22, borderRadius: 12,
          background: 'rgba(255,255,255,0.35)',
        }} />
      </div>
      {/* side table */}
      <div style={{
        position: 'absolute', right: 36, bottom: 32, width: 56, height: 70,
        borderRadius: '8px 8px 4px 4px',
        background: 'linear-gradient(180deg, #C99879, #A87A5C)',
      }} />
      {/* plant pot */}
      <div style={{
        position: 'absolute', right: 44, bottom: 96, width: 36, height: 18,
        borderRadius: '0 0 8px 8px', background: '#B47A55',
      }} />
      {/* plant leaves */}
      <div style={{
        position: 'absolute', right: 26, bottom: 110, width: 72, height: 50,
        borderRadius: '50%', background: 'radial-gradient(ellipse, #8FAF8F 60%, transparent 70%)',
      }} />
      {/* picture frame */}
      <div style={{
        position: 'absolute', left: 32, top: 36, width: 60, height: 70, borderRadius: 6,
        background: '#fff', border: '4px solid #D8B095',
        boxShadow: '0 6px 14px rgba(60,40,30,0.12)',
      }}>
        <div style={{
          position: 'absolute', inset: 6, borderRadius: 2,
          background: 'linear-gradient(135deg, #C6D8C2, #E2EFD9)',
        }} />
      </div>

      {/* desaturate overlay if closed */}
      {closed && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(60,55,39,0.32)',
          backdropFilter: 'saturate(0.4)',
        }} />
      )}

      {/* status badge (bottom left) */}
      <div style={{
        position: 'absolute', left: 14, bottom: 14,
        background: 'rgba(255,255,255,0.95)', borderRadius: 99,
        padding: '6px 12px 6px 10px',
        display: 'flex', alignItems: 'center', gap: 7,
        fontFamily: 'Nunito', fontWeight: 800, fontSize: 12,
        boxShadow: '0 6px 14px rgba(60,40,30,0.18)',
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: 99,
          background: closed ? '#9E948A' : D.sage,
          boxShadow: closed ? 'none' : '0 0 0 3px rgba(143,175,143,0.22)',
        }} />
        <span style={{ color: closed ? '#5C5347' : D.sage }}>
          {closed ? 'Tutup' : 'Buka sekarang'}
        </span>
      </div>

      {/* photo count (bottom right) */}
      <div style={{
        position: 'absolute', right: 14, bottom: 14,
        background: 'rgba(51,55,39,0.65)', color: '#fff',
        borderRadius: 99, padding: '5px 11px',
        fontFamily: 'Nunito', fontWeight: 700, fontSize: 11.5,
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="18" height="14" rx="2" stroke="#fff" strokeWidth="2"/>
          <circle cx="12" cy="13" r="3" stroke="#fff" strokeWidth="2"/>
          <path d="M8 6l1.5-2h5L16 6" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
        1 / 4
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Header (white, with back/share)
// ─────────────────────────────────────────────────────────────
function DetailHeader() {
  return (
    <div style={{
      position: 'absolute', top: 60, left: 0, right: 0, height: 52,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(60,40,30,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 12px', zIndex: 4,
    }}>
      <CircBtn>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M14 6l-6 6 6 6" stroke={D.ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </CircBtn>
      <div style={{
        fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: D.ink,
      }}>Detail Ruang Laktasi</div>
      <CircBtn>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6M16 6l-4-4-4 4M12 2v14"
            stroke={D.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </CircBtn>
    </div>
  );
}

function CircBtn({ children }) {
  return (
    <button style={{
      width: 38, height: 38, borderRadius: 19, border: 0,
      background: '#FBF6F1', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────
// Info card
// ─────────────────────────────────────────────────────────────
function InfoCard({ closed }) {
  return (
    <div style={{ padding: '20px 18px 4px', fontFamily: 'Quicksand' }}>
      <div style={{
        fontFamily: 'Nunito', fontWeight: 800, fontSize: 22, lineHeight: 1.2,
        color: D.ink, letterSpacing: -0.3,
      }}>Plaza Indonesia · Level 4</div>

      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 12,
        fontSize: 13, fontWeight: 500, color: '#5C5347', lineHeight: 1.45,
      }}>
        <IconLine /> Jl. M.H. Thamrin No.28–30, Jakarta Pusat
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginTop: 8,
        fontSize: 13, fontWeight: 600, color: '#5C5347',
      }}>
        <IconWalk /> <b>220 m</b> dari lokasi Anda
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginTop: 8,
        fontSize: 13, fontWeight: 600, color: closed ? '#5C5347' : D.sage,
      }}>
        <IconClock color={closed ? '#9E948A' : D.sage} />
        08.00 – 22.00 WIB
        {closed && (
          <span style={{
            marginLeft: 'auto', fontSize: 11.5, fontWeight: 700, color: D.roseDk,
            background: D.roseLt, padding: '3px 8px', borderRadius: 99,
          }}>Buka pukul 08.00 besok</span>
        )}
      </div>
    </div>
  );
}

function IconLine() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
      <path d="M12 22s-7-6.2-7-11.5C5 5.4 8.1 2.5 12 2.5s7 2.9 7 7C19 15.8 12 22 12 22z"
        stroke={D.rose} strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="12" cy="9.8" r="2.4" stroke={D.rose} strokeWidth="1.8"/>
    </svg>
  );
}
function IconWalk() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="13" cy="4.5" r="2.2" stroke={D.rose} strokeWidth="1.8"/>
      <path d="M10 22l2-6 3 2 2 4M10 22l-2-5 2-4 3-3-3 0-2 3M15 18l3 2"
        stroke={D.rose} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconClock({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8"/>
      <path d="M12 7v5l3 2" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Rating row
// ─────────────────────────────────────────────────────────────
function RatingRow() {
  return (
    <div style={{
      margin: '14px 18px 0', padding: 14, borderRadius: 16,
      background: '#FBF4ED',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Star /><Star /><Star /><Star /><Star half />
      </div>
      <div>
        <div style={{
          fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, color: D.ink,
        }}>4.8</div>
        <div style={{ fontSize: 11.5, color: '#7C7062', fontWeight: 600 }}>174 ulasan</div>
      </div>
      <div style={{
        marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: D.roseDk,
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        Lihat semua
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke={D.roseDk} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Facility tags row
// ─────────────────────────────────────────────────────────────
function FacilityTag({ label, state = 'available' }) {
  const styles = {
    available: {
      bg: 'rgba(143,175,143,0.18)', fg: '#6B8A6B',
      border: '1px solid rgba(143,175,143,0.3)',
    },
    unavailable: {
      bg: 'rgba(60,40,30,0.05)', fg: '#A8A096',
      border: '1px solid rgba(60,40,30,0.08)',
      strike: true,
    },
    unverified: {
      bg: '#fff', fg: '#8A7268',
      border: '1.5px dashed rgba(60,40,30,0.18)',
    },
  }[state];

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 12px 6px 10px', borderRadius: 99,
      background: styles.bg, color: styles.fg,
      border: styles.border,
      fontFamily: 'Quicksand', fontWeight: 700, fontSize: 12,
      whiteSpace: 'nowrap',
      textDecoration: styles.strike ? 'line-through' : 'none',
    }}>
      {state === 'available' && <CheckGlyph color={styles.fg} />}
      {state === 'unavailable' && <XGlyph color={styles.fg} />}
      {state === 'unverified' && <DotGlyph color={styles.fg} />}
      {label}
    </div>
  );
}
function CheckGlyph({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4 10-10" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function XGlyph({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth="2.6" strokeLinecap="round"/>
    </svg>
  );
}
function DotGlyph({ color }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <circle cx="5" cy="5" r="3" stroke={color} strokeWidth="1.6"/>
    </svg>
  );
}

function FacilityRow({ closed }) {
  // when closed: a couple facilities marked unavailable
  const items = closed ? [
    ['Bersih', 'available'], ['Kulkas', 'unavailable'], ['AC', 'available'],
    ['Stroller', 'available'], ['Wastafel', 'available'], ['Stopkontak', 'unavailable'],
    ['Privasi', 'available'],
  ] : [
    ['Bersih', 'available'], ['Kulkas', 'available'], ['AC', 'available'],
    ['Stroller', 'available'], ['Wastafel', 'available'], ['Stopkontak', 'available'],
    ['Privasi', 'available'],
  ];
  return (
    <div style={{ marginTop: 22, padding: '0 18px' }}>
      <SectionTitle>Fasilitas</SectionTitle>
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
        scrollbarWidth: 'none', margin: '0 -18px', padding: '4px 18px',
      }}>
        {items.map(([l, s]) => (
          <FacilityTag key={l} label={l} state={s} />
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 10,
    }}>
      <div style={{
        fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, color: D.ink,
      }}>{children}</div>
      {action && (
        <div style={{
          fontSize: 12, fontWeight: 700, color: D.roseDk,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {action}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke={D.roseDk} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Latest report card
// ─────────────────────────────────────────────────────────────
function ReportSection() {
  return (
    <div style={{ marginTop: 22, padding: '0 18px' }}>
      <SectionTitle action="Lihat semua">Laporan kondisi terkini</SectionTitle>
      <div style={{
        padding: 14, borderRadius: 16, background: '#FBF4ED',
        border: '1px solid rgba(60,40,30,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar initial="R" />
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'Nunito', fontWeight: 800, fontSize: 13.5, color: D.ink,
            }}>Rina D.</div>
            <div style={{ fontSize: 11.5, color: '#9E948A', fontWeight: 600 }}>
              2 jam lalu · 3 laporan
            </div>
          </div>
          <div style={{
            fontSize: 10, fontWeight: 800, color: D.sage, letterSpacing: 0.4,
            background: 'rgba(143,175,143,0.18)', padding: '4px 8px', borderRadius: 99,
          }}>TERVERIFIKASI</div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
          <FacilityTag label="Bersih" state="available" />
          <FacilityTag label="Kulkas menyala" state="available" />
        </div>
        <div style={{
          marginTop: 12, display: 'flex', gap: 8,
        }}>
          <Thumb />
          <Thumb tone={1} />
        </div>
      </div>
    </div>
  );
}

function Thumb({ tone = 0 }) {
  const grads = [
    'linear-gradient(135deg, #E8A598, #F2C6B8)',
    'linear-gradient(135deg, #C6D8C2, #E2EFD9)',
  ];
  return (
    <div style={{
      width: 64, height: 48, borderRadius: 10,
      background: grads[tone],
      position: 'relative', overflow: 'hidden',
      flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.18), transparent)',
      }} />
    </div>
  );
}

function Avatar({ initial }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 18,
      background: `linear-gradient(140deg, ${D.rose}, #F2C6B8)`,
      color: '#fff', fontFamily: 'Nunito', fontWeight: 900, fontSize: 14,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>{initial}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// Review card
// ─────────────────────────────────────────────────────────────
function ReviewSection() {
  return (
    <div style={{ marginTop: 22, padding: '0 18px' }}>
      <SectionTitle action="Lihat semua">Ulasan pengguna</SectionTitle>
      <div style={{
        padding: 14, borderRadius: 16, background: '#FBF4ED',
        border: '1px solid rgba(60,40,30,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar initial="A" />
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'Nunito', fontWeight: 800, fontSize: 13.5, color: D.ink,
            }}>Ayu Pratiwi</div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, marginTop: 2,
            }}>
              <div style={{ display: 'flex', gap: 1 }}>
                <Star size={11} /><Star size={11} /><Star size={11} /><Star size={11} /><Star size={11} />
              </div>
              <span style={{ fontSize: 11, color: '#9E948A', fontWeight: 600 }}>· 1 minggu lalu</span>
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 10, fontSize: 13, fontFamily: 'Quicksand',
          fontWeight: 500, color: '#5C5347', lineHeight: 1.5,
        }}>
          “Bersih, nyaman, dan privasi terjaga. Staf juga ramah ketika ditanya
          soal lokasi. Wajib mampir kalau bawa bayi ke Plaza Indonesia!”
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom action bar (Check-In + Navigasi)
// ─────────────────────────────────────────────────────────────
function ActionBar({ closed }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 84,
      background: '#fff',
      borderTop: '1px solid rgba(60,40,30,0.06)',
      padding: '12px 14px',
      display: 'flex', gap: 10, zIndex: 7,
      boxShadow: '0 -8px 24px rgba(60,40,30,0.06)',
    }}>
      <button style={{
        flex: 1, height: 48, borderRadius: 24,
        background: '#fff', color: D.roseDk, cursor: 'pointer',
        border: `2px solid ${D.rose}`,
        fontFamily: 'Nunito', fontWeight: 800, fontSize: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 8.5h3.2l1.3-2h7l1.3 2H20A1.5 1.5 0 0 1 21.5 10v7.5A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5V10A1.5 1.5 0 0 1 4 8.5z"
            stroke={D.roseDk} strokeWidth="1.9" strokeLinejoin="round"/>
          <path d="M10 13.5l1.8 1.8L15 12" stroke={D.roseDk} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Check-In
      </button>
      <button disabled={closed} style={{
        flex: 1, height: 48, borderRadius: 24, border: 0,
        background: closed ? '#E6DCD4' : `linear-gradient(140deg, ${D.rose}, ${D.roseDk})`,
        color: closed ? '#9E948A' : '#fff',
        fontFamily: 'Nunito', fontWeight: 800, fontSize: 14,
        cursor: closed ? 'not-allowed' : 'pointer',
        boxShadow: closed ? 'none' : '0 8px 18px rgba(232,165,152,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 11l18-8-8 18-2-8-8-2z"
            stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" fill="none"/>
        </svg>
        Navigasi
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Detail screen full
// ─────────────────────────────────────────────────────────────
function DetailScreen({ closed = false }) {
  const [tab, setTab] = useState(0);
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: D.surface,
      display: 'flex', flexDirection: 'column',
    }}>
      <DetailHeader />

      {/* Scrollable body — starts below status+header */}
      <div style={{
        position: 'absolute', top: 112, left: 0, right: 0,
        bottom: 160, overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        <RoomPhoto closed={closed} />
        <InfoCard closed={closed} />
        <RatingRow />
        <FacilityRow closed={closed} />
        <ReportSection />
        <ReviewSection />
        <div style={{ height: 28 }} />
      </div>

      <ActionBar closed={closed} />
      <NavbarClassic active={tab} onChange={setTab} labelOn={true} />
    </div>
  );
}

// Star helper — reused
function Star({ half, size = 14 }) {
  const id = React.useId();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={id}>
          <stop offset="50%" stopColor={D.rose}/>
          <stop offset="50%" stopColor="#E6D9CE"/>
        </linearGradient>
      </defs>
      <path d="M12 2l3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5L7 14.5 2 9.5l7-1L12 2z"
        fill={half ? `url(#${id})` : D.rose}/>
    </svg>
  );
}

Object.assign(window, {
  DetailScreen, FacilityTag, RoomPhoto,
});
