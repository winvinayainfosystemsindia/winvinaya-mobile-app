import React from 'react';
import { Box, Typography, Link, Paper, Stack } from '@mui/material';
import { designTokens } from '../../theme/designTokens';
import CertificateItem from './CertificateItem';

interface Certificate {
    id: string;
    name: string;
    verifiedDate: string;
}

interface CertificatesSidebarProps {
    certificates: Certificate[];
}

const CertificatesSidebar: React.FC<CertificatesSidebarProps> = ({ certificates }) => {
    return (
        <Paper sx={{ 
            p: 3, 
            borderRadius: '20px', 
            border: `1px solid ${designTokens.colors.border}`, 
            boxShadow: 'none',
            bgcolor: '#ffffff',
            mb: 4
        }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: designTokens.colors.textPrimary, mb: 3 }}>
                Certificates Earned
            </Typography>
            
            <Stack>
                {certificates.map((cert) => (
                    <CertificateItem 
                        key={cert.id}
                        name={cert.name}
                        verifiedDate={cert.verifiedDate}
                    />
                ))}
            </Stack>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Link 
                    href="#" 
                    underline="none" 
                    sx={{ 
                        color: designTokens.colors.primary, 
                        fontWeight: 700, 
                        fontSize: '0.85rem',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    View All Credentials
                </Link>
            </Box>
        </Paper>
    );
};

export default CertificatesSidebar;
