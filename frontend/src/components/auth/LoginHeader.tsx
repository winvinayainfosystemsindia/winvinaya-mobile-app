import React from 'react';
import { Box, Typography } from '@mui/material';

const LoginHeader: React.FC = () => {
    return (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    mb: 1,
                    background: 'linear-gradient(45deg, #1c1d1f 30%, #6a6f73 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}
            >
                WinVinaya
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Log in to your enterprise account
            </Typography>
        </Box>
    );
};

export default LoginHeader;
