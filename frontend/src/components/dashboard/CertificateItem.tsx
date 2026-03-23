import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { VerifiedOutlined as VerifiedIcon } from '@mui/icons-material';
import { designTokens } from '../../theme/designTokens';

interface CertificateItemProps {
    name: string;
    verifiedDate: string;
}

const CertificateItem: React.FC<CertificateItemProps> = ({ name, verifiedDate }) => {
    return (
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            p: 2, 
            bgcolor: '#F8FAFC', 
            borderRadius: '12px',
            border: `1px solid ${designTokens.colors.border}`,
            mb: 2
        }}>
            <Avatar sx={{ bgcolor: '#E6F9F4', color: designTokens.colors.tertiary, width: 40, height: 40 }}>
                <VerifiedIcon fontSize="small" />
            </Avatar>
            <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: designTokens.colors.textPrimary }}>
                    {name}
                </Typography>
                <Typography variant="caption" sx={{ color: designTokens.colors.textSecondary, fontWeight: 500 }}>
                    Verified on {verifiedDate}
                </Typography>
            </Box>
        </Box>
    );
};

export default CertificateItem;
