import React, { useEffect } from 'react';
import {
    Container,
    Box,
    Paper,
    Fade,
    Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser } from '../store/slices/authSlice';
import { designTokens } from '../theme/designTokens';
import useToast from '../hooks/useToast';

// Modular Components
import { 
    RegisterForm, 
    SocialAuth, 
    AuthFooter 
} from '../components/auth';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const toast = useToast();
    const { loading, error } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (error) {
            toast.error(typeof error === 'string' ? error : 'Registration failed');
        }
    }, [error, toast]);

    const handleRegister = async (userData: any) => {
        try {
            await dispatch(registerUser(userData)).unwrap();
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration failed', err);
        }
    };

    const handleSocialLogin = (provider: string) => {
        toast.info(`Redirecting to ${provider} registration...`);
        // Social registration logic would go here
    };

    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: designTokens.colors.bg,
                background: `radial-gradient(circle at 2% 10%, ${designTokens.colors.primaryLight} 0%, transparent 40%), radial-gradient(circle at 98% 90%, ${designTokens.colors.primaryLight} 0%, transparent 40%)`,
            }}
        >
            <Container maxWidth="sm">
                <Fade in={true} timeout={800}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, sm: 6 },
                            borderRadius: `${designTokens.shape.cardBorderRadius}px`,
                            border: `1px solid ${designTokens.colors.border}`,
                            boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                            bgcolor: '#ffffff'
                        }}
                    >
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 900, 
                                    mb: 1, 
                                    color: designTokens.colors.textPrimary,
                                    letterSpacing: '-0.02em'
                                }}
                            >
                                Create Account
                            </Typography>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    color: designTokens.colors.textSecondary, 
                                    fontSize: '1rem'
                                }}
                            >
                                Join WinVinaya and start your professional journey.
                            </Typography>
                        </Box>

                        <RegisterForm 
                            loading={loading} 
                            onRegister={handleRegister} 
                        />
                        
                        <SocialAuth 
                            onSocialLogin={handleSocialLogin} 
                        />
                    </Paper>
                </Fade>
                <AuthFooter />
            </Container>
        </Box>
    );
};

export default Register;
