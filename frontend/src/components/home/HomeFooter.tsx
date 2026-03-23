import React from 'react';
import { Box, Container, Typography, Grid, IconButton, Stack, Link } from '@mui/material';
import { Public, AlternateEmail, Share } from '@mui/icons-material';
import { designTokens } from '../../theme/designTokens';

const HomeFooter: React.FC = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', py: 12, px: 2 }}>
      <Container maxWidth="lg">
        <Grid container spacing={8} sx={{ mb: 10 }}>
          <Grid size={{ xs: 12, md: 4 }} sx={{ pr: { md: 8 } }}>
            <Typography 
              variant="h6" 
              sx={{ fontWeight: 900, color: '#0f172a', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              Academic Curator
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 4 }}>
              Redefining online education through elite curation and intellectual integrity. We bring you the most rigorous and impactful knowledge from global experts.
            </Typography>
            <Stack direction="row" spacing={2}>
              {[Public, AlternateEmail, Share].map((Icon, i) => (
                <IconButton 
                  key={i}
                  sx={{ 
                    bgcolor: '#e2e8f0', color: '#64748b', 
                    '&:hover': { bgcolor: designTokens.colors.primary, color: 'white' } 
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Grid>
          
          {[
            { 
              title: 'Education', 
              links: ['Course Catalog', 'Certifications', 'Degrees', 'Academic Board'] 
            },
            { 
              title: 'Community', 
              links: ['Blog', 'Help Center', 'Careers', 'Contact Support'] 
            },
            { 
              title: 'Legal', 
              links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'] 
            }
          ].map((column) => (
            <Grid key={column.title} size={{ xs: 6, md: 2.6 }}>
              <Typography 
                variant="caption" 
                sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#0f172a', mb: 4, display: 'block' }}
              >
                {column.title}
              </Typography>
              <Stack spacing={2}>
                {column.links.map((link) => (
                  <Link 
                    key={link} 
                    href="#" 
                    underline="none"
                    sx={{ 
                      color: 'text.secondary', fontSize: '0.875rem', 
                      '&:hover': { color: designTokens.colors.primary } 
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ pt: 6, borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
            © {new Date().getFullYear()} Academic Curator. Knowledge Showcased.
          </Typography>
          <Stack direction="row" spacing={4}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>EN / USD</Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>v2.4.0</Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default HomeFooter;
