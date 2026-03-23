import React from 'react';
import { Box, Container, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { useAppSelector } from '../store/hooks';
import { designTokens } from '../theme/designTokens';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Box sx={{ bgcolor: designTokens.colors.bg, minHeight: 'calc(100vh - 64px)', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: designTokens.colors.textPrimary, mb: 1 }}>
            Welcome back, {user?.full_name || 'Scholar'}!
          </Typography>
          <Typography variant="body1" sx={{ color: designTokens.colors.textSecondary }}>
            Manage your courses, tracking your progress, and continue your learning journey.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Stats Cards */}
          {[
            { label: 'Courses Enrolled', value: '12', color: designTokens.colors.primary },
            { label: 'Completed', value: '5', color: designTokens.colors.tertiary },
            { label: 'Points Earned', value: '1,250', color: designTokens.colors.accent },
            { label: 'Current Rank', value: '#4', color: designTokens.colors.primaryDark },
          ].map((stat, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
              <Card sx={{ borderRadius: '16px', boxShadow: 'none', border: `1px solid ${designTokens.colors.border}` }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: stat.color, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: designTokens.colors.textSecondary, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* placeholder for courses */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 4, borderRadius: '20px', border: `1px solid ${designTokens.colors.border}`, boxShadow: 'none' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Recent Activity</Typography>
              <Typography variant="body2" sx={{ color: designTokens.colors.textSecondary }}>
                Your learning portfolio is being initialized. Check back soon for detailed course analytics.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
