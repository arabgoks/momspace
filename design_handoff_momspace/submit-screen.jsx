// MomSpace · Submit Lokasi Baru
// Variants: 'empty' | 'filled' | 'success' + admin verification card

const S = window.C || {
  rose:'#E8A598', roseDk:'#D88B7C', roseLt:'#FBEEEA',
  sage:'#8FAF8F', sageDk:'#6B8A6B', muted:'#AAB995',
  surface:'#FEFEFE', ink:'#333727',
};
const AMBER    = '#D9982A';
const AMBER_BG = 'rgba(217,152,42,0.14)';
const AMBER_BD = 'rgba(217,152,42,0.32)';

const CATEGORIES = [
  { id: 'mall',     label: 'Pusat Perbelanjaan', icon: 'mall'     },
  { id: 'station',  label: 'Stasiun / Terminal',  icon: 'station'  },
  { id: 'hospital', label: 'Rumah Sakit / Klinik',icon: 'hospital' },
  { id: 'office',   label: 'Perkantoran',         icon: 'office'   },
  { id: 'park',     label: 'Taman Kota',          icon: 'park'     },
  { id: 'other',    label: 'Lainnya',             icon: 'other'    },
];
const FACILITY_OPTIONS = [
  'Kulkas', 'Wastafel', 'Stopkontak', 'AC',
  'Stroller friendly', 'Privasi', 'Kursi menyusui', 'Cermin',
];

// ─────────────────────────────────────────────────────────────
// Category icons
// ─────────────────────────────────────────────────────────────
function CatIcon({ kind, color = '#7C7062' }) {
  const c = { stroke: color, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'mall':     return <svg width="16" height="16" viewBox="0 0 24 24" {...c}><path d="M3 8h18l-1.5 12H4.5L3 8z"/><path d="M8 8V6a4 4 0 018 0v2"/></svg>;
    case 'station':  return <svg width="16" height="16" viewBox="0 0 24 24" {...c}><rect x="5" y="3" width="14" height="14" rx="2"/><path d="M5 11h14M9 17l-2 4M15 17l2 4"/><circle cx="9" cy="14" r="0.6" fill={color} stroke="none"/><circle cx="15" cy="14" r="0.6" fill={color} stroke="none"/></svg>;
    case 'hospital': return <svg width="16" height="16" viewBox="0 0 24 24" {...c}><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 8v8M8 12h8"/></svg>;
    case 'office':   return <svg width="16" height="16" viewBox="0 0 24 24" {...c}><path d="M4 21V5l8-2v18M12 21V8l8 2v11M4 21h16M8 9v0M8 13v0M8 17v0M16 14v0M16 17v0"/></svg>;
    case 'park':     return <svg width="16" height="16" viewBox="0 0 24 24" {...c}><path d="M12 3l5 8h-3l4 6H6l4-6H7l5-8z"/><path d="M12 17v4"/></svg>;
    default:         return <svg width="16" height="16" viewBox="0 0 24 24" {...c}><circle cx="12" cy="12" r="9"/><path d="M9 9.5a3 3 0 016 .5c0 1.5-1.5 2-2 2.5s-1 1-1 2"/><circle cx="12" cy="17.5" r="0.6" fill={color} stroke="none"/></svg>;
  }
}

// ─────────────────────────────────────────────────────────────
// Field card chrome
// ─────────────────────────────────────────────────────────────
function FieldGroup({ children, title }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div className="mono" style={{
        fontSize: 10.5, color: '#A89991', textTransform: 'uppercase',
        letterSpacing: 1.2, marginBottom: 12, fontWeight: 600,
        paddingLeft: 4,
      }}>{title}</div>
      <div style={{
        background: '#FBF6F1', borderRadius: 18,
        border: '1px solid rgba(60,40,30,0.06)',
        padding: 14,
      }}>{children}</div>
    </div>
  );
}

function Field({ label, required, hint, children, divider = true }) {
  return (
    <div style={{
      padding: '10px 0',
      borderTop: divider ? '1px solid rgba(60,40,30,0.06)' : 'none',
    }}>
      <div style={{
        fontFamily: 'Nunito', fontWeight: 800, fontSize: 13, color: S.ink,
        marginBottom: 8,
      }}>
        {label}
        {required && <span style={{ color: S.roseDk }}> *</span>}
      </div>
      {children}
      {hint && (
        <div style={{
          fontFamily: 'Quicksand', fontWeight: 500, fontSize: 11, color: '#9E948A',
          marginTop: 6,
        }}>{hint}</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Text input (display-only — shows value or placeholder)
// ─────────────────────────────────────────────────────────────
function TextField({ value, placeholder, icon }) {
  const empty = !value;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 14px', borderRadius: 12,
      background: '#fff', border: '1px solid rgba(60,40,30,0.1)',
      fontFamily: 'Quicksand', fontWeight: 600, fontSize: 13,
      color: empty ? '#A89991' : S.ink,
    }}>
      {icon}
      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value || placeholder}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Map picker (collapsible — when "filled", show the picked map)
// ─────────────────────────────────────────────────────────────
function MapPicker({ picked }) {
  if (!picked) {
    return (
      <button style={{
        width: '100%', padding: '12px 14px', borderRadius: 12,
        background: '#fff', border: `1.5px dashed ${S.sage}`,
        cursor: 'pointer', color: S.sageDk,
        fontFamily: 'Nunito', fontWeight: 800, fontSize: 13,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 21s-7-6.2-7-11.5C5 5.4 8.1 2.5 12 2.5s7 2.9 7 7C19 14.8 12 21 12 21z"
            stroke={S.sageDk} strokeWidth="2" strokeLinejoin="round"/>
          <circle cx="12" cy="9.7" r="2.6" stroke={S.sageDk} strokeWidth="2"/>
        </svg>
        Pilih di peta
      </button>
    );
  }
  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden',
      border: '1px solid rgba(60,40,30,0.1)',
    }}>
      <div style={{
        position: 'relative', height: 110,
        background: 'linear-gradient(135deg, #F4E8DA, #EFD9C4)',
      }}>
        {/* abstract map */}
        <svg viewBox="0 0 320 110" preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path d="M-20 38 Q80 28 160 38 T340 38" stroke="#fff" strokeWidth="14" fill="none" strokeLinecap="round"/>
          <path d="M-20 72 Q120 64 220 72 T340 72" stroke="#fff" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M160 -20 V130" stroke="#fff" strokeWidth="14" strokeLinecap="round"/>
          <ellipse cx="60" cy="30" rx="40" ry="22" fill="rgba(143,175,143,0.6)"/>
          <rect x="200" y="80" width="60" height="20" rx="4" fill="rgba(240,224,204,0.9)"/>
        </svg>
        {/* draggable pin */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -100%)',
          filter: 'drop-shadow(0 4px 8px rgba(216,139,124,0.45))',
        }}>
          <svg width="28" height="36" viewBox="0 0 28 36">
            <path d="M14 1.5C7.1 1.5 1.5 7 1.5 13.8c0 9.7 12.5 20.7 12.5 20.7s12.5-11 12.5-20.7C26.5 7 20.9 1.5 14 1.5z"
              fill={S.roseDk} stroke="#fff" strokeWidth="2.5"/>
            <circle cx="14" cy="13.5" r="4.4" fill="#fff"/>
          </svg>
        </div>
        <div style={{
          position: 'absolute', bottom: 6, left: 6, padding: '3px 8px',
          borderRadius: 99, background: 'rgba(51,55,39,0.7)',
          color: '#fff', fontFamily: 'Nunito', fontWeight: 800, fontSize: 9.5,
          letterSpacing: 0.4,
        }}>SERET PIN</div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', background: '#fff',
      }}>
        <div className="mono" style={{ fontSize: 10.5, color: '#7C7062' }}>
          −6.1944° LS, 106.8229° BT
        </div>
        <button style={{
          background: 'transparent', border: 0, cursor: 'pointer',
          color: S.roseDk, fontFamily: 'Nunito', fontWeight: 800, fontSize: 11,
        }}>Ubah</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Category chip select
// ─────────────────────────────────────────────────────────────
function CategoryGrid({ value }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8,
    }}>
      {CATEGORIES.map((c) => {
        const on = c.id === value;
        return (
          <button key={c.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px', borderRadius: 12,
            background: on ? S.roseLt : '#fff',
            border: `1.5px solid ${on ? S.rose : 'rgba(60,40,30,0.12)'}`,
            cursor: 'pointer', textAlign: 'left',
            fontFamily: 'Quicksand', fontWeight: 700, fontSize: 12,
            color: on ? S.roseDk : '#5C5347',
          }}>
            <CatIcon kind={c.icon} color={on ? S.roseDk : '#7C7062'} />
            <span style={{ flex: 1, lineHeight: 1.2 }}>{c.label}</span>
            {on && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="9" fill={S.roseDk}/>
                <path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Facility multi-select chips
// ─────────────────────────────────────────────────────────────
function FacilityChipGrid({ selected }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {FACILITY_OPTIONS.map((f) => {
        const on = selected.includes(f);
        return (
          <button key={f} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px 6px 10px', borderRadius: 99,
            background: on ? 'rgba(143,175,143,0.18)' : '#fff',
            color:      on ? S.sageDk : '#7C7062',
            border: `1.5px solid ${on ? 'rgba(143,175,143,0.4)' : 'rgba(60,40,30,0.14)'}`,
            cursor: 'pointer', whiteSpace: 'nowrap',
            fontFamily: 'Quicksand', fontWeight: 700, fontSize: 11.5,
          }}>
            {on
              ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4 10-10" stroke={S.sageDk} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              : <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="#A89991" strokeWidth="2.6" strokeLinecap="round"/>
                </svg>}
            {f}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Photo upload (multi)
// ─────────────────────────────────────────────────────────────
function PhotoUploader({ uploaded }) {
  if (!uploaded) {
    return (
      <button style={{
        width: '100%', padding: '20px 16px',
        background: '#fff', borderRadius: 14,
        border: `2px dashed ${S.rose}`, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 20, background: S.roseLt,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 8.5h3.2l1.3-2h7l1.3 2H20A1.5 1.5 0 0 1 21.5 10v7.5A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5V10A1.5 1.5 0 0 1 4 8.5z"
              stroke={S.roseDk} strokeWidth="2" strokeLinejoin="round"/>
            <circle cx="12" cy="13.4" r="3.4" stroke={S.roseDk} strokeWidth="2"/>
          </svg>
        </div>
        <div style={{
          fontFamily: 'Nunito', fontWeight: 800, fontSize: 13, color: S.roseDk,
        }}>Tambah foto (maks. 3 foto)</div>
      </button>
    );
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      <PhotoTile tone={0} />
      <PhotoTile tone={1} />
      <AddPhotoTile />
    </div>
  );
}
function PhotoTile({ tone }) {
  const grads = [
    'linear-gradient(140deg, #E8A598, #F2C6B8)',
    'linear-gradient(140deg, #C6D8C2, #E2EFD9)',
  ];
  return (
    <div style={{
      position: 'relative', borderRadius: 12, overflow: 'hidden',
      aspectRatio: '1 / 1', background: grads[tone],
    }}>
      {/* abstract "photo" content */}
      <div style={{
        position: 'absolute', left: 8, right: 22, bottom: 8, height: 32,
        borderRadius: '6px 6px 2px 2px',
        background: tone === 0 ? 'rgba(216,139,124,0.85)' : 'rgba(107,138,107,0.85)',
      }} />
      <div style={{
        position: 'absolute', top: 8, left: 8, width: 12, height: 12, borderRadius: 99,
        background: 'rgba(255,255,255,0.65)',
      }} />
      <button style={{
        position: 'absolute', top: 4, right: 4,
        width: 22, height: 22, borderRadius: 11,
        background: 'rgba(51,55,39,0.75)', color: '#fff', border: 0, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
function AddPhotoTile() {
  return (
    <button style={{
      borderRadius: 12, aspectRatio: '1 / 1',
      background: '#fff', border: `2px dashed ${S.rose}`,
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: S.roseDk,
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" stroke={S.roseDk} strokeWidth="2.6" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Time picker pair
// ─────────────────────────────────────────────────────────────
function TimeRange({ open, close }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <TimeBox value={open}  label="Buka" />
      <span style={{ color: '#A89991', fontWeight: 700 }}>→</span>
      <TimeBox value={close} label="Tutup" />
      <span style={{
        fontFamily: 'Quicksand', fontWeight: 700, fontSize: 11, color: '#7C7062',
        marginLeft: 'auto',
      }}>WIB</span>
    </div>
  );
}
function TimeBox({ value, label }) {
  return (
    <div style={{
      flex: 1, padding: '8px 12px', borderRadius: 10,
      background: '#fff', border: '1px solid rgba(60,40,30,0.1)',
    }}>
      <div className="mono" style={{ fontSize: 9.5, color: '#A89991', letterSpacing: 0.4, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'Nunito', fontWeight: 800, fontSize: 14, color: value ? S.ink : '#A89991',
        marginTop: 1,
      }}>{value || '--.--'}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Notes
// ─────────────────────────────────────────────────────────────
function NotesField({ value, max = 200 }) {
  const empty = !value;
  return (
    <div style={{
      position: 'relative', borderRadius: 12,
      background: '#fff', border: '1px solid rgba(60,40,30,0.1)',
      padding: '10px 12px 26px',
    }}>
      <div style={{
        fontFamily: 'Quicksand', fontWeight: 500, fontSize: 12.5,
        color: empty ? '#A89991' : S.ink,
        minHeight: 44, lineHeight: 1.5,
      }}>
        {value || 'Informasi lain yang perlu diketahui...'}
      </div>
      <div className="mono" style={{
        position: 'absolute', right: 10, bottom: 6,
        fontSize: 10, color: '#A89991',
      }}>{value ? value.length : 0} / {max}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Info banner
// ─────────────────────────────────────────────────────────────
function InfoBanner() {
  return (
    <div style={{
      display: 'flex', gap: 12, padding: 14, borderRadius: 16,
      background: S.roseLt, border: '1px solid rgba(232,165,152,0.32)',
      marginBottom: 22,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 16, flexShrink: 0,
        background: '#fff', color: S.roseDk,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(232,165,152,0.3)',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="7.5" r="1" fill="currentColor"/>
        </svg>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: 'Nunito', fontWeight: 800, fontSize: 12.5, color: S.ink,
          lineHeight: 1.4,
        }}>
          Lokasi yang kamu tambahkan akan diverifikasi oleh tim MomSpace sebelum
          ditampilkan kepada pengguna lain.
        </div>
        <div style={{
          fontFamily: 'Quicksand', fontWeight: 600, fontSize: 11, color: '#7C7062',
          marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 5,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#7C7062" strokeWidth="2"/>
            <path d="M12 7v5l3 2" stroke="#7C7062" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Proses verifikasi maksimal 2 × 24 jam
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────
function SubmitHeader() {
  return (
    <div style={{
      position: 'absolute', top: 60, left: 0, right: 0, height: 52,
      background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(60,40,30,0.06)',
      display: 'flex', alignItems: 'center', padding: '0 12px', zIndex: 4,
    }}>
      <button style={{
        width: 38, height: 38, borderRadius: 19,
        background: '#FBF6F1', border: 0, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M14 6l-6 6 6 6" stroke={S.ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div style={{
        flex: 1, textAlign: 'center', marginRight: 38,
        fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: S.ink,
      }}>Tambah Lokasi Baru</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Form body
// ─────────────────────────────────────────────────────────────
function FormBody({ filled }) {
  const name    = filled ? 'Plaza Indonesia · Level 4' : '';
  const addr    = filled ? 'Jl. M.H. Thamrin No.28–30, Jakarta Pusat' : '';
  const cat     = filled ? 'mall' : null;
  const facs    = filled ? ['Kulkas', 'Wastafel', 'AC', 'Privasi', 'Kursi menyusui'] : [];
  const open    = filled ? '08.00' : '';
  const close   = filled ? '22.00' : '';
  const notes   = filled
    ? 'Letaknya di pojok kanan dekat eskalator utama. Pintu dapat dikunci dari dalam dan ada nurse pad gratis di rak bawah.'
    : '';

  return (
    <div style={{
      position: 'absolute', top: 112, left: 0, right: 0, bottom: 168,
      overflowY: 'auto', padding: '18px 18px 4px',
      fontFamily: 'Quicksand',
    }}>
      <InfoBanner />

      <FieldGroup title="Informasi dasar">
        <Field label="Nama lokasi" required divider={false}>
          <TextField value={name} placeholder="cth. Plaza Indonesia · Level 4" />
        </Field>
        <Field label="Alamat lengkap" required>
          <TextField value={addr} placeholder="Jl. M.H. Thamrin No.28–30, Jakarta Pusat" />
        </Field>
        <Field label="Titik di peta" required hint="Geser pin untuk titik yang lebih akurat">
          <MapPicker picked={filled} />
        </Field>
        <Field label="Kategori lokasi" required>
          <CategoryGrid value={cat} />
        </Field>
      </FieldGroup>

      <FieldGroup title="Fasilitas yang tersedia">
        <Field label="Centang yang kamu lihat tersedia" divider={false}
          hint="Tim verifikasi akan memeriksa kembali di lapangan">
          <FacilityChipGrid selected={facs} />
        </Field>
      </FieldGroup>

      <FieldGroup title="Foto lokasi">
        <Field label="Unggah foto" divider={false}
          hint="Foto membantu tim verifikasi memastikan keberadaan ruang laktasi">
          <PhotoUploader uploaded={filled} />
        </Field>
      </FieldGroup>

      <FieldGroup title="Informasi tambahan">
        <Field label="Jam operasional" divider={false}>
          <TimeRange open={open} close={close} />
        </Field>
        <Field label="Catatan tambahan" hint="Opsional · maksimum 200 karakter">
          <NotesField value={notes} />
        </Field>
      </FieldGroup>

      <div style={{ height: 8 }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sticky submit bar
// ─────────────────────────────────────────────────────────────
function SubmitBar({ disabled }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 84,
      background: '#fff', borderTop: '1px solid rgba(60,40,30,0.06)',
      padding: '12px 18px 14px',
      boxShadow: '0 -8px 24px rgba(60,40,30,0.06)', zIndex: 7,
    }}>
      <button disabled={disabled} style={{
        width: '100%', height: 52, borderRadius: 26, border: 0,
        background: disabled ? '#E6DCD4' : `linear-gradient(140deg, ${S.rose}, ${S.roseDk})`,
        color: disabled ? '#9E948A' : '#fff',
        fontFamily: 'Nunito', fontWeight: 800, fontSize: 14.5,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : '0 10px 22px rgba(216,139,124,0.42)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 11l18-8-8 18-2-8-8-2z"
            stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" fill="none"/>
        </svg>
        Kirim untuk Diverifikasi
      </button>
      <div style={{
        textAlign: 'center', marginTop: 8,
        fontFamily: 'Quicksand', fontWeight: 600, fontSize: 11, color: '#9E948A',
      }}>
        <span style={{ color: S.roseDk }}>*</span> Wajib diisi
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pending success screen
// ─────────────────────────────────────────────────────────────
function PendingScreen() {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: S.surface,
      display: 'flex', flexDirection: 'column',
    }}>
      <SubmitHeader />
      <div style={{
        position: 'absolute', top: 112, left: 0, right: 0, bottom: 88,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '0 28px', textAlign: 'center',
        fontFamily: 'Quicksand',
      }}>
        {/* hourglass illustration */}
        <div style={{ position: 'relative', width: 140, height: 140, marginBottom: 10 }}>
          {/* halo */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,165,152,0.22) 0%, transparent 70%)',
          }} />
          {/* outer dashed ring (rotates slowly) */}
          <div style={{
            position: 'absolute', inset: 14, borderRadius: '50%',
            border: `2px dashed ${S.rose}`, opacity: 0.5,
            animation: 'momSpin 12s linear infinite',
          }} />
          {/* core circle */}
          <div style={{
            position: 'absolute', inset: 30, borderRadius: '50%',
            background: `linear-gradient(140deg, ${S.rose}, ${S.roseDk})`,
            boxShadow: '0 14px 32px rgba(216,139,124,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <HourglassIcon />
          </div>
          {/* sparkles */}
          <Sprk x={4}   y={20}  d={0} />
          <Sprk x={118} y={32}  d={140} />
          <Sprk x={14}  y={110} d={260} />
        </div>

        <div style={{
          fontFamily: 'Nunito', fontWeight: 900, fontSize: 22, color: S.ink,
          marginTop: 20, letterSpacing: -0.3,
        }}>Lokasi berhasil dikirim!</div>

        <div style={{
          marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '7px 14px', borderRadius: 99,
          background: AMBER_BG, border: `1px solid ${AMBER_BD}`,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: 99, background: AMBER,
            boxShadow: `0 0 0 3px ${AMBER_BG}`,
          }} />
          <span style={{
            fontFamily: 'Nunito', fontWeight: 800, fontSize: 12, color: AMBER,
          }}>Menunggu verifikasi</span>
        </div>

        <div style={{
          fontSize: 13.5, color: '#5C5347', marginTop: 18, lineHeight: 1.55,
          fontWeight: 500, maxWidth: 290,
        }}>
          Usulan kamu sedang ditinjau tim MomSpace. Kami akan memberi tahu kamu
          setelah lokasi disetujui — biasanya dalam <b style={{ color: S.ink, fontFamily: 'Nunito', fontWeight: 800 }}>2 × 24 jam</b>.
        </div>

        <button style={{
          marginTop: 26, padding: '14px 26px', minWidth: 220,
          borderRadius: 26, border: 0,
          background: `linear-gradient(140deg, ${S.rose}, ${S.roseDk})`,
          color: '#fff', fontFamily: 'Nunito', fontWeight: 800, fontSize: 14,
          cursor: 'pointer',
          boxShadow: '0 10px 22px rgba(216,139,124,0.42)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 21s-7-6.2-7-11.5C5 5.4 8.1 2.5 12 2.5s7 2.9 7 7C19 14.8 12 21 12 21z" fill="#fff"/>
            <circle cx="12" cy="9.7" r="2.7" fill={S.roseDk}/>
          </svg>
          Kembali ke Peta
        </button>

        <button style={{
          marginTop: 10, padding: '10px 18px',
          border: 0, background: 'transparent', cursor: 'pointer',
          fontFamily: 'Quicksand', fontWeight: 700, fontSize: 13, color: '#7C7062',
          textDecoration: 'underline', textDecorationColor: 'rgba(124,112,98,0.4)',
          textUnderlineOffset: 3,
        }}>
          Lihat status pengajuan di Profil
        </button>
      </div>

      <style>{`
        @keyframes momSpin { to { transform: rotate(360deg); } }
        @keyframes momHourglass {
          0%, 45%   { transform: rotate(0deg); }
          50%, 95%  { transform: rotate(180deg); }
          100%      { transform: rotate(360deg); }
        }
        @keyframes momTwink {
          0%, 100% { transform: scale(0.5); opacity: 0; }
          50%      { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function HourglassIcon() {
  return (
    <div style={{
      width: 56, height: 56,
      animation: 'momHourglass 4s ease-in-out infinite',
    }}>
      <svg viewBox="0 0 24 24" width="56" height="56" fill="none">
        <path d="M6 3h12M6 21h12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
        <path d="M7 3v3c0 3 3 4.5 5 6 2-1.5 5-3 5-6V3M7 21v-3c0-3 3-4.5 5-6 2 1.5 5 3 5 6v3"
          stroke="#fff" strokeWidth="2.4" strokeLinejoin="round"/>
        <path d="M9 6.5h6M9 17.5h6" stroke="#fff" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function Sprk({ x, y, d }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: 12, height: 12,
      animation: `momTwink 1.6s ${d}ms ease-in-out infinite`,
    }}>
      <svg viewBox="0 0 24 24" width="12" height="12">
        <path d="M12 2l1.5 8.5L22 12l-8.5 1.5L12 22l-1.5-8.5L2 12l8.5-1.5L12 2z" fill={S.rose}/>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Top-level submit screen
// ─────────────────────────────────────────────────────────────
function SubmitScreen({ variant = 'empty' }) {
  const [tab, setTab] = useState(2); // came from Report tab
  if (variant === 'success') {
    return (
      <>
        <PendingScreen />
        <NavbarClassic active={tab} onChange={setTab} labelOn={true} />
      </>
    );
  }
  const filled = variant === 'filled';
  return (
    <div style={{ position: 'absolute', inset: 0, background: S.surface }}>
      <SubmitHeader />
      <FormBody filled={filled} />
      <SubmitBar disabled={!filled} />
      <NavbarClassic active={tab} onChange={setTab} labelOn={true} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Admin verification card (sits in the gov dashboard)
// ─────────────────────────────────────────────────────────────
function AdminVerificationCard() {
  return (
    <div style={{
      width: 440, padding: 18, borderRadius: 18,
      background: '#fff', border: '1px solid rgba(60,40,30,0.06)',
      boxShadow: '0 8px 24px rgba(60,40,30,0.06)',
      fontFamily: 'Quicksand',
    }}>
      {/* Header row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 14,
      }}>
        <div className="mono" style={{
          fontSize: 10, color: '#A89991', textTransform: 'uppercase',
          letterSpacing: 1.2, fontWeight: 600,
        }}>PENDING SUBMISSION · #2046</div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 99,
          background: AMBER_BG, border: `1px solid ${AMBER_BD}`,
          color: AMBER,
          fontFamily: 'Nunito', fontWeight: 800, fontSize: 11,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Pending verifikasi
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', gap: 14 }}>
        <div style={{
          width: 84, height: 84, borderRadius: 14, flexShrink: 0,
          background: `linear-gradient(140deg, ${S.rose}, ${S.roseDk})`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', left: 10, right: 28, bottom: 10, height: 38,
            borderRadius: '8px 8px 4px 4px', background: 'rgba(216,139,124,0.9)',
          }} />
          <div style={{
            position: 'absolute', right: 12, bottom: 10, width: 22, height: 50,
            borderRadius: '6px 6px 2px 2px', background: 'rgba(143,175,143,0.85)',
          }} />
          <div style={{
            position: 'absolute', top: 8, left: 8, width: 12, height: 12, borderRadius: 99,
            background: 'rgba(255,255,255,0.65)',
          }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4,
          }}>
            <CatIcon kind="mall" color={S.sageDk} />
            <span className="mono" style={{
              fontSize: 9.5, color: S.sageDk, textTransform: 'uppercase',
              letterSpacing: 1, fontWeight: 700,
            }}>PUSAT PERBELANJAAN</span>
          </div>
          <div style={{
            fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, color: S.ink,
            lineHeight: 1.25,
          }}>Plaza Indonesia · Level 4</div>
          <div style={{
            fontSize: 11.5, color: '#7C7062', fontWeight: 600, marginTop: 4,
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s-7-6.2-7-11.5C5 5.4 8.1 2.5 12 2.5s7 2.9 7 7C19 14.8 12 21 12 21z"
                stroke="#7C7062" strokeWidth="1.8" strokeLinejoin="round"/>
              <circle cx="12" cy="9.7" r="2.3" stroke="#7C7062" strokeWidth="1.8"/>
            </svg>
            Jl. M.H. Thamrin No.28–30, Jakarta Pusat
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginTop: 8,
            paddingTop: 8, borderTop: '1px dashed rgba(60,40,30,0.1)',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 11, flexShrink: 0,
              background: `linear-gradient(140deg, ${S.sage}, ${S.sageDk})`,
              color: '#fff', fontFamily: 'Nunito', fontWeight: 900, fontSize: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>RD</div>
            <div style={{ fontSize: 11.5, color: '#5C5347', fontWeight: 600 }}>
              Diajukan oleh <b style={{ color: S.ink, fontFamily: 'Nunito', fontWeight: 800 }}>@rina_d</b>
            </div>
            <div style={{
              marginLeft: 'auto', fontSize: 10.5, color: '#9E948A', fontWeight: 600,
            }}>2 jam lalu</div>
          </div>
        </div>
      </div>

      {/* Facility preview */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12,
        paddingTop: 12, borderTop: '1px dashed rgba(60,40,30,0.1)',
      }}>
        {['Kulkas', 'Wastafel', 'AC', 'Privasi', 'Kursi menyusui'].map((f) => (
          <span key={f} style={{
            fontSize: 10.5, fontWeight: 700, fontFamily: 'Quicksand',
            color: S.sageDk, background: 'rgba(143,175,143,0.16)',
            padding: '3px 8px', borderRadius: 99,
          }}>{f}</span>
        ))}
        <span style={{
          fontSize: 10.5, fontWeight: 700, color: '#9E948A',
          padding: '3px 6px',
        }}>+2 lainnya</span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button style={{
          flex: 1, padding: '10px', borderRadius: 12, border: 0,
          background: `linear-gradient(140deg, ${S.sage}, ${S.sageDk})`,
          color: '#fff', cursor: 'pointer',
          fontFamily: 'Nunito', fontWeight: 800, fontSize: 12.5,
          boxShadow: '0 6px 14px rgba(143,175,143,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Setujui
        </button>
        <button style={{
          flex: 1, padding: '10px', borderRadius: 12,
          background: '#fff', color: S.roseDp,
          border: `1.5px solid ${S.rose}`, cursor: 'pointer',
          fontFamily: 'Nunito', fontWeight: 800, fontSize: 12.5,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke={S.roseDp} strokeWidth="2.6" strokeLinecap="round"/>
          </svg>
          Tolak
        </button>
        <button style={{
          padding: '10px 12px', borderRadius: 12,
          background: '#FBF6F1', color: '#5C5347',
          border: '1px solid rgba(60,40,30,0.08)', cursor: 'pointer',
          fontFamily: 'Nunito', fontWeight: 800, fontSize: 12.5,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          Detail
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="#5C5347" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Admin queue panel (multiple cards stacked, for context)
// ─────────────────────────────────────────────────────────────
function AdminQueuePanel() {
  return (
    <div style={{
      width: 940, padding: 24, borderRadius: 22,
      background: '#FFFDFB', border: '1px solid rgba(60,40,30,0.06)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 18,
      }}>
        <div>
          <div className="mono" style={{
            fontSize: 11, color: '#A89991', textTransform: 'uppercase',
            letterSpacing: 1.4, marginBottom: 4,
          }}>DASHBOARD PEMERINTAH · MODUL VERIFIKASI</div>
          <div style={{
            fontFamily: 'Nunito', fontWeight: 800, fontSize: 18, color: S.ink,
          }}>Antrian usulan lokasi baru</div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 99,
          background: AMBER_BG, color: AMBER,
          fontFamily: 'Nunito', fontWeight: 800, fontSize: 12,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: 99, background: AMBER }} />
          14 menunggu verifikasi
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14,
      }}>
        <AdminVerificationCard />
        <AdminMiniCard
          name="Stasiun Manggarai · Concourse"
          cat="station" catLabel="STASIUN / TERMINAL"
          user="@yuni.s" time="4 jam lalu"
        />
        <AdminMiniCard
          name="RS Premier Bintaro"
          cat="hospital" catLabel="RUMAH SAKIT / KLINIK"
          user="@melia_n" time="6 jam lalu"
        />
        <AdminMiniCard
          name="Taman Suropati · Pos Jaga"
          cat="park" catLabel="TAMAN KOTA"
          user="@dini.a" time="1 hari lalu"
        />
      </div>
    </div>
  );
}

function AdminMiniCard({ name, cat, catLabel, user, time }) {
  return (
    <div style={{
      padding: 14, borderRadius: 16, background: '#fff',
      border: '1px solid rgba(60,40,30,0.06)',
      display: 'flex', gap: 12, alignItems: 'center',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
        background: `linear-gradient(140deg, ${S.rose}, #F2C6B8)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
      }}>
        <CatIcon kind={cat} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="mono" style={{
          fontSize: 9, color: '#A89991', letterSpacing: 1, fontWeight: 700,
        }}>{catLabel}</div>
        <div style={{
          fontFamily: 'Nunito', fontWeight: 800, fontSize: 13, color: S.ink,
          marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{name}</div>
        <div style={{ fontSize: 11, color: '#7C7062', fontWeight: 600, marginTop: 3 }}>
          {user} · {time}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button style={{
          width: 32, height: 32, borderRadius: 10, border: 0,
          background: `linear-gradient(140deg, ${S.sage}, ${S.sageDk})`,
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button style={{
          width: 32, height: 32, borderRadius: 10,
          background: '#fff', color: S.roseDp,
          border: `1.5px solid ${S.rose}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke={S.roseDp} strokeWidth="2.6" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, {
  SubmitScreen, AdminVerificationCard, AdminQueuePanel,
});
