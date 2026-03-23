import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { designTokens } from '../../theme/designTokens';

interface DashboardHeaderProps {
    userName: string;
    weeklyGoalPercent: number;
    onViewSchedule?: () => void;
    onResumeLast?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    userName,
    weeklyGoalPercent,
    onViewSchedule,
    onResumeLast
}) => {
    return (
        <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 3 }}>
            <Box>
                <Typography variant="h4" sx={{ 
                    fontWeight: 900, 
                    color: designTokens.colors.textPrimary,
                    mb: 1,
                    letterSpacing: '-0.02em'
                }}>
                    Welcome back, {userName}.
                </Typography>
                <Typography variant="body1" sx={{ color: designTokens.colors.textSecondary, fontWeight: 500 }}>
                    You've completed {weeklyGoalPercent}% of your weekly goal. Keep pushing!
                </Typography>
            </Box>
            
            <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                <Button 
                    variant="outlined" 
                    onClick={onViewSchedule}
                    sx={{ 
                        height: 48, 
                        px: 3, 
                        borderRadius: '8px', 
                        fontWeight: 700,
                        textTransform: 'none',
                        color: designTokens.colors.secondary,
                        borderColor: designTokens.colors.border,
                        '&:hover': { borderColor: designTokens.colors.secondary, bgcolor: 'transparent' }
                    }}
                >
                    View Schedule
                </Button>
                <Button 
                    variant="contained" 
                    onClick={onResumeLast}
                    sx={{ 
                        height: 48, 
                        px: 3, 
                        borderRadius: '8px', 
                        fontWeight: 700,
                        textTransform: 'none',
                        bgcolor: designTokens.colors.primary,
                        '&:hover': { bgcolor: designTokens.colors.primaryDark }
                    }}
                >
                    Resume Last Lesson
                </Button>
            </Stack>
        </Box>
    );
};

export default DashboardHeader;
