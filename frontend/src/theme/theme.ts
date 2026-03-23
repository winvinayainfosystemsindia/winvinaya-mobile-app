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
          color: '#ffffff',
          '&:hover': {
            background: designTokens.colors.primaryDark,
            boxShadow: '0 8px 16px -4px rgba(0, 86, 210, 0.3)',
            transform: 'translateY(-1px)',
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
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: designTokens.shadows.cardHover,
            transform: 'translateY(-6px)',
            borderColor: designTokens.colors.primaryLight,
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
          borderRadius: 8,
          margin: '4px 12px',
          padding: '10px 16px',
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            backgroundColor: designTokens.colors.primary,
            color: '#ffffff',
            '& .MuiListItemIcon-root': { color: '#ffffff' },
            '& .MuiTypography-root': { fontWeight: 700 },
            '&:hover': { backgroundColor: designTokens.colors.primaryDark },
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
          transition: 'background-color 0.2s ease',
          '&:hover': { backgroundColor: designTokens.colors.sidebarHover },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: designTokens.colors.secondary,
          fontSize: '12px',
          borderRadius: 8,
          padding: '8px 12px',
          boxShadow: designTokens.shadows.dropdown,
        },
      },
    },
  },
});

export default theme;
