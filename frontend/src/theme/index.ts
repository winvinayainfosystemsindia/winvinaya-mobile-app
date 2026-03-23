import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';

export const theme = createTheme({
  palette,
  typography,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 20px',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#8710D8',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08)',
        },
        outlined: {
          boxShadow: 'none',
          borderColor: '#D1D7DC',
        },
      },
    },
  },
});

export default theme;
