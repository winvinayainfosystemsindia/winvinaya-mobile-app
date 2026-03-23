import React from 'react';
import { Box, Typography, Button, Paper, Stack, Divider } from '@mui/material';
import { 
    PlayCircleOutline as VideoIcon, 
    ArticleOutlined as ResourceIcon,
    SmartphoneOutlined as MobileIcon,
    MilitaryTechOutlined as CertificateIcon,
    AllInclusiveOutlined as LifetimeIcon 
} from '@mui/icons-material';
import { designTokens } from '../../theme/designTokens';

interface CourseSidebarCardProps {
    price: string;
    originalPrice: string;
    onEnroll?: () => void;
    onAddToCart?: () => void;
}

const CourseSidebarCard: React.FC<CourseSidebarCardProps> = ({
    price,
    originalPrice,
    onEnroll,
    onAddToCart
}) => {
    return (
        <Paper sx={{ 
            p: 3, 
            borderRadius: '16px', 
            border: `1px solid ${designTokens.colors.border}`, 
            boxShadow: designTokens.shadows.card,
            bgcolor: '#ffffff',
            position: 'sticky',
            top: '100px',
            zIndex: 10
        }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: designTokens.colors.textPrimary }}>
                {price}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: designTokens.colors.textSecondary, textDecoration: 'line-through' }}>
                    {originalPrice}
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.accentWarm, fontWeight: 700 }}>
                    84% off
                </Typography>
            </Stack>

            <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={onEnroll}
                    sx={{ 
                        height: 48, 
                        fontWeight: 900, 
                        bgcolor: designTokens.colors.primary,
                        '&:hover': { bgcolor: designTokens.colors.primaryDark }
                    }}
                >
                    Enroll Now
                </Button>
                <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={onAddToCart}
                    sx={{ 
                        height: 48, 
                        fontWeight: 900, 
                        color: designTokens.colors.secondary,
                        borderColor: designTokens.colors.border,
                        '&:hover': { borderColor: designTokens.colors.secondary, bgcolor: 'transparent' }
                    }}
                >
                    Add to Cart
                </Button>
            </Stack>

            <Typography variant="body2" sx={{ fontWeight: 800, mb: 2, color: designTokens.colors.textPrimary }}>
                This course includes:
            </Typography>

            <Stack spacing={1.5} sx={{ mb: 4 }}>
                {[
                    { icon: <VideoIcon fontSize="small" />, text: '24.5 hours on-demand video' },
                    { icon: <ResourceIcon fontSize="small" />, text: '12 downloadable resources' },
                    { icon: <MobileIcon fontSize="small" />, text: 'Access on mobile and TV' },
                    { icon: <CertificateIcon fontSize="small" />, text: 'Certificate of completion' },
                    { icon: <LifetimeIcon fontSize="small" />, text: 'Full lifetime access' }
                ].map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ color: designTokens.colors.textPrimary, display: 'flex' }}>{item.icon}</Box>
                        <Typography variant="caption" sx={{ color: designTokens.colors.textSecondary, fontWeight: 500 }}>
                            {item.text}
                        </Typography>
                    </Box>
                ))}
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 800, mb: 1, color: designTokens.colors.textPrimary }}>
                    Training a large team?
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: designTokens.colors.textSecondary, mb: 2 }}>
                    Get your team access to 25,000+ top courses anytime, anywhere.
                </Typography>
                <Button 
                    variant="outlined" 
                    fullWidth
                    sx={{ 
                        fontWeight: 800, 
                        fontSize: '0.8rem',
                        color: designTokens.colors.secondary,
                        borderColor: designTokens.colors.border,
                        borderRadius: '8px'
                    }}
                >
                    Try Academic for Business
                </Button>
            </Box>
        </Paper>
    );
};

export default CourseSidebarCard;
