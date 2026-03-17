import React from 'react';
import { 
    Card, 
    CardContent, 
    CardMedia, 
    Typography, 
    Box, 
    Rating, 
    LinearProgress 
} from '@mui/material';

interface CourseCardProps {
    title: string;
    instructor: string;
    thumbnail: string;
    rating: number;
    reviewsCount: number;
    price?: number;
    originalPrice?: number;
    progress?: number; // 0 to 100
    category?: string;
    bestSeller?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
    title,
    instructor,
    thumbnail,
    rating,
    reviewsCount,
    price,
    originalPrice,
    progress,
    category,
    bestSeller
}) => {
    const isEnrolled = progress !== undefined;

    return (
        <Card 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                }
            }}
        >
            <CardMedia
                component="img"
                height="145"
                image={thumbnail || 'https://via.placeholder.com/300x150?text=Course+Thumbnail'}
                alt={title}
                sx={{ borderBottom: '1px solid #d1d7dc' }}
            />
            <CardContent sx={{ flexGrow: 1, p: 1.5, '&:last-child': { pb: 1.5 } }}>
                {category && (
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            fontWeight: 700, 
                            color: 'primary.main', 
                            textTransform: 'uppercase',
                            fontSize: '0.65rem'
                        }}
                    >
                        {category}
                    </Typography>
                )}
                <Typography 
                    variant="subtitle1" 
                    sx={{ 
                        fontWeight: 700, 
                        lineHeight: 1.2, 
                        mb: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '2.4em'
                    }}
                >
                    {title}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    {instructor}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, mr: 0.5, color: '#b4690e' }}>
                        {rating.toFixed(1)}
                    </Typography>
                    <Rating value={rating} precision={0.1} size="small" readOnly sx={{ color: '#b4690e', fontSize: '0.875rem' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                        ({reviewsCount.toLocaleString()})
                    </Typography>
                </Box>

                {isEnrolled ? (
                    <Box sx={{ mt: 'auto' }}>
                        <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            sx={{ 
                                height: 6, 
                                borderRadius: 3, 
                                bgcolor: '#d1d7dc',
                                '& .MuiLinearProgress-bar': { borderRadius: 3 }
                            }} 
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="caption" fontWeight={700}>
                                {progress}% complete
                            </Typography>
                            <Typography variant="caption" sx={{ '&:hover': { color: 'primary.main', cursor: 'pointer' } }}>
                                Leave a rating
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ mt: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                ₹{price?.toLocaleString()}
                            </Typography>
                            {originalPrice && (
                                <Typography variant="body2" sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>
                                    ₹{originalPrice.toLocaleString()}
                                </Typography>
                            )}
                        </Box>
                        {bestSeller && (
                            <Box 
                                sx={{ 
                                    mt: 0.5, 
                                    display: 'inline-block', 
                                    bgcolor: '#eceb98', 
                                    px: 1, 
                                    py: 0.2, 
                                    fontSize: '0.75rem', 
                                    fontWeight: 700 
                                }}
                            >
                                Bestseller
                            </Box>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default CourseCard;
