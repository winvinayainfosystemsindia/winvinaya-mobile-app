import React from 'react';
import { Box, Container, Typography, Button, Grid, Stack, Paper } from '@mui/material';
import { designTokens } from '../../theme/designTokens';
import { VerifiedUser } from '@mui/icons-material';

const Hero: React.FC = () => {
  return (
    <Box sx={{ bgcolor: designTokens.colors.surface, py: { xs: 8, md: 10 }, px: 2, overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <Grid container alignItems="center" spacing={8}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                component="span"
                sx={{
                  display: 'inline-block',
                  px: 2,
                  py: 0.5,
                  borderRadius: designTokens.shape.pillRadius,
                  bgcolor: designTokens.colors.primaryLight,
                  color: designTokens.colors.primaryDark,
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Premium Academic Learning
              </Typography>
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.5rem', md: '3.75rem' },
                lineHeight: 1.1,
                mb: 3,
                color: designTokens.colors.textPrimary,
                letterSpacing: '-0.02em',
              }}
            >
              Cultivating <Typography component="span" variant="inherit" sx={{ color: designTokens.colors.primary, fontStyle: 'italic' }}>Excellence</Typography> Through Curated Knowledge.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.125rem',
                color: designTokens.colors.textSecondary,
                mb: 5,
                maxWidth: 580,
                lineHeight: 1.8,
                fontWeight: 300,
              }}
            >
              Access world-class education from distinguished scholars. We treat educational content not as data, but as knowledge to be showcased.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: `${designTokens.shape.borderRadius}px`,
                  boxShadow: `0 10px 20px rgba(0, 86, 210, 0.15)`,
                  textTransform: 'none',
                }}
              >
                Start Learning Now
              </Button>
              <Button
                variant="contained"
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: `${designTokens.shape.borderRadius}px`,
                  bgcolor: designTokens.colors.secondaryLight,
                  color: designTokens.colors.secondaryDark,
                  '&:hover': { bgcolor: '#e2e5ec' },
                  textTransform: 'none',
                  boxShadow: 'none',
                }}
              >
                View All Courses
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '2rem',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  position: 'relative',
                  zIndex: 2,
                  '& img': {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.7s ease',
                    '&:hover': { transform: 'scale(1.05)' }
                  }
                }}
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiSn46OzYoBGQqQMi8GlVT-4hSWw7K5SQQ-O_Ors5S9jpHDjzoGmCa4kJovDmt0hWOj10xJSQEQuqzIXHXUAb8RxKcdTB_Y17CJqHlYdlC1FsgBTkDtrzmxmCuIUPxsz2U3EM0aDWy4_pmearRgkibGG37YvptIwkSXKVbv9G24z0YIwr2M0sI_MucnG3aod3kUKDCU9UwOI1woxGskTmx9TQK1zZdYprkTYAtlY4E-aQ0zeLkQJg_sIcRD1xr-jQMIg57SgQd-muN"
                  alt="Student Studying"
                />
              </Box>

              {/* Overlay Badge */}
              <Paper
                elevation={10}
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  p: 3,
                  borderRadius: '20px',
                  maxWidth: 240,
                  zIndex: 10,
                  display: { xs: 'none', sm: 'block' },
                  border: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      width: 40, height: 40, borderRadius: '10px',
                      bgcolor: designTokens.colors.tertiaryLight, display: 'flex',
                      alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <VerifiedUser sx={{ color: designTokens.colors.tertiary }} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Certified Content</Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  All courses are peer-reviewed by our global academic board for quality assurance.
                </Typography>
              </Paper>

              {/* Decorative Circle */}
              <Box
                sx={{
                  position: 'absolute', top: -40, right: -20,
                  width: 200, height: 200, borderRadius: '50%',
                  bgcolor: 'rgba(178, 197, 255, 0.2)', filter: 'blur(60px)',
                  zIndex: 1
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
