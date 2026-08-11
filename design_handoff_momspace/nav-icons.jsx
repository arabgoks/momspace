// Icon set — outlined + filled pairs. Rounded, friendly stroke style.
// All icons render at 24x24.

const NavIcons = {
  map: {
    outline: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 21s-7-6.2-7-11.5C5 5.4 8.1 2.5 12 2.5s7 2.9 7 7C19 14.8 12 21 12 21z"
          stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"/>
        <circle cx="12" cy="9.7" r="2.6" stroke="currentColor" strokeWidth="1.9"/>
      </svg>
    ),
    filled: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 21s-7-6.2-7-11.5C5 5.4 8.1 2.5 12 2.5s7 2.9 7 7C19 14.8 12 21 12 21z"
          fill="currentColor"/>
        <circle cx="12" cy="9.7" r="2.7" fill="#fff"/>
      </svg>
    ),
  },
  search: {
    outline: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="6.8" stroke="currentColor" strokeWidth="1.9"/>
        <path d="M20.5 20.5l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    filled: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7.3" fill="currentColor"/>
        <circle cx="11" cy="11" r="3.2" fill="#fff"/>
        <path d="M20.5 20.5l-4.3-4.3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  // Report — camera with a small plus
  report: {
    outline: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M4 8.5h3.2l1.3-2h7l1.3 2H20A1.5 1.5 0 0 1 21.5 10v7.5A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5V10A1.5 1.5 0 0 1 4 8.5z"
          stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"/>
        <circle cx="12" cy="13.4" r="3.4" stroke="currentColor" strokeWidth="1.9"/>
      </svg>
    ),
    filled: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M4 8.5h3.2l1.3-2h7l1.3 2H20A1.5 1.5 0 0 1 21.5 10v7.5A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5V10A1.5 1.5 0 0 1 4 8.5z"
          fill="currentColor"/>
        <circle cx="12" cy="13.4" r="3.5" fill="#fff"/>
        <circle cx="12" cy="13.4" r="1.6" fill="currentColor"/>
      </svg>
    ),
  },
  // Profile — soft person
  profile: {
    outline: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8.2" r="3.6" stroke="currentColor" strokeWidth="1.9"/>
        <path d="M4.6 20c1-3.7 4.1-5.6 7.4-5.6S18.4 16.3 19.4 20"
          stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/>
      </svg>
    ),
    filled: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8.2" r="3.9" fill="currentColor"/>
        <path d="M4.4 20.4c1-3.9 4.2-5.9 7.6-5.9s6.6 2 7.6 5.9"
          fill="currentColor"/>
      </svg>
    ),
  },
  // Plus glyph for FAB-style Report
  plus: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/>
    </svg>
  ),
};

const TABS = [
  { key: 'map',     label: 'Map',     icon: 'map' },
  { key: 'search',  label: 'Search',  icon: 'search' },
  { key: 'report',  label: 'Report',  icon: 'report' },
  { key: 'profile', label: 'Profile', icon: 'profile' },
];

Object.assign(window, { NavIcons, TABS });
