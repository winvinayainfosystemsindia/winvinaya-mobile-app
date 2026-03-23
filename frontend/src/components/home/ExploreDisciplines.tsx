import React from 'react';
import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { CATEGORIES } from '../../data/home/homeData';

const ExploreDisciplines: React.FC = () => {
  return (
    <Box sx={{ py: 12, borderBottom: '1px solid #f1f5f9' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 8 }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.75rem' },
                color: '#0f172a',
                letterSpacing: '-0.03em'
              }}
            >
              Explore Disciplines
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 500, fontSize: '1.1rem', lineHeight: 1.6 }}>
              Discover curated pathways across the most impactful fields of study, designed for academic excellence.
            </Typography>
          </Box>
          <Button
            endIcon={<ArrowForward sx={{ fontSize: 18 }} />}
            sx={{
              color: '#0055d1',
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': { bgcolor: 'transparent', gap: 0.5, transition: 'all 0.2s' }
            }}
          >
            Explore all fields
          </Button>
        </Box>

        {/* Categories Grid - Using Grid2 for matching Hero.tsx */}
        <Grid container spacing={4}>
          {/* Left Columns (4 cards in 2 columns) */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CategoryCard cat={CATEGORIES[0]} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CategoryCard cat={CATEGORIES[1]} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CategoryCard cat={CATEGORIES[2]} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CategoryCard cat={CATEGORIES[3]} />
              </Grid>
            </Grid>
          </Grid>

          {/* Right Column (Feature card) */}
          <Grid size={{ xs: 12, md: 4 }}>
            <CategoryCard cat={CATEGORIES[4]} isFeature />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const CategoryCard = ({ cat, isFeature }: { cat: any, isFeature?: boolean }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 5,
        borderRadius: '24px',
        bgcolor: isFeature ? '#0055d1' : '#ffffff',
        color: isFeature ? '#ffffff' : 'inherit',
        border: isFeature ? 'none' : '1px solid #f1f5f9',
        boxShadow: isFeature ? 'none' : '0 4px 20px rgba(0,0,0,0.02)',
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: isFeature ? '0 30px 60px rgba(0, 85, 209, 0.25)' : '0 20px 40px rgba(0,0,0,0.06)',
          borderColor: isFeature ? 'none' : '#e2e8f0'
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {!isFeature && (
          <Box
            sx={{
              width: 48, height: 48, borderRadius: '12px',
              bgcolor: 'rgba(241, 245, 249, 1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mb: 4, color: cat.color
            }}
          >
            {React.cloneElement(cat.icon as React.ReactElement<any>, { sx: { fontSize: 24 } })}
          </Box>
        )}

        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            mb: 2,
            color: isFeature ? '#fff' : '#0f172a',
            fontSize: isFeature ? '2.5rem' : '1.75rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}
        >
          {cat.title}
        </Typography>
        <Typography
          sx={{
            color: isFeature ? 'rgba(255,255,255,0.9)' : '#64748b',
            fontSize: '1rem',
            mb: 4,
            lineHeight: 1.6,
            maxWidth: isFeature ? '100%' : '90%'
          }}
        >
          {cat.desc}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          {isFeature ? (
            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: 'rgba(255,255,255,0.15)',
                color: '#fff',
                backdropFilter: 'blur(12px)',
                fontWeight: 900,
                py: 2.5,
                borderRadius: '16px',
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: 'none',
                border: '1px solid rgba(255,255,255,0.2)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.25)',
                  boxShadow: 'none'
                }
              }}
            >
              Explore Field
            </Button>
          ) : (
            <Typography
              sx={{
                color: '#0055d1',
                fontWeight: 800,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {cat.courses} Courses
            </Typography>
          )}
        </Box>
      </Box>

      {/* Decorative background for feature card */}
      {isFeature && (
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            right: -50,
            opacity: 0.1,
            color: '#fff',
            transform: 'rotate(-15deg)',
            zIndex: 1
          }}
        >
          {React.cloneElement(cat.icon as React.ReactElement<any>, { sx: { fontSize: 300 } })}
        </Box>
      )}
    </Paper>
  );
};

export default ExploreDisciplines;
