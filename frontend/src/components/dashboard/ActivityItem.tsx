import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { 
    CheckCircle as CheckCircleIcon, 
    Article as ArticleIcon, 
    ChatBubble as ChatBubbleIcon 
} from '@mui/icons-material';
import { designTokens } from '../../theme/designTokens';

interface ActivityItemProps {
    type: 'quiz' | 'download' | 'discussion';
    title: string;
    meta: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ type, title, meta }) => {
    const getIcon = () => {
        switch (type) {
            case 'quiz': return <CheckCircleIcon sx={{ color: designTokens.colors.primary, fontSize: 20 }} />;
            case 'download': return <ArticleIcon sx={{ color: designTokens.colors.tertiary, fontSize: 20 }} />;
            case 'discussion': return <ChatBubbleIcon sx={{ color: '#805AD5', fontSize: 20 }} />;
            default: return null;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'quiz': return designTokens.colors.primaryLight;
            case 'download': return designTokens.colors.tertiaryLight;
            case 'discussion': return '#FAF5FF';
            default: return 'transparent';
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 2, borderBottom: `1px solid ${designTokens.colors.border}`, '&:last-child': { borderBottom: 'none' } }}>
            <Avatar sx={{ bgcolor: getBgColor(), width: 40, height: 40 }}>
                {getIcon()}
            </Avatar>
            <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: designTokens.colors.textPrimary, mb: 0.5 }}>
                    {title}
                </Typography>
                <Typography variant="caption" sx={{ color: designTokens.colors.textSecondary, fontWeight: 500 }}>
                    {meta}
                </Typography>
            </Box>
        </Box>
    );
};

export default ActivityItem;
