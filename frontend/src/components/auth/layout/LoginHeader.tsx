import React from 'react';
import { Box, Typography } from '@mui/material';
import { designTokens } from '../../../theme/designTokens';

const LoginHeader: React.FC = () => {
    return (
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
                Welcome Back
            </Typography>
            <Typography 
                variant="body1" 
                sx={{ 
                    color: designTokens.colors.textSecondary, 
                    fontSize: '1rem'
                }}
            >
                Continue your professional journey with WinVinaya.
            </Typography>
        </Box>
    );
};

export default LoginHeader;
