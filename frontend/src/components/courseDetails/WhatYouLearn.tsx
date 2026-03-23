import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { designTokens } from '../../theme/designTokens';

interface WhatYouLearnProps {
    learningOutcomes: string[];
}

const WhatYouLearn: React.FC<WhatYouLearnProps> = ({ learningOutcomes }) => {
    return (
        <Paper sx={{ 
            p: 4, 
            borderRadius: '16px', 
            border: `1px solid ${designTokens.colors.border}`, 
            boxShadow: 'none',
            mb: 6
        }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: designTokens.colors.textPrimary }}>
                What you'll learn
            </Typography>
            
            <Grid container spacing={2}>
                {learningOutcomes.map((outcome, idx) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <CheckIcon sx={{ color: '#1db954', fontSize: 20, mt: 0.2 }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                                {outcome}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default WhatYouLearn;
