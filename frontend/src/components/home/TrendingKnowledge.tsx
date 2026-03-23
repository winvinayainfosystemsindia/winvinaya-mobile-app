import React from 'react';
import { Box, Container, Typography, Grid, IconButton, Rating, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight, AddShoppingCart, Star } from '@mui/icons-material';
import { TRENDING_COURSES } from '../../data/home/homeData';
import { designTokens } from '../../theme/designTokens';

const TrendingKnowledge: React.FC = () => {
  return (
    <Box sx={{ bgcolor: designTokens.colors.surface, py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                color: designTokens.colors.textPrimary,
                letterSpacing: '-0.02em',
                mb: 1
              }}
            >
              Trending Knowledge
            </Typography>
            <Typography variant="body1" sx={{ color: designTokens.colors.textSecondary, fontSize: '1rem' }}>
              Most-watched courses from the world's leading experts.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton
              sx={{
                width: 44,
                height: 44,
                border: `1px solid ${designTokens.colors.border}`,
                bgcolor: designTokens.colors.surface,
                color: designTokens.colors.textPrimary,
                '&:hover': { bgcolor: designTokens.colors.bg, borderColor: designTokens.colors.border }
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              sx={{
                width: 44,
                height: 44,
                border: `1px solid ${designTokens.colors.border}`,
                bgcolor: designTokens.colors.surface,
                color: designTokens.colors.textPrimary,
                '&:hover': { bgcolor: designTokens.colors.bg, borderColor: designTokens.colors.border }
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {TRENDING_COURSES.map((course, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, lg: 3 }}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const CourseCard = ({ course }: { course: any }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: `${designTokens.shape.cardBorderRadius}px`,
        overflow: 'hidden',
        bgcolor: designTokens.colors.surface,
        border: `1px solid ${designTokens.colors.border}`,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-10px)',
          boxShadow: designTokens.shadows.cardHover,
          borderColor: designTokens.colors.border,
          '& .course-image': { transform: 'scale(1.08)' },
          '& .cart-btn': { bgcolor: designTokens.colors.primary, color: 'white' }
        }
      }}
    >
      <Box sx={{ position: 'relative', pt: '65%', overflow: 'hidden' }}>
        <img
          src={course.image}
          alt={course.title}
          className="course-image"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        {course.bestseller && (
          <Box
            sx={{
              position: 'absolute', top: 16, left: 16,
              bgcolor: designTokens.colors.surface,
              color: designTokens.colors.textPrimary,
              px: 1.5,
              py: 0.6,
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              zIndex: 1
            }}
          >
            Bestseller
          </Box>
        )}
      </Box>

      <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          sx={{
            color: designTokens.colors.tertiary,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: '11px',
            mb: 1.5
          }}
        >
          {course.category}
        </Typography>

        <Typography
          sx={{
            fontWeight: 800,
            mb: 1.5,
            fontSize: '1.1rem',
            lineHeight: 1.3,
            color: designTokens.colors.textPrimary,
            height: '3.12rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {course.title}
        </Typography>

        <Typography
          sx={{
            color: designTokens.colors.textSecondary,
            fontSize: '0.9rem',
            mb: 2,
            fontWeight: 500
          }}
        >
          {course.instructor}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 'auto' }}>
          <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: designTokens.colors.textPrimary }}>{course.rating}</Typography>
          <Rating
            value={course.rating}
            precision={0.1}
            readOnly
            size="small"
            icon={<Star fontSize="inherit" sx={{ color: designTokens.colors.accent }} />}
            emptyIcon={<Star fontSize="inherit" sx={{ color: designTokens.colors.border }} />}
          />
          <Typography sx={{ color: designTokens.colors.textSecondary, fontSize: '0.85rem', opacity: 0.8 }}>({course.reviews.toLocaleString()})</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              fontSize: '1.5rem',
              color: designTokens.colors.textPrimary,
              letterSpacing: '-0.02em'
            }}
          >
            {course.price}
          </Typography>
          <IconButton
            className="cart-btn"
            sx={{
              width: 40,
              height: 40,
              bgcolor: designTokens.colors.sidebarHover,
              color: designTokens.colors.primary,
              transition: 'all 0.3s',
              '&:hover': { bgcolor: designTokens.colors.primary, color: 'white' }
            }}
          >
            <AddShoppingCart fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default TrendingKnowledge;
