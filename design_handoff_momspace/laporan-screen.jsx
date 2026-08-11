// MomSpace · Laporan Kondisi (condition report) screen.
// Variants: 'empty' | 'filled' | 'success'

const L = window.C || {
  rose:'#E8A598', roseDk:'#D88B7C', roseLt:'#FBEEEA',
  sage:'#8FAF8F', muted:'#AAB995', surface:'#FEFEFE', ink:'#333727',
};
// Negative state — a warm muted rose (warning), not clinical red
const NEG    = '#C97A6E';
const NEG_BG = 'rgba(201,122,110,0.12)';
const NEG_BD = 'rgba(201,122,110,0.28)';

const POSITIVE_CONDITIONS = [
  { id: 'p1', label: 'Bersih' },
  { id: 'p2', label: 'Kulkas menyala' },
  { id: 'p3', label: 'Ruangan tersedia' },
  { id: 'p4', label: 'Wastafel berfungsi' },
];
const NEGATIVE_CONDITIONS = [
  { id: 'n1', label: 'Kotor' },
  { id: 'n2', label: 'Kulkas mati' },
  { id: 'n3', label: 'Ruangan terkunci' },
  { id: 'n4', label: 'Fasilitas rusak' },
];

// ─────────────────────────────────────────────────────────────
// Condition chip
// ─────────────────────────────────────────────────────────────
function ConditionChip({ label, tone = 'positive', selected, onClick }) {
  const pos = tone === 'positive';
  const styles = selected
    ? pos
      ? { bg: 'rgba(143,175,143,0.18)', fg: '#5C7A5C', bd: 'rgba(143,175,143,0.45)' }
      : { bg: NEG_BG,                    fg: NEG,       bd: NEG_BD }
    : { bg: '#fff', fg: '#7C7062', bd: 'rgba(60,40,30,0.14)' };

  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '10px 12px', borderRadius: 14,
      background: styles.bg, color: styles.fg,
      border: `1.5px solid ${styles.bd}`, cursor: 'pointer',
      fontFamily: 'Quicksand', fontWeight: 700, fontSize: 13,
      textAlign: 'left', width: '100%',
      transition: 'background 150ms, border-color 150ms',
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: 11, flexShrink: 0,
        background: selected ? (pos ? L.sage : NEG) : '#F4ECE3',
        color: selected ? '#fff' : '#A89991',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 150ms',
      }}>
        {pos
          ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          : <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor"
                strokeWidth="3" strokeLinecap="round"/>
            </svg>
        }
      </span>
      <span style={{ flex: 1 }}>{label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Photo upload
// ─────────────────────────────────────────────────────────────
function PhotoUpload({ uploaded }) {
  if (uploaded) {
    return (
      <div style={{
        display: 'flex', gap: 10, alignItems: 'center',
        padding: 10, borderRadius: 16, background: '#FBF4ED',
        border: '1px solid rgba(60,40,30,0.06)',
      }}>
        <div style={{
          width: 70, height: 70, borderRadius: 12, position: 'relative',
          background: 'linear-gradient(140deg, #E8A598, #F2C6B8)',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {/* abstract "photo" — soft scene */}
          <div style={{
            position: 'absolute', left: 6, right: 26, bottom: 6, height: 30,
            borderRadius: '8px 8px 4px 4px',
            background: 'linear-gradient(165deg, #D88B7C, #C76E5F)',
          }} />
          <div style={{
            position: 'absolute', right: 8, bottom: 6, width: 22, height: 40,
            borderRadius: '6px 6px 2px 2px',
            background: 'rgba(143,175,143,0.85)',
          }} />
          <div style={{
            position: 'absolute', top: 6, left: 6, width: 12, height: 12, borderRadius: 99,
            background: 'rgba(255,255,255,0.6)',
          }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Nunito', fontWeight: 800, fontSize: 13, color: L.ink,
          }}>foto-ruangan-01.jpg</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#9E948A', marginTop: 2 }}>
            1.2 MB · diunggah barusan
          </div>
          <button style={{
            marginTop: 6, padding: '4px 10px', borderRadius: 99,
            border: '1px solid rgba(60,40,30,0.12)', background: '#fff',
            fontSize: 11, fontWeight: 700, color: '#7C7062',
            fontFamily: 'Quicksand', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6M14 10v6"
                stroke="#7C7062" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Hapus
          </button>
        </div>
        <button style={{
          width: 30, height: 30, borderRadius: 15,
          background: '#F4ECE3', border: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#7C7062', flexShrink: 0, alignSelf: 'flex-start',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    );
  }
  return (
    <button style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 8, width: '100%', padding: '24px 16px',
      background: '#FBF4ED', borderRadius: 16,
      border: `2px dashed ${L.rose}`, cursor: 'pointer',
      fontFamily: 'Quicksand',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 22, background: L.roseLt,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 8.5h3.2l1.3-2h7l1.3 2H20A1.5 1.5 0 0 1 21.5 10v7.5A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5V10A1.5 1.5 0 0 1 4 8.5z"
            stroke={L.roseDk} strokeWidth="2" strokeLinejoin="round"/>
          <circle cx="12" cy="13.4" r="3.4" stroke={L.roseDk} strokeWidth="2"/>
        </svg>
      </div>
      <div style={{
        fontFamily: 'Nunito', fontWeight: 800, fontSize: 14, color: L.roseDk,
      }}>Tambah foto</div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Notes input
// ─────────────────────────────────────────────────────────────
function NotesInput({ value, max = 200 }) {
  const isEmpty = !value;
  return (
    <div style={{
      position: 'relative', borderRadius: 14,
      background: '#FBF4ED', border: '1px solid rgba(60,40,30,0.08)',
      padding: '12px 14px 28px',
    }}>
      <div style={{
        fontFamily: 'Quicksand', fontWeight: 500, fontSize: 13,
        color: isEmpty ? '#A89991' : L.ink,
        lineHeight: 1.5, minHeight: 56,
      }}>
        {isEmpty ? 'Ceritakan kondisi ruangan secara singkat...' : value}
      </div>
      <div className="mono" style={{
        position: 'absolute', right: 12, bottom: 8,
        fontSize: 10.5, color: '#A89991',
      }}>
        {value ? value.length : 0} / {max}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Reward banner
// ─────────────────────────────────────────────────────────────
function RewardBanner() {
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'center',
      padding: 14, borderRadius: 16, background: L.roseLt,
      border: '1px solid rgba(232,165,152,0.3)',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        background: `linear-gradient(140deg, ${L.rose}, ${L.roseDk})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 6px 12px rgba(232,165,152,0.4)',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5L7 14.5 2 9.5l7-1L12 2z"
            fill="#fff"/>
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'Nunito', fontWeight: 800, fontSize: 13.5, color: L.ink,
          lineHeight: 1.3,
        }}>
          Laporan ini memberi Anda <span style={{ color: L.roseDk }}>+10 poin kontribusi</span>
        </div>
        <div style={{
          fontSize: 11.5, fontWeight: 600, color: '#7C7062', marginTop: 3,
        }}>
          Poin dapat dilihat di halaman Profil
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Submit button
// ─────────────────────────────────────────────────────────────
function SubmitButton({ disabled, label = 'Kirim Laporan' }) {
  return (
    <button disabled={disabled} style={{
      width: '100%', height: 52, borderRadius: 26, border: 0,
      background: disabled ? '#E6DCD4' : `linear-gradient(140deg, ${L.rose}, ${L.roseDk})`,
      color: disabled ? '#9E948A' : '#fff',
      fontFamily: 'Nunito', fontWeight: 800, fontSize: 15,
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: disabled ? 'none' : '0 10px 22px rgba(216,139,124,0.42)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 11l18-8-8 18-2-8-8-2z"
          stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" fill="none"/>
      </svg>
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────
function LaporanHeader() {
  return (
    <div style={{
      position: 'absolute', top: 60, left: 0, right: 0, height: 70,
      background: 'rgba(255,255,255,0.94)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(60,40,30,0.06)',
      display: 'flex', alignItems: 'center', padding: '0 12px', zIndex: 4,
    }}>
      <button style={{
        width: 38, height: 38, borderRadius: 19,
        background: '#FBF6F1', border: 0, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M14 6l-6 6 6 6" stroke={L.ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div style={{ flex: 1, textAlign: 'center', marginRight: 38 }}>
        <div style={{
          fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: L.ink,
        }}>Laporan Kondisi</div>
        <div style={{
          fontFamily: 'Quicksand', fontWeight: 600, fontSize: 11.5,
          color: L.roseDk, marginTop: 2,
        }}>Plaza Indonesia · Level 4</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Form body
// ─────────────────────────────────────────────────────────────
function FormBody({ selected, photoUploaded, notes }) {
  const allChips = [...POSITIVE_CONDITIONS, ...NEGATIVE_CONDITIONS];
  return (
    <div style={{
      position: 'absolute', top: 130, left: 0, right: 0, bottom: 174,
      overflowY: 'auto', padding: '16px 18px',
      fontFamily: 'Quicksand',
    }}>
      <SectionLabel>Kondisi ruang saat ini</SectionLabel>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 22,
      }}>
        {POSITIVE_CONDITIONS.map((c) => (
          <ConditionChip key={c.id} label={c.label} tone="positive"
            selected={selected.includes(c.id)} />
        ))}
        {NEGATIVE_CONDITIONS.map((c) => (
          <ConditionChip key={c.id} label={c.label} tone="negative"
            selected={selected.includes(c.id)} />
        ))}
      </div>

      <SectionLabel>Foto kondisi <span style={{ color: '#9E948A', fontWeight: 600 }}>(opsional)</span></SectionLabel>
      <PhotoUpload uploaded={photoUploaded} />
      <div style={{
        marginTop: 8, marginBottom: 22, fontSize: 11.5, color: '#7C7062', fontWeight: 600,
      }}>
        Foto membantu pengguna lain menilai fasilitas
      </div>

      <SectionLabel>Catatan tambahan <span style={{ color: '#9E948A', fontWeight: 600 }}>(opsional)</span></SectionLabel>
      <NotesInput value={notes} />
      <div style={{ height: 22 }} />

      <RewardBanner />
      <div style={{ height: 18 }} />
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'Nunito', fontWeight: 800, fontSize: 14, color: L.ink,
      marginBottom: 10,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sticky submit bar
// ─────────────────────────────────────────────────────────────
function SubmitBar({ disabled }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 84,
      background: '#fff', padding: '12px 18px 14px',
      borderTop: '1px solid rgba(60,40,30,0.06)',
      boxShadow: '0 -8px 24px rgba(60,40,30,0.06)', zIndex: 7,
    }}>
      <SubmitButton disabled={disabled} />
      <div style={{
        textAlign: 'center', marginTop: 8, fontSize: 11, color: '#9E948A',
        fontFamily: 'Quicksand', fontWeight: 500,
      }}>
        Laporan dikirim dengan timestamp otomatis
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Success screen
// ─────────────────────────────────────────────────────────────
function SuccessScreen() {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: L.surface,
      display: 'flex', flexDirection: 'column',
    }}>
      <LaporanHeader />
      <div style={{
        position: 'absolute', top: 130, left: 0, right: 0, bottom: 88,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '0 28px', textAlign: 'center',
        fontFamily: 'Quicksand',
      }}>
        {/* checkmark */}
        <div style={{ position: 'relative', width: 132, height: 132, marginBottom: 6 }}>
          {/* burst */}
          <div style={{
            position: 'absolute', inset: -8, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(143,175,143,0.16) 0%, transparent 70%)',
            animation: 'momBurst 1.6s ease-out infinite',
          }} />
          {/* ring */}
          <div style={{
            position: 'absolute', inset: 12, borderRadius: '50%',
            border: `2px dashed ${L.sage}`, opacity: 0.4,
            animation: 'momSpin 14s linear infinite',
          }} />
          {/* core circle */}
          <div style={{
            position: 'absolute', inset: 24, borderRadius: '50%',
            background: `linear-gradient(140deg, ${L.sage}, #729D72)`,
            boxShadow: '0 16px 36px rgba(143,175,143,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'momPop 600ms cubic-bezier(.2,1.4,.4,1) both',
          }}>
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.5 4.5L19 7"
                stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"
                style={{
                  strokeDasharray: 30, strokeDashoffset: 30,
                  animation: 'momCheck 450ms 200ms ease-out forwards',
                }}/>
            </svg>
          </div>
          {/* sparkles */}
          <Spark x={-6} y={20} d={0} />
          <Spark x={114} y={32} d={120} />
          <Spark x={6} y={104} d={240} />
        </div>

        <div style={{
          fontFamily: 'Nunito', fontWeight: 900, fontSize: 22, color: L.ink,
          marginTop: 18, letterSpacing: -0.3,
        }}>Terima kasih kontribusinya 🌸</div>
        <div style={{
          fontSize: 13.5, color: '#5C5347', marginTop: 8, lineHeight: 1.5,
          fontWeight: 500, maxWidth: 280,
        }}>
          Laporan Anda membantu ribuan ibu lain menemukan ruang
          laktasi yang aman dan nyaman.
        </div>

        {/* points pill */}
        <div style={{
          marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 16px', borderRadius: 99,
          background: L.roseLt, border: `1px solid rgba(232,165,152,0.35)`,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5L7 14.5 2 9.5l7-1L12 2z" fill={L.roseDk}/>
          </svg>
          <span style={{
            fontFamily: 'Nunito', fontWeight: 900, fontSize: 14, color: L.roseDk,
          }}>+10 poin ditambahkan!</span>
        </div>

        <button style={{
          marginTop: 26, padding: '14px 26px', minWidth: 220,
          borderRadius: 26, border: 0,
          background: `linear-gradient(140deg, ${L.rose}, ${L.roseDk})`,
          color: '#fff', fontFamily: 'Nunito', fontWeight: 800, fontSize: 14,
          cursor: 'pointer',
          boxShadow: '0 10px 22px rgba(216,139,124,0.42)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 21s-7-6.2-7-11.5C5 5.4 8.1 2.5 12 2.5s7 2.9 7 7C19 14.8 12 21 12 21z"
              fill="#fff"/>
            <circle cx="12" cy="9.7" r="2.7" fill={L.roseDk}/>
          </svg>
          Kembali ke Peta
        </button>

        <button style={{
          marginTop: 10, padding: '10px 18px',
          border: 0, background: 'transparent', cursor: 'pointer',
          fontFamily: 'Quicksand', fontWeight: 700, fontSize: 13, color: '#7C7062',
        }}>
          Lihat laporan saya
        </button>
      </div>

      <style>{`
        @keyframes momPop  {
          0% { transform: scale(0.4); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes momCheck { to { stroke-dashoffset: 0; } }
        @keyframes momSpin  { to { transform: rotate(360deg); } }
        @keyframes momBurst {
          0%   { transform: scale(0.8); opacity: 0.0; }
          50%  { opacity: 0.9; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes momTwink {
          0%, 100% { transform: scale(0.5); opacity: 0; }
          50%      { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function Spark({ x, y, d }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: 12, height: 12,
      animation: `momTwink 1.6s ${d}ms ease-in-out infinite`,
    }}>
      <svg viewBox="0 0 24 24" width="12" height="12">
        <path d="M12 2l1.5 8.5L22 12l-8.5 1.5L12 22l-1.5-8.5L2 12l8.5-1.5L12 2z" fill={L.rose}/>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Top-level
// ─────────────────────────────────────────────────────────────
function LaporanScreen({ variant = 'empty' }) {
  const [tab, setTab] = useState(2); // report tab active

  if (variant === 'success') {
    return (
      <>
        <SuccessScreen />
        <NavbarClassic active={2} onChange={() => {}} labelOn={true} />
      </>
    );
  }

  const filled = variant === 'filled';
  const selected = filled ? ['p1', 'p2', 'p3', 'p4'] : [];
  const notes = filled
    ? 'Ruangan bersih dan nyaman, kulkas berfungsi dengan baik. Ada sofa empuk dan privasi terjaga karena pintu bisa dikunci.'
    : '';

  return (
    <div style={{ position: 'absolute', inset: 0, background: L.surface }}>
      <LaporanHeader />
      <FormBody selected={selected} photoUploaded={filled} notes={notes} />
      <SubmitBar disabled={!filled} />
      <NavbarClassic active={tab} onChange={setTab} labelOn={true} />
    </div>
  );
}

Object.assign(window, {
  LaporanScreen, ConditionChip, SubmitButton, NEG, NEG_BG, NEG_BD,
});
