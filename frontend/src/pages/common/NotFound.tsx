import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: 'rgba(79, 70, 229, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <ErrorIcon sx={{ fontSize: 64, color: '#4f46e5' }} />
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '6rem', md: '10rem' },
              fontWeight: 900,
              lineHeight: 1,
              color: '#1e293b',
              mb: -1,
              letterSpacing: '-0.05em'
            }}
          >
            404
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#334155',
              letterSpacing: '-0.02em'
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              fontSize: '1.1rem',
              maxWidth: 400,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              mt: 2,
              px: 6,
              py: 1.8,
              borderRadius: '12px',
              bgcolor: '#4f46e5',
              fontWeight: 800,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
              '&:hover': {
                bgcolor: '#4338ca',
                boxShadow: '0 20px 25px -5px rgba(79, 70, 229, 0.4)'
              }
            }}
          >
            Back to Home Library
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
