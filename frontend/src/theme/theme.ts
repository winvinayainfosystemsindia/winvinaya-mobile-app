import { createTheme } from '@mui/material/styles';
import { designTokens } from './designTokens';

/**
 * WinVinaya LMS — Udemy-Class MUI Theme
 */
const theme = createTheme({
  palette: {
    primary: {
      main: designTokens.colors.primary,
      dark: designTokens.colors.primaryDark,
      light: designTokens.colors.primaryLight,
      contrastText: '#ffffff',
    },
    secondary: {
      main: designTokens.colors.dark,
      contrastText: '#ffffff',
    },
    background: {
      default: designTokens.colors.bg,
      paper: designTokens.colors.surface,
    },
    text: {
      primary: designTokens.colors.textPrimary,
      secondary: designTokens.colors.textSecondary,
    },
    divider: designTokens.colors.border,
    error: { main: designTokens.colors.error },
    warning: { main: designTokens.colors.warning },
    success: { main: designTokens.colors.success },
    info: { main: designTokens.colors.primary },
  },
  typography: {
    fontFamily: designTokens.typography.fontFamily,
    h1: { ...designTokens.typography.h1, color: designTokens.colors.textPrimary },
    h2: { ...designTokens.typography.h2, color: designTokens.colors.textPrimary },
    h3: { ...designTokens.typography.h3, color: designTokens.colors.textPrimary },
    h4: { fontSize: '28px', fontWeight: 700, color: designTokens.colors.textPrimary },
    h5: { fontSize: '22px', fontWeight: 700, color: designTokens.colors.textPrimary },
    h6: { fontSize: '18px', fontWeight: 600, color: designTokens.colors.textPrimary },
    body1: { ...designTokens.typography.body },
    body2: { ...designTokens.typography.caption, lineHeight: 1.5 },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '15px',
      letterSpacing: '0.01em',
    },
    caption: { fontSize: '13px', color: designTokens.colors.textSecondary },
  },
  shape: {
    borderRadius: designTokens.shape.borderRadius,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          padding: '10px 20px',
          borderRadius: designTokens.shape.borderRadius,
          minHeight: '44px',
          transition: 'all 0.15s ease',
          '&:active': { transform: 'scale(0.98)' },
        },
        containedPrimary: {
          background: designTokens.colors.primary,
          '&:hover': {
            background: designTokens.colors.primaryDark,
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(164, 53, 240, 0.35)',
          },
        },
        outlinedPrimary: {
          borderColor: designTokens.colors.primary,
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: designTokens.colors.primaryLight,
          },
        },
        containedSecondary: {
          background: designTokens.colors.dark,
          '&:hover': { background: '#2d2f31' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: designTokens.colors.surface,
          color: designTokens.colors.textPrimary,
          borderBottom: `1px solid ${designTokens.colors.border}`,
          boxShadow: 'none',
          height: `${designTokens.spacing.topbarHeight}px`,
          justifyContent: 'center',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.shape.cardBorderRadius,
          border: `1px solid ${designTokens.colors.border}`,
          boxShadow: designTokens.shadows.card,
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: designTokens.shadows.cardHover,
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: designTokens.colors.sidebarBg,
          color: designTokens.colors.sidebarText,
          borderRight: `1px solid ${designTokens.colors.border}`,
          boxShadow: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.shape.borderRadius,
          margin: '2px 8px',
          padding: '9px 12px',
          '&.Mui-selected': {
            backgroundColor: designTokens.colors.sidebarActiveBg,
            color: designTokens.colors.sidebarActive,
            borderLeft: `3px solid ${designTokens.colors.sidebarActive}`,
            '& .MuiListItemIcon-root': { color: designTokens.colors.sidebarActive },
            '&:hover': { backgroundColor: designTokens.colors.sidebarActiveBg },
          },
          '&:hover': { backgroundColor: designTokens.colors.sidebarHover },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: designTokens.colors.textSecondary,
          minWidth: '40px',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 999, backgroundColor: '#e0e0e0' },
        bar: {
          borderRadius: 999,
          backgroundColor: designTokens.colors.accent,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 600,
          fontSize: '12px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: '#f8fafc',
            fontWeight: 700,
            fontSize: '13px',
            color: designTokens.colors.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: '#fafafa' },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: designTokens.colors.dark,
          fontSize: '12px',
          borderRadius: 4,
          padding: '6px 10px',
        },
      },
    },
  },
});

export default theme;
