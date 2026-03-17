import React, { useState } from 'react';
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
	Stack,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import { 
    Visibility, 
    VisibilityOff, 
    Google as GoogleIcon, 
    Facebook as FacebookIcon
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import useToast from '../hooks/useToast';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser } from '../store/slices/authSlice';

const Register: React.FC = () => {
	const navigate = useNavigate();
	const toast = useToast();
	const dispatch = useAppDispatch();
	const { loading } = useAppSelector((state) => state.auth);

	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

	const handleTogglePasswordVisibility = () => {
		setShowPassword((prev: boolean) => !prev);
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
        if (!agreeToTerms) {
            toast.error('Please agree to the terms and conditions');
            return;
        }
		try {
			await dispatch(registerUser({ full_name: fullName, email, password })).unwrap();
			toast.success('Registration successful! Please log in.');
            navigate('/login');
		} catch (err: any) {
			console.error('Registration failed', err);
            toast.error(err || 'Registration failed');
		}
	};

	return (
		<Box
			component="main"
			sx={{
				minHeight: 'calc(100vh - 72px)',
				display: 'flex',
				flexDirection: 'column',
				bgcolor: '#ffffff',
                mt: '72px'
			}}
		>
			<Container maxWidth="xs" sx={{ py: 8 }}>
				<Box sx={{ textAlign: 'left', mb: 3 }}>
					<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
						Sign up and start learning
					</Typography>
				</Box>

				<form onSubmit={handleRegister} noValidate>
                    <TextField
                        required
                        fullWidth
                        id="fullName"
                        label="Full Name"
                        name="fullName"
                        autoComplete="name"
                        autoFocus
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
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
                        autoComplete="new-password"
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

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        Passwords must be at least 8 characters and contain a number and a special character.
                    </Typography>

                    <FormControlLabel
                        control={
                            <Checkbox 
                                checked={agreeToTerms} 
                                onChange={(e) => setAgreeToTerms(e.target.checked)} 
                                color="primary"
                            />
                        }
                        label={
                            <Typography variant="body2">
                                Send me special offers, personalized recommendations, and learning tips.
                            </Typography>
                        }
                        sx={{ mb: 2, alignItems: 'flex-start', '& .MuiCheckbox-root': { pt: 0.5 } }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                            height: 48,
                            fontWeight: 700,
                            fontSize: '1rem',
                            mb: 2
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign up'}
                    </Button>
                </form>

                <Typography variant="caption" textAlign="center" sx={{ display: 'block', px: 2, mb: 3 }}>
                    By signing up, you agree to our <Typography component="span" variant="inherit" sx={{ fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>Terms of Use</Typography> and <Typography component="span" variant="inherit" sx={{ fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</Typography>.
                </Typography>

                <Divider sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">Other sign up options</Typography>
                </Divider>

                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                    <IconButton 
                        sx={{ 
                            border: '1px solid #1c1d1f', 
                            borderRadius: 0, 
                            p: 1.5,
                            '&:hover': { bgcolor: 'rgba(28,29,31,0.04)' }
                        }}
                    >
                        <GoogleIcon />
                    </IconButton>
                    <IconButton 
                        sx={{ 
                            border: '1px solid #1c1d1f', 
                            borderRadius: 0, 
                            p: 1.5,
                            '&:hover': { bgcolor: 'rgba(28,29,31,0.04)' }
                        }}
                    >
                        <FacebookIcon sx={{ color: '#1877F2' }} />
                    </IconButton>
                </Stack>
                
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2">
                        Already have an account? <Typography component="span" variant="body2" sx={{ fontWeight: 700, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => navigate('/login')}>Log in</Typography>
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

export default Register;
