// Five navbar treatments for MomSpace. Each receives:
//   { active, onChange, rose, sage, muted, labelOn }
// All share the same icon set & label set from window.TABS / NavIcons.

const ROSE  = '#E8A598';
const SAGE  = '#8FAF8F';
const MUTED = '#A89991';
const INK   = '#3D2E27';

// ─────────────────────────────────────────────────────────────
// Shared tab "atom" — icon + (optional) label, color-driven
// ─────────────────────────────────────────────────────────────
function NavLabel({ children, color }) {
  return (
    <div style={{
      fontFamily: 'Nunito, "Quicksand", system-ui',
      fontSize: 11, fontWeight: 700, color,
      letterSpacing: 0.1, marginTop: 4,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// A · Classic pill — soft rose pill behind active icon
// ─────────────────────────────────────────────────────────────
function NavbarClassic({ active, onChange, labelOn = true }) {
  return (
    <BarShell>
      {TABS.map((t, i) => {
        const on = i === active;
        const color = on ? ROSE : MUTED;
        return (
          <TabBtn key={t.key} onClick={() => onChange(i)}>
            <div style={{
              width: 44, height: 32, borderRadius: 16,
              background: on ? 'rgba(232,165,152,0.16)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 180ms',
              color,
            }}>
              {on ? NavIcons[t.icon].filled : NavIcons[t.icon].outline}
            </div>
            {labelOn && <NavLabel color={color}>{t.label}</NavLabel>}
          </TabBtn>
        );
      })}
    </BarShell>
  );
}

// ─────────────────────────────────────────────────────────────
// B · Dot indicator — minimal, dot beneath active icon
// ─────────────────────────────────────────────────────────────
function NavbarDot({ active, onChange, labelOn = true }) {
  return (
    <BarShell>
      {TABS.map((t, i) => {
        const on = i === active;
        const color = on ? ROSE : MUTED;
        return (
          <TabBtn key={t.key} onClick={() => onChange(i)}>
            <div style={{
              color, height: 28, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transform: on ? 'translateY(-1px)' : 'none',
              transition: 'transform 180ms',
            }}>
              {on ? NavIcons[t.icon].filled : NavIcons[t.icon].outline}
            </div>
            {labelOn ? (
              <NavLabel color={color}>{t.label}</NavLabel>
            ) : (
              <div style={{
                width: 6, height: 6, borderRadius: 99, marginTop: 6,
                background: on ? ROSE : 'transparent',
                transition: 'background 180ms',
              }} />
            )}
          </TabBtn>
        );
      })}
    </BarShell>
  );
}

// ─────────────────────────────────────────────────────────────
// C · Floating bar — elevated rounded bar, sage tinted active
// ─────────────────────────────────────────────────────────────
function NavbarFloating({ active, onChange, labelOn = true }) {
  return (
    <div style={{
      position: 'absolute', left: 16, right: 16, bottom: 18,
      borderRadius: 28, background: '#fff',
      boxShadow: '0 18px 40px rgba(60,40,30,0.18), 0 2px 6px rgba(60,40,30,0.06)',
      padding: '10px 8px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      height: 68, zIndex: 10,
    }}>
      {TABS.map((t, i) => {
        const on = i === active;
        const color = on ? '#fff' : MUTED;
        return (
          <button key={t.key} onClick={() => onChange(i)} style={{
            border: 0, background: 'transparent', cursor: 'pointer',
            padding: 0, flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              padding: on ? '8px 18px' : '8px 8px',
              borderRadius: 99,
              background: on ? ROSE : 'transparent',
              color,
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 220ms cubic-bezier(.2,.8,.2,1)',
              boxShadow: on ? '0 6px 14px rgba(232,165,152,0.45)' : 'none',
            }}>
              {on ? NavIcons[t.icon].filled : NavIcons[t.icon].outline}
              {on && labelOn && (
                <span style={{
                  fontFamily: 'Nunito, system-ui',
                  fontWeight: 800, fontSize: 13, color: '#fff',
                  whiteSpace: 'nowrap',
                }}>{t.label}</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// D · Center FAB — Report is a raised circular action
// ─────────────────────────────────────────────────────────────
function NavbarCenterFab({ active, onChange, labelOn = true }) {
  return (
    <BarShell extra={{ paddingTop: 0 }}>
      {TABS.map((t, i) => {
        const isReport = t.key === 'report';
        const on = i === active;
        const color = on ? ROSE : MUTED;

        if (isReport) {
          return (
            <TabBtn key={t.key} onClick={() => onChange(i)} style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', top: -26, left: '50%',
                transform: 'translateX(-50%)',
                width: 58, height: 58, borderRadius: 29,
                background: `linear-gradient(140deg, ${ROSE}, #F2C0B0)`,
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 24px rgba(232,165,152,0.55), 0 2px 4px rgba(60,40,30,0.08)',
                border: '4px solid #fff',
              }}>
                {NavIcons.plus}
              </div>
              <div style={{ height: 32 }} />
              {labelOn && (
                <NavLabel color={on ? ROSE : MUTED}>{t.label}</NavLabel>
              )}
            </TabBtn>
          );
        }
        return (
          <TabBtn key={t.key} onClick={() => onChange(i)}>
            <div style={{ color, height: 28, display: 'flex',
              alignItems: 'center', justifyContent: 'center' }}>
              {on ? NavIcons[t.icon].filled : NavIcons[t.icon].outline}
            </div>
            {labelOn && <NavLabel color={color}>{t.label}</NavLabel>}
          </TabBtn>
        );
      })}
    </BarShell>
  );
}

// ─────────────────────────────────────────────────────────────
// E · Top accent — clean bar with a colored top sliver indicator
// ─────────────────────────────────────────────────────────────
function NavbarTopAccent({ active, onChange, labelOn = true }) {
  return (
    <BarShell extra={{ paddingTop: 14 }}>
      {TABS.map((t, i) => {
        const on = i === active;
        const color = on ? ROSE : MUTED;
        return (
          <TabBtn key={t.key} onClick={() => onChange(i)} style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', top: -14, left: '50%',
              transform: 'translateX(-50%)',
              width: 34, height: 3, borderRadius: 99,
              background: on ? ROSE : 'transparent',
              transition: 'background 180ms',
            }} />
            <div style={{ color, height: 28, display: 'flex',
              alignItems: 'center', justifyContent: 'center' }}>
              {on ? NavIcons[t.icon].filled : NavIcons[t.icon].outline}
            </div>
            {labelOn && <NavLabel color={color}>{t.label}</NavLabel>}
          </TabBtn>
        );
      })}
    </BarShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Shared chrome
// ─────────────────────────────────────────────────────────────
function BarShell({ children, extra = {} }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      background: '#fff',
      borderTop: '1px solid rgba(60,40,30,0.06)',
      paddingTop: 10,
      paddingBottom: 28, // iOS safe area
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
      zIndex: 10,
      ...extra,
    }}>{children}</div>
  );
}

function TabBtn({ onClick, children, style = {} }) {
  return (
    <button onClick={onClick} style={{
      border: 0, background: 'transparent', cursor: 'pointer',
      padding: '6px 0', flex: 1,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      ...style,
    }}>{children}</button>
  );
}

const NAVBARS = {
  classic:    { name: 'Classic Pill',  comp: NavbarClassic },
  dot:        { name: 'Minimal Dot',   comp: NavbarDot },
  floating:   { name: 'Floating Pill', comp: NavbarFloating },
  centerFab:  { name: 'Center Action', comp: NavbarCenterFab },
  topAccent:  { name: 'Top Accent',    comp: NavbarTopAccent },
};

Object.assign(window, {
  NavbarClassic, NavbarDot, NavbarFloating, NavbarCenterFab, NavbarTopAccent,
  NAVBARS, ROSE, SAGE, MUTED, INK,
});
