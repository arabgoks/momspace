// MomSpace · Report Hub bottom sheet
// Variants: 'default' | 'pressed' (Card 1 active)

const R = window.C || {
  rose:'#E8A598', roseDk:'#D88B7C', roseLt:'#FBEEEA',
  sage:'#8FAF8F', sageDk:'#6B8A6B', sageLt:'rgba(143,175,143,0.18)',
  muted:'#AAB995', surface:'#FEFEFE', ink:'#333727',
};

// ─────────────────────────────────────────────────────────────
// Card icons
// ─────────────────────────────────────────────────────────────
function ClipboardIcon({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="4" width="14" height="17" rx="2" stroke={color} strokeWidth="2"/>
      <rect x="9" y="2" width="6" height="4" rx="1" stroke={color} strokeWidth="2"/>
      <path d="M8.5 12l1.6 1.6L14 10" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.5 17h7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function PinPlusIcon({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s-7-6.2-7-11.5C5 5.4 8.1 2.5 12 2.5s7 2.9 7 7C19 14.8 12 21 12 21z"
        stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 7v6M9 10h6" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Option card
// ─────────────────────────────────────────────────────────────
function OptionCard({ icon, title, sub, tone, pressed }) {
  const palette = tone === 'rose'
    ? { iconBg: R.roseLt, iconFg: R.roseDk, pressBg: 'rgba(232,165,152,0.10)', pressBd: 'rgba(232,165,152,0.45)' }
    : { iconBg: R.sageLt, iconFg: R.sageDk, pressBg: 'rgba(143,175,143,0.10)', pressBd: 'rgba(143,175,143,0.45)' };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: 16, borderRadius: 18,
      background: pressed ? palette.pressBg : '#FBF6F1',
      border: `1.5px solid ${pressed ? palette.pressBd : 'rgba(60,40,30,0.05)'}`,
      transform: pressed ? 'scale(0.985)' : 'scale(1)',
      boxShadow: pressed
        ? `0 8px 20px ${tone === 'rose' ? 'rgba(232,165,152,0.22)' : 'rgba(143,175,143,0.22)'}`
        : '0 1px 0 rgba(60,40,30,0.03)',
      transition: 'all 180ms cubic-bezier(.2,.8,.2,1)',
      cursor: 'pointer',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
        background: palette.iconBg, color: palette.iconFg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: pressed
          ? `inset 0 0 0 1.5px ${palette.iconFg}25`
          : 'none',
        transition: 'box-shadow 180ms',
      }}>
        {icon(palette.iconFg)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, color: R.ink,
          lineHeight: 1.3, letterSpacing: -0.1,
        }}>{title}</div>
        <div style={{
          fontFamily: 'Quicksand', fontWeight: 600, fontSize: 12, color: '#7C7062',
          marginTop: 4, lineHeight: 1.4,
        }}>{sub}</div>
      </div>
      <div style={{
        width: 28, height: 28, borderRadius: 14, flexShrink: 0,
        background: pressed ? palette.iconFg : '#fff',
        color:      pressed ? '#fff' : palette.iconFg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: pressed ? 'none' : '0 2px 6px rgba(60,40,30,0.08)',
        transition: 'background 180ms, color 180ms',
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Backdrop — blurred + dimmed Home Map
// ─────────────────────────────────────────────────────────────
function Backdrop() {
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0,
        filter: 'blur(6px) saturate(0.85)',
      }}>
        <HomeMapScreen sheetVariant="empty" />
      </div>
      {/* dimmer */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(51,55,39,0.18) 0%, rgba(51,55,39,0.42) 100%)',
        pointerEvents: 'none',
      }} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// The bottom sheet
// ─────────────────────────────────────────────────────────────
function ReportHubSheet({ pressed = false, navHeight = 84 }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: navHeight,
      background: R.surface,
      borderTopLeftRadius: 28, borderTopRightRadius: 28,
      boxShadow: '0 -22px 50px rgba(60,40,30,0.22), 0 -1px 0 rgba(60,40,30,0.04)',
      paddingTop: 10, paddingBottom: 18,
      zIndex: 10, fontFamily: 'Quicksand',
      animation: 'momSheetIn 360ms cubic-bezier(.2,.9,.25,1) both',
    }}>
      {/* drag handle */}
      <div style={{
        width: 44, height: 5, borderRadius: 3, background: '#E2D5C9',
        margin: '0 auto 14px',
      }} />

      {/* Title block */}
      <div style={{ padding: '0 24px 18px' }}>
        <div style={{
          fontFamily: 'Nunito', fontWeight: 900, fontSize: 20, color: R.ink,
          letterSpacing: -0.3,
        }}>Kontribusi Data</div>
        <div style={{
          fontFamily: 'Quicksand', fontWeight: 600, fontSize: 12.5,
          color: R.muted, marginTop: 4, lineHeight: 1.45,
        }}>Pilih jenis kontribusi yang ingin kamu berikan</div>
      </div>

      {/* Option cards */}
      <div style={{
        padding: '0 18px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <OptionCard
          icon={(c) => <ClipboardIcon color={c} />}
          title="Laporkan Kondisi Ruang"
          sub="Bagikan kondisi terkini ruang laktasi yang baru kamu kunjungi"
          tone="rose"
          pressed={pressed}
        />
        <OptionCard
          icon={(c) => <PinPlusIcon color={c} />}
          title="Tambah Lokasi Baru"
          sub="Usulkan ruang laktasi yang belum terdaftar di MomSpace"
          tone="sage"
          pressed={false}
        />
      </div>

      {/* Reward inline note */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, marginTop: 18, padding: '0 24px',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5L7 14.5 2 9.5l7-1L12 2z" fill={R.rose}/>
        </svg>
        <span style={{
          fontFamily: 'Quicksand', fontWeight: 700, fontSize: 12, color: '#7C7062',
        }}>
          Setiap kontribusi memberi kamu{' '}
          <span style={{ color: R.roseDk, fontFamily: 'Nunito', fontWeight: 800 }}>
            +10 poin reward
          </span>
        </span>
      </div>

      {/* Cancel */}
      <div style={{
        textAlign: 'center', marginTop: 14,
        paddingTop: 14, borderTop: '1px solid rgba(60,40,30,0.06)',
        marginLeft: 24, marginRight: 24,
      }}>
        <button style={{
          background: 'transparent', border: 0, cursor: 'pointer',
          fontFamily: 'Nunito', fontWeight: 800, fontSize: 13,
          color: '#9E948A', padding: '6px 12px',
        }}>Batal</button>
      </div>

      <style>{`
        @keyframes momSheetIn {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Full screen — backdrop + sheet + navbar
// ─────────────────────────────────────────────────────────────
function ReportHubScreen({ pressed = false }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000' }}>
      <Backdrop />
      <ReportHubSheet pressed={pressed} />
      <NavbarClassic active={2} onChange={() => {}} labelOn={true} />
    </div>
  );
}

Object.assign(window, {
  ReportHubScreen, ReportHubSheet, OptionCard,
  ClipboardIcon, PinPlusIcon,
});
