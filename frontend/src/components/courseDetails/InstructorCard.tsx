import React from 'react';
import { Box, Typography, Avatar, Stack, Button } from '@mui/material';
import { 
    Star as StarIcon, 
    People as PeopleIcon, 
    PlayCircleFilled as CourseIcon 
} from '@mui/icons-material';
import { designTokens } from '../../theme/designTokens';

interface InstructorCardProps {
    name: string;
    title: string;
    avatar: string;
    rating: number;
    totalStudents: string;
    totalCourses: number;
    bio: string;
}

const InstructorCard: React.FC<InstructorCardProps> = ({
    name,
    title,
    avatar,
    rating,
    totalStudents,
    totalCourses,
    bio
}) => {
    return (
        <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: designTokens.colors.textPrimary }}>
                Instructor
            </Typography>
            
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: designTokens.colors.primary, fontWeight: 800, mb: 0.5 }}>
                    {name}
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.textSecondary, fontWeight: 500 }}>
                    {title}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 4, mb: 3, alignItems: 'flex-start' }}>
                <Avatar 
                    src={avatar} 
                    sx={{ width: 100, height: 100, borderRadius: '50%' }} 
                />
                
                <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <StarIcon sx={{ color: '#f69c08', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{rating} Instructor Rating</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PeopleIcon sx={{ color: '#64748b', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{totalStudents} Students</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CourseIcon sx={{ color: '#64748b', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{totalCourses} Courses</Typography>
                    </Box>
                </Stack>
            </Box>

            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 3 }}>
                {bio}
            </Typography>

            <Button
                variant="outlined"
                sx={{ 
                    fontWeight: 700, 
                    textTransform: 'none', 
                    color: designTokens.colors.secondary,
                    borderColor: designTokens.colors.border,
                    px: 3,
                    py: 1.2,
                    borderRadius: '8px',
                    '&:hover': { borderColor: designTokens.colors.secondary, bgcolor: 'transparent' }
                }}
            >
                View Profile
            </Button>
        </Box>
    );
};

export default InstructorCard;
