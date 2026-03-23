import React from 'react';
import { Box, Typography, Card, CardContent, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { designTokens } from '../../theme/designTokens';

interface CourseCardProps {
    thumbnail: string;
    category: string;
    title: string;
    progress: number;
}

const CourseCard: React.FC<CourseCardProps> = ({
    thumbnail,
    category,
    title,
    progress
}) => {
    const navigate = useNavigate();

    return (
        <Card 
            onClick={() => navigate('/courses/1')} // Temporary hardcoded ID for demo
            sx={{ 
                borderRadius: '16px', 
                boxShadow: 'none', 
                border: `1px solid ${designTokens.colors.border}`,
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                height: '100%',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.06)'
                }
            }}
        >
            <Box sx={{ position: 'relative', pt: '56.25%', bgcolor: '#eee' }}>
                <Box 
                    component="img"
                    src={thumbnail}
                    alt={title}
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
            <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" sx={{ 
                    color: designTokens.colors.tertiaryDark, 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.1em',
                    fontSize: '11px',
                    display: 'block',
                    mb: 1
                }}>
                    {category}
                </Typography>
                <Typography variant="body1" sx={{ 
                    fontWeight: 700, 
                    color: designTokens.colors.textPrimary, 
                    mb: 3,
                    lineHeight: 1.4,
                    height: '2.8em',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                }}>
                    {title}
                </Typography>
                
                <Box sx={{ mt: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" sx={{ color: designTokens.colors.textSecondary, fontWeight: 700 }}>
                            Progress
                        </Typography>
                        <Typography variant="caption" sx={{ color: designTokens.colors.textPrimary, fontWeight: 800 }}>
                            {progress}%
                        </Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ 
                            height: 6, 
                            borderRadius: '3px',
                            bgcolor: '#EDF2F7',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: designTokens.colors.tertiary,
                                borderRadius: '3px'
                            }
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default CourseCard;
