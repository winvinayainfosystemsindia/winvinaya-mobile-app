import React from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  Paper, 
  Avatar, 
  IconButton, 
  Stack
} from '@mui/material';
import { 
  FavoriteBorder, 
  Favorite, 
  AccessTime, 
  SignalCellularAlt,
  Star
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { designTokens } from '../../theme/designTokens';

export interface CatalogCourseCardProps {
  id: string | number;
  title: string;
  instructor: string;
  instructorAvatar?: string;
  thumbnail: string;
  rating: number;
  reviewsCount: number;
  price: number;
  level: string;
  duration: string;
  isBestseller?: boolean;
  isNew?: boolean;
  onClick?: () => void;
}

const CatalogCourseCard: React.FC<CatalogCourseCardProps> = ({
  id,
  title,
  instructor,
  instructorAvatar,
  thumbnail,
  rating,
  reviewsCount,
  price,
  level,
  duration,
  isBestseller,
  isNew,
  onClick
}) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  const handleCardClick = () => {
    if (onClick) onClick();
    else navigate(`/courses/${id}`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Paper
      elevation={0}
      onClick={handleCardClick}
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        bgcolor: '#ffffff',
        border: '1px solid #f1f5f9',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          borderColor: '#e2e8f0'
        }
      }}
    >
      {/* Thumbnail Area */}
      <Box sx={{ position: 'relative', pt: '56.25%', overflow: 'hidden' }}>
        <img
          src={thumbnail || 'https://via.placeholder.com/400x225'}
          alt={title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        
        {/* Badges */}
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}
        >
          {isBestseller && (
            <Box
              sx={{
                bgcolor: '#ffffff',
                color: '#0f172a',
                px: 1.5,
                py: 0.6,
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              Best Seller
            </Box>
          )}
          {isNew && (
            <Box
              sx={{
                bgcolor: '#10b981',
                color: '#ffffff',
                px: 1.5,
                py: 0.6,
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              New Arrival
            </Box>
          )}
        </Stack>

        {/* Wishlist Button */}
        <IconButton
          onClick={handleWishlistClick}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            color: isWishlisted ? '#ef4444' : '#ffffff',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.35)' }
          }}
          size="small"
        >
          {isWishlisted ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
        </IconButton>
      </Box>

      {/* Content Area */}
      <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Metadata row */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <AccessTime sx={{ fontSize: 16, color: '#64748b' }} />
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>{duration}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <SignalCellularAlt sx={{ fontSize: 16, color: '#64748b' }} />
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>{level}</Typography>
          </Stack>
        </Stack>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            mb: 2,
            fontSize: '1.1rem',
            lineHeight: 1.4,
            color: '#0f172a',
            height: '3.1rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </Typography>

        {/* Instructor */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
          <Avatar 
            src={instructorAvatar} 
            sx={{ width: 28, height: 28, bgcolor: designTokens.colors.primary }}
          >
            {instructor.charAt(0)}
          </Avatar>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
            {instructor}
          </Typography>
        </Stack>

        <Box sx={{ mt: 'auto' }}>
          {/* Rating */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{rating.toFixed(1)}</Typography>
            <Rating 
              value={rating} 
              precision={0.1} 
              readOnly 
              size="small"
              emptyIcon={<Star sx={{ opacity: 0.3 }} fontSize="inherit" />}
              sx={{ color: '#f59e0b' }} 
            />
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              ({reviewsCount.toLocaleString()} reviews)
            </Typography>
          </Stack>

          {/* Price */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 900,
              fontSize: '1.5rem',
              color: '#0055d1',
              letterSpacing: '-0.02em'
            }}
          >
            ₹{price.toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default CatalogCourseCard;
