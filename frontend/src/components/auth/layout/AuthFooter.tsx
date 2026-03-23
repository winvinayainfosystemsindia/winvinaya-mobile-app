import React from 'react';
import { Box } from '@mui/material';

const AuthFooter: React.FC = () => {
    return (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Box 
                component="footer" 
                sx={{ 
                    opacity: 0.6,
                    transition: 'opacity 0.3s',
                    '&:hover': { opacity: 1 }
                }}
            >
                <Box sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 500 }}>
                    © {new Date().getFullYear()} WinVinaya, Inc. • Professional Learning Platform
                </Box>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Box sx={{ color: 'text.secondary', fontSize: '0.75rem', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>Privacy Policy</Box>
                    <Box sx={{ color: 'text.secondary', fontSize: '0.75rem', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>Terms of Service</Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AuthFooter;
