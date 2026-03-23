import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  LinearProgress,
  Chip,
} from '@mui/material';
import { designTokens } from '../../theme/designTokens';

interface CourseCardProps {
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  reviewsCount: number;
  price?: number;
  originalPrice?: number;
  progress?: number;    // 0–100 when enrolled
  category?: string;
  bestSeller?: boolean;
  onClick?: () => void;
}

const getDiscount = (price: number, original: number) =>
  Math.round(((original - price) / original) * 100);

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
  bestSeller,
  onClick,
}) => {
  const isEnrolled = progress !== undefined;

  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        // Hover handled by MUI theme override (translateY + shadow)
      }}
    >
      {/* Thumbnail */}
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <CardMedia
          component="img"
          height="145"
          image={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop'}
          alt={title}
          sx={{ display: 'block', objectFit: 'cover' }}
        />
        {bestSeller && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              bgcolor: '#eceb98',
              color: '#3d3c0a',
              px: 1,
              py: 0.2,
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.02em',
            }}
          >
            Bestseller
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 1.5, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 1.5 } }}>
        {/* Category pill */}
        {category && !isEnrolled && (
          <Chip
            label={category}
            size="small"
            sx={{
              mb: 0.75,
              bgcolor: designTokens.colors.primaryLight,
              color: designTokens.colors.primary,
              fontWeight: 700,
              fontSize: '10px',
              height: '20px',
              alignSelf: 'flex-start',
            }}
          />
        )}

        {/* Title */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            lineHeight: 1.25,
            mb: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: '14px',
          }}
        >
          {title}
        </Typography>

        {/* Instructor */}
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mb: 0.75, fontSize: '12px' }}
        >
          {instructor}
        </Typography>

        {/* Rating row */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 800, mr: 0.5, color: '#b4690e', fontSize: '13px' }}
          >
            {(rating || 0).toFixed(1)}
          </Typography>
          <Rating
            value={rating || 0}
            precision={0.5}
            size="small"
            readOnly
            sx={{ color: '#e59819', fontSize: '0.8rem' }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, fontSize: '11px' }}>
            ({reviewsCount.toLocaleString()})
          </Typography>
        </Box>

        {/* Bottom section — either progress or price */}
        <Box sx={{ mt: 'auto' }}>
          {isEnrolled ? (
            <Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6, borderRadius: 3,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: progress! >= 100
                      ? designTokens.colors.success
                      : designTokens.colors.accent,
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" fontWeight={700} sx={{ fontSize: '11px' }}>
                  {progress}% complete
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: '11px', color: designTokens.colors.primary, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  Rate this course
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              {price !== undefined ? (
                <>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '15px' }}>
                    ₹{price.toLocaleString()}
                  </Typography>
                  {originalPrice && (
                    <>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', textDecoration: 'line-through', fontSize: '12px' }}
                      >
                        ₹{originalPrice.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: designTokens.colors.accentWarm, fontWeight: 700, fontSize: '11px' }}
                      >
                        {getDiscount(price, originalPrice)}% off
                      </Typography>
                    </>
                  )}
                </>
              ) : (
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 800, color: designTokens.colors.success, fontSize: '14px' }}
                >
                  Free
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
