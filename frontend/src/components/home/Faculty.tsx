import React from 'react';
import { Box, Container, Typography, Grid, Stack, Divider } from '@mui/material';
import { FACULTY } from '../../data/home/homeData';

const Faculty: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'white', py: 15, px: 2 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 12 }}>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, fontSize: '2.5rem' }}>World-Class Faculty</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
            Learn from the leading minds shaping the future of global industry and academia.
          </Typography>
        </Box>

        <Grid container spacing={8}>
          {FACULTY.map((member) => (
            <Grid key={member.name} size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 200, height: 200, borderRadius: '50%',
                    mx: 'auto', mb: 4, overflow: 'hidden',
                    position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
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

                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{member.name}</Typography>
                <Typography sx={{ color: member.tagColor, fontWeight: 700, fontSize: '0.875rem', mb: 2 }}>
                  {member.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', px: 2, mb: 4, lineHeight: 1.6 }}>
                  {member.desc}
                </Typography>

                <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
                  <Box>
                    <Typography sx={{ fontWeight: 900, fontSize: '1.25rem' }}>{member.students}</Typography>
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 800, opacity: 0.5 }}>Students</Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />
                  <Box>
                    <Typography sx={{ fontWeight: 900, fontSize: '1.25rem' }}>{member.courses}</Typography>
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 800, opacity: 0.5 }}>Courses</Typography>
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
