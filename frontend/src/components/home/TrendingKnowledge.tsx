import React from 'react';
import { Box, Container, Typography, Grid, IconButton, Rating, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight, AddShoppingCart, Star } from '@mui/icons-material';
import { TRENDING_COURSES } from '../../data/homeData';

const TrendingKnowledge: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#ffffff', py: 12 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: '#0f172a',
                letterSpacing: '-0.03em',
                mb: 1
              }}
            >
              Trending Knowledge
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
              Most-watched courses from the world's leading experts.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton
              sx={{
                width: 50,
                height: 50,
                border: '1px solid #e2e8f0',
                bgcolor: 'white',
                color: '#0f172a',
                '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              sx={{
                width: 50,
                height: 50,
                border: '1px solid #e2e8f0',
                bgcolor: 'white',
                color: '#0f172a',
                '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
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
        borderRadius: '20px',
        overflow: 'hidden',
        bgcolor: '#ffffff',
        border: '1px solid #f1f5f9',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-10px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
          borderColor: '#e2e8f0',
          '& .course-image': { transform: 'scale(1.08)' },
          '& .cart-btn': { bgcolor: '#0055d1', color: 'white' }
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
              bgcolor: '#ffffff',
              color: '#0f172a',
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
            color: '#10b981',
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
            fontSize: '1.2rem',
            lineHeight: 1.3,
            color: '#0f172a',
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
            color: '#64748b',
            fontSize: '0.9rem',
            mb: 2.5,
            fontWeight: 500
          }}
        >
          {course.instructor}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 'auto' }}>
          <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{course.rating}</Typography>
          <Rating
            value={course.rating}
            precision={0.1}
            readOnly
            size="small"
            icon={<Star fontSize="inherit" sx={{ color: '#f59e0b' }} />}
            emptyIcon={<Star fontSize="inherit" sx={{ color: '#e2e8f0' }} />}
          />
          <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>({course.reviews.toLocaleString()})</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              fontSize: '1.75rem',
              color: '#0f172a',
              letterSpacing: '-0.02em'
            }}
          >
            {course.price}
          </Typography>
          <IconButton
            className="cart-btn"
            sx={{
              width: 44,
              height: 44,
              bgcolor: '#f1f5f9',
              color: '#0055d1',
              transition: 'all 0.3s',
              '&:hover': { bgcolor: '#0055d1', color: 'white' }
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
