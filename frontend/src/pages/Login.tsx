import React, { useEffect } from 'react';
import {
    Container,
    Box,
    Paper,
    Fade
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useToast from '../hooks/useToast';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError } from '../store/slices/authSlice';

// Modular Components
import { 
    LoginHeader, 
    LoginForm, 
    SocialAuth, 
    AuthFooter 
} from '../components/auth';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    /*
    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, isInitialized, navigate]);
    */

    useEffect(() => {
        if (error) {
            toast.error(typeof error === 'string' ? error : 'Login failed');
            const timer = setTimeout(() => dispatch(clearError()), 3000);
            return () => clearTimeout(timer);
        }
    }, [error, toast, dispatch]);

    const handleLogin = async (email: string, password: string) => {
        try {
            await dispatch(loginUser({ email, password })).unwrap();
            toast.success('Login successful');
            navigate('/dashboard');
        } catch (err) {
            console.error('Login failed', err);
        }
    };

    const handleSocialLogin = (provider: string) => {
        toast.info(`Redirecting to ${provider} login...`);
        // Social login logic would go here
    };

    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f8f9fa', // Soft enterprise background
                background: 'radial-gradient(circle at 2% 10%, rgba(164, 53, 240, 0.05) 0%, transparent 40%), radial-gradient(circle at 98% 90%, rgba(164, 53, 240, 0.05) 0%, transparent 40%)',
            }}
        >
            <Container maxWidth="sm">
                <Fade in={true} timeout={800}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, sm: 6 },
                            borderRadius: '16px', // Modern rounded corners for enterprise feel
                            border: '1px solid #e9ecef',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                            bgcolor: '#ffffff'
                        }}
                    >
                        <LoginHeader />
                        
                        <LoginForm 
                            loading={loading} 
                            onLogin={handleLogin} 
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

export default Login;
