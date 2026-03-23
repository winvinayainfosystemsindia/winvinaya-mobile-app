import React from 'react';
import { Box, Typography, Card, CardContent, Paper, Stack } from '@mui/material';
import { designTokens } from '../../theme/designTokens';

interface RecommendedCourse {
    id: string;
    thumbnail: string;
    tag: string;
    title: string;
    duration: string;
    level: string;
}

interface RecommendedCoursesProps {
    courses: RecommendedCourse[];
}

const RecommendedCourses: React.FC<RecommendedCoursesProps> = ({ courses }) => {
    return (
        <Paper sx={{ 
            p: 3, 
            borderRadius: '20px', 
            border: `1px solid ${designTokens.colors.border}`, 
            boxShadow: 'none',
            bgcolor: '#ffffff'
        }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: designTokens.colors.textPrimary, mb: 3 }}>
                Recommended for You
            </Typography>
            
            <Stack spacing={3}>
                {courses.map((course) => (
                    <Card key={course.id} sx={{ 
                        borderRadius: '12px', 
                        boxShadow: 'none',
                        overflow: 'hidden',
                        border: '1px solid #F1F5F9',
                        transition: '0.2s',
                        '&:hover': { bgcolor: '#F8FAFC' }
                    }}>
                        <Box sx={{ position: 'relative', pt: '50%', bgcolor: '#eee' }}>
                            <Box 
                                component="img"
                                src={course.thumbnail}
                                alt={course.title}
                                sx={{ 
                                    position: 'absolute', 
                                    top: 0, 
                                    left: 0, 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover' 
                                }}
                            />
                        </Box>
                        <CardContent sx={{ p: 2 }}>
                            <Typography variant="caption" sx={{ 
                                color: designTokens.colors.primary, 
                                fontWeight: 800, 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.05em',
                                fontSize: '10px',
                                display: 'block',
                                mb: 0.5
                            }}>
                                {course.tag}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                                fontWeight: 700, 
                                color: designTokens.colors.textPrimary, 
                                mb: 1,
                                lineHeight: 1.4
                            }}>
                                {course.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                <Typography variant="caption" sx={{ color: designTokens.colors.textSecondary, fontWeight: 500 }}>
                                    {course.duration}
                                </Typography>
                                <Typography variant="caption" sx={{ color: designTokens.colors.textSecondary, fontWeight: 500 }}>
                                    •
                                </Typography>
                                <Typography variant="caption" sx={{ color: designTokens.colors.textSecondary, fontWeight: 500 }}>
                                    {course.level}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Paper>
    );
};

export default RecommendedCourses;
