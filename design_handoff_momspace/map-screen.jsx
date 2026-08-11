// MapScreen — soft map-themed backdrop so the navbar reads in context
// Uses CSS only — no realistic SVG drawing per design rules.

function MapScreen({ activeTab = 0, navHeight = 88 }) {
  // soft warm map palette
  const land = '#FBF5F1';
  const block = '#F3E9E2';
  const park = '#DEE9DE';
  const water = '#E4ECEF';
  const road = '#FFFFFF';

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: land,
      overflow: 'hidden',
    }}>
      {/* abstract "map" tiles — soft blocks */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(115deg, transparent 38%, ${park} 38%, ${park} 52%, transparent 52%),
          linear-gradient(25deg, transparent 18%, ${block} 18%, ${block} 27%, transparent 27%, transparent 64%, ${block} 64%, ${block} 73%, transparent 73%),
          linear-gradient(95deg, transparent 8%, ${water} 8%, ${water} 12%, transparent 12%)
        `,
        opacity: 0.95,
      }} />
      {/* road grid */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 402 800" preserveAspectRatio="none">
        <g stroke={road} strokeWidth="6" fill="none" strokeLinecap="round">
          <path d="M-20 180 Q120 200 240 160 T440 140" />
          <path d="M-20 360 Q140 380 260 340 T440 320" />
          <path d="M80 -20 Q60 180 140 320 T180 820" />
          <path d="M300 -20 Q290 200 340 380 T380 820" />
        </g>
        <g stroke="#fff" strokeWidth="2" fill="none" opacity="0.6">
          <path d="M-20 260 H440" />
          <path d="M-20 480 H440" />
          <path d="M200 -20 V820" />
        </g>
      </svg>

      {/* sample pins — one selected (rose), others sage */}
      <Pin x={62} y={36} primary />
      <Pin x={48} y={52} />
      <Pin x={70} y={58} />
      <Pin x={40} y={70} />
      <Pin x={78} y={42} />
      <Pin x={28} y={42} />

      {/* "you are here" pulse */}
      <div style={{
        position: 'absolute', left: '52%', top: '60%',
        width: 16, height: 16, borderRadius: '50%',
        background: '#5B8DEF',
        boxShadow: '0 0 0 4px #fff, 0 0 0 14px rgba(91,141,239,0.18)',
        transform: 'translate(-50%, -50%)',
      }} />

      {/* search bar at top */}
      <div style={{
        position: 'absolute', top: 56, left: 16, right: 16,
        height: 48, borderRadius: 24, background: '#fff',
        boxShadow: '0 6px 20px rgba(60, 40, 30, 0.08), 0 1px 2px rgba(60,40,30,0.04)',
        display: 'flex', alignItems: 'center', padding: '0 18px', gap: 12,
        fontFamily: 'Nunito, system-ui', fontWeight: 600,
        color: '#9C8A82', fontSize: 14.5,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="#C9A39A" strokeWidth="2"/>
          <path d="M20 20l-3.5-3.5" stroke="#C9A39A" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>Search lactation rooms near you</span>
      </div>

      {/* preview card just above navbar */}
      <div style={{
        position: 'absolute', left: 16, right: 16, bottom: navHeight + 16,
        background: '#fff', borderRadius: 22, padding: 14,
        boxShadow: '0 14px 36px rgba(60, 40, 30, 0.12), 0 2px 4px rgba(60,40,30,0.04)',
        display: 'flex', gap: 12, alignItems: 'center',
        fontFamily: 'Nunito, system-ui',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'linear-gradient(135deg, #E8A598, #F2C6B8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: 22,
        }}>P</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#3D2E27' }}>
            Plaza Indonesia · Level 4
          </div>
          <div style={{ fontSize: 12.5, color: '#8A7268', marginTop: 2, fontWeight: 600 }}>
            220 m · Open now · ⭐ 4.8
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <Chip label="Clean" />
            <Chip label="Sink" />
            <Chip label="AC" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Pin({ x, y, primary }) {
  const color = primary ? '#E8A598' : '#8FAF8F';
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      transform: `translate(-50%, -100%) scale(${primary ? 1.15 : 1})`,
      width: 26, height: 32,
      filter: primary ? 'drop-shadow(0 6px 10px rgba(232,165,152,0.45))' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.08))',
    }}>
      <svg width="26" height="32" viewBox="0 0 26 32">
        <path d="M13 1C6.4 1 1 6.3 1 12.8c0 8.6 12 18.2 12 18.2s12-9.6 12-18.2C25 6.3 19.6 1 13 1z"
          fill={color} stroke="#fff" strokeWidth="2"/>
        <circle cx="13" cy="12.5" r="4.2" fill="#fff"/>
      </svg>
    </div>
  );
}

function Chip({ label }) {
  return (
    <div style={{
      fontSize: 10.5, fontWeight: 700, color: '#6B8F6B',
      background: '#EEF5EE', padding: '3px 8px', borderRadius: 999,
      fontFamily: 'Nunito, system-ui',
    }}>{label}</div>
  );
}

Object.assign(window, { MapScreen });
