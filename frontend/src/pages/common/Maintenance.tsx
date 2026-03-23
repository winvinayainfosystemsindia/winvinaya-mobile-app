import React from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { Construction as ConstructionIcon, Engineering as EngineeringIcon } from '@mui/icons-material';

const Maintenance: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0f172a',
        color: '#ffffff',
        textAlign: 'center',
        px: 3,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          bgcolor: 'rgba(79, 70, 229, 0.1)',
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          bgcolor: 'rgba(124, 58, 237, 0.1)',
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4
          }}
        >
          <Stack direction="row" spacing={-2} sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '20px',
                bgcolor: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(79, 70, 229, 0.3)',
                transform: 'rotate(-10deg)'
              }}
            >
              <ConstructionIcon sx={{ fontSize: 40, color: '#ffffff' }} />
            </Box>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '20px',
                bgcolor: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(124, 58, 237, 0.3)',
                transform: 'rotate(10deg)',
                mt: 4
              }}
            >
              <EngineeringIcon sx={{ fontSize: 40, color: '#ffffff' }} />
            </Box>
          </Stack>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #818cf8, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Enhancing Your Experience
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#f1f5f9',
              opacity: 0.9
            }}
          >
            We're currently curating something special.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#94a3b8',
              fontSize: '1.1rem',
              lineHeight: 1.7,
              maxWidth: 450,
              mx: 'auto'
            }}
          >
            The Academic Curator is undergoing scheduled maintenance to bring you new features and improved performance. We'll be back shortly.
          </Typography>

          <Box
            sx={{
              mt: 2,
              p: 3,
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              bgcolor: 'rgba(255, 255, 255, 0.03)',
              width: '100%',
              maxWidth: 320
            }}
          >
            <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', mb: 1 }}>
              Estimated Recovery
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff' }}>
              Approximately 2 Hours
            </Typography>
          </Box>

          <Button
            variant="text"
            sx={{
              color: '#94a3b8',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { color: '#ffffff' }
            }}
            onClick={() => window.location.reload()}
          >
            Click here to check if we're back
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Maintenance;
