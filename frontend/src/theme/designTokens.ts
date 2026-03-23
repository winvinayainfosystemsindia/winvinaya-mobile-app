/**
 * WinVinaya LMS — Udemy-Class Design System Tokens
 * Palette inspired by Udemy's premium product aesthetic.
 */
export const designTokens = {
  colors: {
    // Brand — Udemy Purple
    primary: '#a435f0',
    primaryDark: '#8710d8',
    primaryLight: '#f5e8fd',

    // Accent — Udemy Orange/Gold (ratings, bestseller, progress)
    accent: '#f69c08',
    accentWarm: '#ec5252', // sale / urgency colour

    // Surfaces
    bg: '#f7f9fa',
    surface: '#ffffff',
    dark: '#1c1d1f',

    // Text
    textPrimary: '#1c1d1f',
    textSecondary: '#6a6f73',

    // State colours
    success: '#1bad67',
    warning: '#f7c948',
    error: '#d32f2f',

    // Borders & dividers
    border: '#d1d7dc',

    // Sidebar — white Udemy-style (inside AppShell)
    sidebarBg: '#ffffff',
    sidebarText: '#1c1d1f',
    sidebarHover: 'rgba(164, 53, 240, 0.06)',
    sidebarActive: '#a435f0',
    sidebarActiveBg: 'rgba(164, 53, 240, 0.08)',

    // Hero sections (dark gradient)
    heroBg: '#1c1d1f',
  },
  typography: {
    fontFamily: '"Source Sans 3", "Inter", "Segoe UI", sans-serif',
    h1: { fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px' },
    h2: { fontSize: '24px', fontWeight: 700 },
    h3: { fontSize: '18px', fontWeight: 600 },
    body: { fontSize: '15px', fontWeight: 400, lineHeight: 1.6 },
    caption: { fontSize: '13px', fontWeight: 400 },
  },
  shape: {
    borderRadius: 4,         // Udemy uses tighter corners
    cardBorderRadius: 4,
    pillRadius: 100,
  },
  shadows: {
    card: '0 1px 4px rgba(0,0,0,0.10)',
    cardHover: '0 4px 20px rgba(0,0,0,0.14)',
    dropdown: '0 4px 20px rgba(0,0,0,0.12)',
    topbar: '0 2px 8px rgba(0,0,0,0.08)',
  },
  spacing: {
    sidebarWidth: 260,
    sidebarCollapsedWidth: 68,
    topbarHeight: 64,
  },
};
