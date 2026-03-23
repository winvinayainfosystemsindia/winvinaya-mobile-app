/**
 * WinVinaya LMS — Udemy-Class Design System Tokens
 * Palette inspired by Udemy's premium product aesthetic.
 */
export const designTokens = {
  colors: {
    // Brand — Scholar Flow Blue
    primary: '#0056D2',
    primaryDark: '#0044A8',
    primaryLight: '#E6EFFF',

    // Secondary — Scholar Flow Navy
    secondary: '#2A3B4D',
    secondaryDark: '#1E2A37',
    secondaryLight: '#F0F3F5',

    // Tertiary / Success — Scholar Flow Teal
    tertiary: '#00C292',
    tertiaryDark: '#009F78',
    tertiaryLight: '#E6F9F4',

    // Accent — Warm accents for specific highlights
    accent: '#f69c08',
    accentWarm: '#ec5252',

    // Surfaces
    bg: '#F8FAFC',
    surface: '#ffffff',
    dark: '#2A3B4D',

    // Text
    textPrimary: '#1E2A37',
    textSecondary: '#747780',

    // State colours
    success: '#00C292',
    warning: '#f7c948',
    error: '#ED3833',

    // Borders & dividers
    border: '#E2E8F0',

    // Sidebar — Scholar Flow Style
    sidebarBg: '#ffffff',
    sidebarText: '#747780',
    sidebarHover: '#F1F5F9',
    sidebarActive: '#0056D2',
    sidebarActiveBg: '#E6EFFF',

    // Hero sections
    heroBg: '#2A3B4D',
  },
  typography: {
    fontFamily: '"Inter", "Source Sans 3", "Segoe UI", sans-serif',
    h1: { fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontSize: '24px', fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontSize: '18px', fontWeight: 600 },
    body: { fontSize: '15px', fontWeight: 400, lineHeight: 1.6 },
    caption: { fontSize: '13px', fontWeight: 400 },
  },
  shape: {
    borderRadius: 12,         // Scholar Flow uses rounder corners
    cardBorderRadius: 16,
    pillRadius: 100,
  },
  shadows: {
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    cardHover: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    dropdown: '0 4px 20px rgba(0,0,0,0.12)',
    topbar: '0 2px 8px rgba(0,0,0,0.08)',
  },
  spacing: {
    sidebarWidth: 260,
    sidebarCollapsedWidth: 68,
    topbarHeight: 64,
  },
};
