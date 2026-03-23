import React from 'react';
import { Box, Container, Typography, Stack, Button, Paper, LinearProgress } from '@mui/material';
import { CheckCircle, PlayCircle } from '@mui/icons-material';
import { designTokens } from '../../theme/designTokens';

const PersonalizedPath: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#f1f5f9', py: 15, px: 2, overflow: 'hidden', position: 'relative' }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={12} alignItems="center">
          <Box sx={{ flex: 1, position: 'relative', order: { xs: 2, lg: 1 } }}>
            <Paper
              elevation={20}
              sx={{
                p: 5,
                borderRadius: '24px',
                maxWidth: 440,
                mx: 'auto',
                position: 'relative',
                zIndex: 2,
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 5 }}>Your Learning Path</Typography>
              
              <Stack spacing={4}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Machine Learning A-Z</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: designTokens.colors.success }}>78%</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={78} 
                    sx={{ 
                      height: 8, borderRadius: 10, bgcolor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': { borderRadius: 10, background: 'linear-gradient(90deg, #006b4f 0%, #008765 100%)' }
                    }} 
                  />
                </Box>
                
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Applied Macroeconomics</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: designTokens.colors.success }}>32%</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={32} 
                    sx={{ 
                      height: 8, borderRadius: 10, bgcolor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': { borderRadius: 10, background: 'linear-gradient(90deg, #006b4f 0%, #008765 100%)' }
                    }} 
                  />
                </Box>
                
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PlayCircle />}
                  sx={{
                    bgcolor: '#e6e8f2',
                    color: '#3470ec',
                    fontWeight: 800,
                    py: 2,
                    borderRadius: '12px',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#d8dae3' }
                  }}
                >
                  Continue Course
                </Button>
              </Stack>
            </Paper>
            
            {/* Blurry decor */}
            <Box sx={{ position: 'absolute', top: -40, right: 0, width: 160, height: 160, bgcolor: 'rgba(0, 194, 146, 0.1)', filter: 'blur(40px)', zIndex: 1 }} />
            <Box sx={{ position: 'absolute', bottom: -40, left: 0, width: 240, height: 240, bgcolor: 'rgba(0, 86, 210, 0.1)', filter: 'blur(60px)', zIndex: 1 }} />
          </Box>
          
          <Box sx={{ flex: 1, order: { xs: 1, lg: 2 } }}>
            <Typography variant="h2" sx={{ fontWeight: 900, fontSize: { xs: '2.5rem', md: '3.5rem' }, mb: 3, lineHeight: 1.1 }}>
              Tailored to <Typography component="span" variant="inherit" sx={{ color: designTokens.colors.success }}>Your Ambition</Typography>
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', mb: 5, lineHeight: 1.8, fontWeight: 300 }}>
              Our intelligent curator analyzes your progress and interests to suggest advanced tracks that build upon your current foundation.
            </Typography>
            
            <Stack spacing={2.5} sx={{ mb: 6 }}>
              {[
                'Cross-disciplinary insights',
                'Personalized certification tracks',
                'Early access to expert workshops'
              ].map((text, i) => (
                <Stack key={i} direction="row" spacing={2} alignItems="center">
                  <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: designTokens.colors.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle sx={{ color: 'white', fontSize: 16 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 600, color: designTokens.colors.textPrimary }}>{text}</Typography>
                </Stack>
              ))}
            </Stack>
            
            <Button
              variant="contained"
              sx={{
                bgcolor: '#191c23',
                color: 'white',
                px: 5,
                py: 2,
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 700,
                '&:hover': { bgcolor: '#2d323d' }
              }}
            >
              Explore Recommendations
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default PersonalizedPath;
