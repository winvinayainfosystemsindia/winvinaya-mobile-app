import React from 'react';
import { Box, Typography, Stack, Rating, LinearProgress, Grid } from '@mui/material';
import { designTokens } from '../../theme/designTokens';

interface RatingBreakdown {
    stars: number;
    percent: number;
}

interface StudentReviewsProps {
    averageRating: number;
    ratingBreakdown: RatingBreakdown[];
}

const StudentReviews: React.FC<StudentReviewsProps> = ({ averageRating, ratingBreakdown }) => {
    return (
        <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: designTokens.colors.textPrimary }}>
                Student Reviews
            </Typography>
            
            <Grid container spacing={4} alignItems="center">
                <Grid size={{ xs: 12, md: 3 }} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography variant="h2" sx={{ fontWeight: 900, color: '#f69c08', mb: 1 }}>
                        {averageRating}
                    </Typography>
                    <Rating value={averageRating} precision={0.1} readOnly sx={{ mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#f69c08' }}>
                        Course Rating
                    </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, md: 9 }}>
                    <Stack spacing={1}>
                        {ratingBreakdown.map((item) => (
                            <Box key={item.stars} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={item.percent} 
                                    sx={{ 
                                        flexGrow: 1, 
                                        height: 8, 
                                        borderRadius: '4px',
                                        bgcolor: '#EDF2F7',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: '#64748b',
                                            borderRadius: '4px'
                                        }
                                    }}
                                />
                                <Rating value={item.stars} readOnly size="small" />
                                <Typography variant="caption" sx={{ color: designTokens.colors.primary, fontWeight: 700, width: 40 }}>
                                    {item.percent}%
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StudentReviews;
