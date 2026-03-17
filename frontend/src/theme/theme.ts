import { createTheme } from '@mui/material/styles';

/**
 * Udemy-style Theme Configuration
 * Colors:
 * - Primary: #a435f0 (Purple)
 * - Secondary: #2d2f31 (Dark Gray)
 * - Error: #e44848 (Muted Red)
 * - Background: #ffffff
 * - Border: #d1d7dc
 */
const theme = createTheme({
	palette: {
		primary: {
			main: '#a435f0',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#2d2f31',
			contrastText: '#ffffff',
		},
		background: {
			default: '#ffffff',
			paper: '#ffffff',
		},
		text: {
			primary: '#1c1d1f',
			secondary: '#6a6f73',
		},
		divider: '#d1d7dc',
	},
	typography: {
		fontFamily: '"Inter", "SF Pro Text", -apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
		h4: {
			fontWeight: 700,
			fontSize: '2rem',
			color: '#1c1d1f',
		},
		h5: {
			fontWeight: 700,
			fontSize: '1.5rem',
			color: '#1c1d1f',
		},
		h6: {
			fontWeight: 700,
			fontSize: '1.2rem',
			color: '#1c1d1f',
		},
		subtitle1: {
			fontWeight: 700,
			fontSize: '1rem',
		},
		subtitle2: {
			fontWeight: 400,
			fontSize: '0.9rem',
		},
		button: {
			textTransform: 'none',
			fontWeight: 700,
			fontSize: '1rem',
		},
		body1: {
			fontSize: '1rem',
			lineHeight: 1.4,
		},
		body2: {
			fontSize: '0.875rem',
			lineHeight: 1.4,
		},
	},
	shape: {
		borderRadius: 0, // Udemy uses very sharp corners for a professional look
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					padding: '12px 20px',
					borderRadius: 0,
					height: '48px',
				},
				containedPrimary: {
					backgroundColor: '#a435f0',
					'&:hover': {
						backgroundColor: '#8710d8',
					},
				},
				outlinedPrimary: {
					borderColor: '#1c1d1f',
					color: '#1c1d1f',
					borderWidth: '1px',
					'&:hover': {
						backgroundColor: 'rgba(28, 29, 31, 0.04)',
						borderColor: '#1c1d1f',
						borderWidth: '1px',
					},
				},
			},
			defaultProps: {
				disableElevation: true,
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: '#ffffff',
					color: '#1c1d1f',
					boxShadow: '0 2px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08)',
					height: '72px',
					justifyContent: 'center',
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 0,
					border: '1px solid #d1d7dc',
					boxShadow: 'none',
					'&:hover': {
						cursor: 'pointer',
					},
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					'& .MuiOutlinedInput-root': {
						borderRadius: 0,
						'& fieldset': {
							borderColor: '#1c1d1f',
						},
						'&:hover fieldset': {
							borderColor: '#1c1d1f',
						},
					},
				},
			},
		},
	},
});

export default theme;
