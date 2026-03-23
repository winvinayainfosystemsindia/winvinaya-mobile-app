import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { designTokens } from '../../theme/designTokens';
import ActivityItem from './ActivityItem';

interface Activity {
    id: string;
    type: 'quiz' | 'download' | 'discussion';
    title: string;
    meta: string;
}

interface RecentActivityProps {
    activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: designTokens.colors.textPrimary, mb: 3 }}>
                Recent Activity
            </Typography>
            <Paper sx={{ 
                p: { xs: 2, sm: 3 }, 
                borderRadius: '20px', 
                border: `1px solid ${designTokens.colors.border}`, 
                boxShadow: 'none',
                bgcolor: '#ffffff'
            }}>
                {activities.map((activity) => (
                    <ActivityItem 
                        key={activity.id}
                        type={activity.type}
                        title={activity.title}
                        meta={activity.meta}
                    />
                ))}
            </Paper>
        </Box>
    );
};

export default RecentActivity;
