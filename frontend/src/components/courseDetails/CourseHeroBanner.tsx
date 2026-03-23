import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link, Stack, Rating, Grid } from '@mui/material';
import { PlayArrow as PlayIcon } from '@mui/icons-material';
import { designTokens } from '../../theme/designTokens';

interface CourseHeroBannerProps {
    title: string;
    subtitle: string;
    breadcrumbs: { label: string; path: string }[];
    rating: number;
    ratingCount: number;
    studentsEnrolled: number;
    instructor: {
        name: string;
        avatar: string;
    };
    previewThumbnail: string;
}

const CourseHeroBanner: React.FC<CourseHeroBannerProps> = ({
    title,
    subtitle,
    breadcrumbs,
    rating,
    ratingCount,
    studentsEnrolled,
    instructor,
    previewThumbnail
}) => {
    return (
        <Box sx={{ bgcolor: designTokens.colors.heroBg, color: '#ffffff', py: { xs: 4, md: 8 }, position: 'relative' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Breadcrumbs 
                            separator="›" 
                            sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, '& .MuiBreadcrumbs-li': { fontSize: '0.85rem', fontWeight: 700 } }}
                        >
                            {breadcrumbs.map((bc, idx) => (
                                <Link 
                                    key={idx} 
                                    href={bc.path} 
                                    underline="hover" 
                                    sx={{ color: 'inherit' }}
                                >
                                    {bc.label}
                                </Link>
                            ))}
                        </Breadcrumbs>

                        <Typography variant="h3" sx={{ 
                            fontWeight: 900, 
                            mb: 2, 
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            lineHeight: 1.2
                        }}>
                            {title}
                        </Typography>

                        <Typography variant="h6" sx={{ 
                            fontWeight: 400, 
                            mb: 3, 
                            color: 'rgba(255,255,255,0.9)',
                            maxWidth: '700px'
                        }}>
                            {subtitle}
                        </Typography>

                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography sx={{ fontWeight: 900, fontSize: '0.9rem', color: '#f69c08' }}>{rating}</Typography>
                                <Rating value={rating} precision={0.1} readOnly size="small" />
                            </Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                ({ratingCount.toLocaleString()} ratings)
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {studentsEnrolled.toLocaleString()} students enrolled
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Typography variant="body2" sx={{ color: '#ffffff' }}>Created by</Typography>
                            <Link href="#" underline="always" sx={{ color: '#A0CCFD', fontWeight: 600, fontSize: '0.9rem' }}>
                                {instructor.name}
                            </Link>
                        </Stack>
                    </Grid>

                    {/* Preview Image for mobile */}
                    <Grid size={{ xs: 12, md: 4 }} sx={{ display: { xs: 'block', md: 'none' } }}>
                        <Box sx={{ 
                            position: 'relative', 
                            borderRadius: '12px', 
                            overflow: 'hidden', 
                            aspectRatio: '16/9',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                            <Box 
                                component="img" 
                                src={previewThumbnail} 
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            <Box sx={{ 
                                position: 'absolute', 
                                top: '50%', 
                                left: '50%', 
                                transform: 'translate(-50%, -50%)',
                                bgcolor: 'rgba(255,255,255,0.9)',
                                borderRadius: '50%',
                                p: 1.5,
                                display: 'flex'
                            }}>
                                <PlayIcon sx={{ color: '#000000', fontSize: 40 }} />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default CourseHeroBanner;
