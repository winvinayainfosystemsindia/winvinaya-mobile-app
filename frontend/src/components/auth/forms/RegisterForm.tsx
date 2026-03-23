import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    CircularProgress,
    Typography,
    Link,
    Grid
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { designTokens } from '../../../theme/designTokens';

interface RegisterFormProps {
    loading: boolean;
    onRegister: (userData: any) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ loading, onRegister }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onRegister(formData);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        required
                        fullWidth
                        id="fullName"
                        label="Full Name"
                        name="fullName"
                        autoComplete="name"
                        autoFocus
                        value={formData.fullName}
                        onChange={handleChange}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        InputLabelProps={{ shrink: true }}
                        placeholder="John Doe"
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        InputLabelProps={{ shrink: true }}
                        placeholder="name@company.com"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
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
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputLabelProps={{ shrink: true }}
                        placeholder="••••••••"
                    />
                </Grid>
            </Grid>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                    mt: 3,
                    mb: 2,
                    height: 52,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: '8px',
                    bgcolor: designTokens.colors.primary,
                    boxShadow: '0 4px 12px rgba(164, 53, 240, 0.2)',
                    '&:hover': {
                        bgcolor: designTokens.colors.primaryDark,
                        boxShadow: '0 6px 16px rgba(164, 53, 240, 0.3)',
                    }
                }}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link 
                        component={RouterLink}
                        to="/auth/login"
                        sx={{ 
                            fontWeight: 700, 
                            color: designTokens.colors.primary, 
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                        }}
                    >
                        Log in
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default RegisterForm;
