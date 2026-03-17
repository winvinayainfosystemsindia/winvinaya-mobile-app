import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    CircularProgress,
    Typography,
    Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface LoginFormProps {
    loading: boolean;
    onLogin: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ loading, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2.5 }}
                InputLabelProps={{ shrink: true }}
                placeholder="name@company.com"
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
                sx={{ mb: 1.5 }}
                InputLabelProps={{ shrink: true }}
                placeholder="••••••••"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={showPassword ? "hide password" : "show password"}
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                size="small"
                            >
                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Link 
                    href="#" 
                    variant="body2" 
                    sx={{ 
                        fontWeight: 600, 
                        color: 'primary.main', 
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    Forgot password?
                </Link>
            </Box>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                    height: 52,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(164, 53, 240, 0.2)',
                    '&:hover': {
                        boxShadow: '0 6px 16px rgba(164, 53, 240, 0.3)',
                    }
                }}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
            </Button>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link 
                        href="#" 
                        sx={{ 
                            fontWeight: 700, 
                            color: 'primary.main', 
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                        }}
                    >
                        Sign up
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default LoginForm;
