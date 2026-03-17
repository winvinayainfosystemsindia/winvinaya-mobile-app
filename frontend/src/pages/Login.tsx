import React, { useState, useEffect } from 'react';
import {
	Button,
	Container,
	Box,
	Typography,
	TextField,
	CircularProgress,
	IconButton,
	InputAdornment,
	Divider,
	Stack
} from '@mui/material';
import { 
    Visibility, 
    VisibilityOff, 
    Google as GoogleIcon, 
    GitHub as GitHubIcon,
    Facebook as FacebookIcon
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import useToast from '../hooks/useToast';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError } from '../store/slices/authSlice';

const Login: React.FC = () => {
	const navigate = useNavigate();
	const toast = useToast();
	const dispatch = useAppDispatch();
	const { loading, error, isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		if (isInitialized && isAuthenticated) {
			navigate('/dashboard');
		}
	}, [isAuthenticated, isInitialized, navigate]);

	useEffect(() => {
		if (error) {
			toast.error(typeof error === 'string' ? error : 'Login failed');
			const timer = setTimeout(() => dispatch(clearError()), 3000);
			return () => clearTimeout(timer);
		}
	}, [error, toast, dispatch]);

	const handleTogglePasswordVisibility = () => {
		setShowPassword((prev: boolean) => !prev);
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await dispatch(loginUser({ email, password })).unwrap();
			toast.success('Login successful');
		} catch (err) {
			console.error('Login failed', err);
		}
	};

	return (
		<Box
			component="main"
			sx={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				bgcolor: '#ffffff'
			}}
		>
            {/* Minimal Header */}
            <Box sx={{ p: 3, borderBottom: '1px solid #d1d7dc' }}>
                <Typography 
                    variant="h5" 
                    sx={{ 
                        fontWeight: 800, 
                        color: '#1c1d1f', 
                        cursor: 'pointer',
                        letterSpacing: -1
                    }}
                    onClick={() => navigate('/')}
                >
                    WinVinaya
                </Typography>
            </Box>

			<Container maxWidth="xs" sx={{ mt: 8, mb: 8 }}>
				<Box sx={{ textAlign: 'left', mb: 3 }}>
					<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
						Log in to your WinVinaya account
					</Typography>
				</Box>

				<Stack spacing={1.5} sx={{ mb: 3 }}>
                    <Button 
                        variant="outlined" 
                        fullWidth 
                        startIcon={<GoogleIcon />}
                        sx={{ 
                            justifyContent: 'flex-start', 
                            pl: 3, 
                            borderColor: '#1c1d1f', 
                            color: '#1c1d1f',
                            fontWeight: 700,
                            height: 48,
                            '&:hover': { borderColor: '#1c1d1f', bgcolor: 'rgba(28,29,31,0.04)' }
                        }}
                    >
                        Continue with Google
                    </Button>
                    <Button 
                        variant="outlined" 
                        fullWidth 
                        startIcon={<FacebookIcon sx={{ color: '#1877F2' }} />}
                        sx={{ 
                            justifyContent: 'flex-start', 
                            pl: 3, 
                            borderColor: '#1c1d1f', 
                            color: '#1c1d1f',
                            fontWeight: 700,
                            height: 48,
                            '&:hover': { borderColor: '#1c1d1f', bgcolor: 'rgba(28,29,31,0.04)' }
                        }}
                    >
                        Continue with Facebook
                    </Button>
                    <Button 
                        variant="outlined" 
                        fullWidth 
                        startIcon={<GitHubIcon />}
                        sx={{ 
                            justifyContent: 'flex-start', 
                            pl: 3, 
                            borderColor: '#1c1d1f', 
                            color: '#1c1d1f',
                            fontWeight: 700,
                            height: 48,
                            '&:hover': { borderColor: '#1c1d1f', bgcolor: 'rgba(28,29,31,0.04)' }
                        }}
                    >
                        Continue with GitHub
                    </Button>
                </Stack>

                <Box component="form" onSubmit={handleLogin} noValidate>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 1 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? "hide password" : "show password"}
                                        onClick={handleTogglePasswordVisibility}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                            mt: 2,
                            mb: 2,
                            height: 48,
                            fontWeight: 700,
                            fontSize: '1rem'
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Log in'}
                    </Button>
                </Box>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2">
                        or <Typography component="span" variant="body2" sx={{ fontWeight: 700, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Forgot Password</Typography>
                    </Typography>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="body2">
                        Don't have an account? <Typography component="span" variant="body2" sx={{ fontWeight: 700, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Sign up</Typography>
                    </Typography>
                </Box>
			</Container>

            <Box sx={{ mt: 'auto', py: 4, borderTop: '1px solid #d1d7dc', textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    © 2024 WinVinaya, Inc.
                </Typography>
            </Box>
		</Box>
	);
};

export default Login;
