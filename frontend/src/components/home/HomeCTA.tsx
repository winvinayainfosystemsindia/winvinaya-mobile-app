import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { designTokens } from '../../theme/designTokens';

const HomeCTA: React.FC = () => {
  return (
    <Box sx={{ bgcolor: designTokens.colors.surface, py: 8, px: 2 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            py: { xs: 8, md: 10 },
            px: { xs: 4, md: 10 },
            borderRadius: '32px',
            background: `linear-gradient(135deg, ${designTokens.colors.primary} 0%, ${designTokens.colors.primaryDark} 100%)`,
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 30px 60px -12px rgba(0, 85, 209, 0.3)',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 10 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.25rem', md: '3.5rem' },
                mb: 3,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Begin Your Scholarly Journey.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.25rem',
                opacity: 0.9,
                mb: 6,
                maxWidth: 700,
                mx: 'auto',
                fontWeight: 300,
              }}
            >
              Join over 1 million learners worldwide and get unlimited access to curated high-end content.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'white',
                  color: designTokens.colors.primary,
                  px: 6,
                  py: 2.5,
                  fontSize: '1.125rem',
                  fontWeight: 800,
                  borderRadius: `${designTokens.shape.cardBorderRadius}px`,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: designTokens.colors.sidebarHover, transform: 'translateY(-2px)' },
                }}
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: 'white',
                  borderWidth: '2px',
                  px: 6,
                  py: 2.5,
                  fontSize: '1.125rem',
                  fontWeight: 800,
                  borderRadius: `${designTokens.shape.cardBorderRadius}px`,
                  backdropFilter: 'blur(10px)',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)', borderWidth: '2px' },
                }}
              >
                Enterprise Solutions
              </Button>
            </Stack>
          </Box>
          
          {/* Abstract background shapes */}
          <Box 
            sx={{ 
              position: 'absolute', top: -100, right: -100, 
              width: 400, height: 400, borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.05)', filter: 'blur(80px)' 
            }} 
          />
          <Box 
            sx={{ 
              position: 'absolute', bottom: -100, left: -100, 
              width: 300, height: 300, borderRadius: '50%',
              bgcolor: 'rgba(0, 194, 146, 0.1)', filter: 'blur(80px)' 
            }} 
          />
        </Box>
      </Container>
    </Box>
  );
};

export default HomeCTA;
