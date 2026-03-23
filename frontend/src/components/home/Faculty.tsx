import React from 'react';
import { Box, Container, Typography, Grid, Stack, Divider } from '@mui/material';
import { FACULTY } from '../../data/home/homeData';
import { designTokens } from '../../theme/designTokens';

const Faculty: React.FC = () => {
  return (
    <Box sx={{ bgcolor: designTokens.colors.surface, py: 10, px: 2 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, fontSize: '2rem', color: designTokens.colors.textPrimary }}>World-Class Faculty</Typography>
          <Typography variant="body1" sx={{ color: designTokens.colors.textSecondary, maxWidth: 600, mx: 'auto' }}>
            Learn from the leading minds shaping the future of global industry and academia.
          </Typography>
        </Box>

        <Grid container spacing={8}>
          {FACULTY.map((member) => (
            <Grid key={member.name} size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 160, height: 160, borderRadius: '50%',
                    mx: 'auto', mb: 3, overflow: 'hidden',
                    position: 'relative', boxShadow: designTokens.shadows.card,
                    '& img': {
                      width: '100%', height: '100%', objectFit: 'cover',
                      filter: 'grayscale(100%)', transition: 'all 0.5s ease',
                    },
                    '&:hover img': { filter: 'grayscale(0%)' }
                  }}
                >
                  <img src={member.image} alt={member.name} />
                  <Box sx={{ position: 'absolute', inset: 0, border: '6px solid rgba(255,255,255,0.2)', borderRadius: '50%' }} />
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: designTokens.colors.textPrimary, fontSize: '1.25rem' }}>{member.name}</Typography>
                <Typography sx={{ color: member.tagColor, fontWeight: 700, fontSize: '0.85rem', mb: 1.5 }}>
                  {member.title}
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.textSecondary, px: 2, mb: 3, lineHeight: 1.6 }}>
                  {member.desc}
                </Typography>

                <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
                  <Box>
                    <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: designTokens.colors.textPrimary }}>{member.students}</Typography>
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 800, color: designTokens.colors.textSecondary, opacity: 0.7 }}>Students</Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />
                  <Box>
                    <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: designTokens.colors.textPrimary }}>{member.courses}</Typography>
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 800, color: designTokens.colors.textSecondary, opacity: 0.7 }}>Courses</Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Faculty;
