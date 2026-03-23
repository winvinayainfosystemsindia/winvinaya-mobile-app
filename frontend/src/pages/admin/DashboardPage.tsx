import React from 'react';
import { Box, Typography, Grid, Paper, Container, Button } from '@mui/material';
import { PeopleAlt, LibraryBooks, TrendingUp, Settings, VerifiedUser, Group } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

const AdminDashboard: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Users', value: '0', icon: <PeopleAlt sx={{ fontSize: 32, color: '#a435f0' }} /> },
    { label: 'Active Courses', value: '0', icon: <LibraryBooks sx={{ fontSize: 32, color: '#a435f0' }} /> },
    { label: 'Total Revenue', value: '₹0', icon: <TrendingUp sx={{ fontSize: 32, color: '#a435f0' }} /> },
    { label: 'Platform Groups', value: '0', icon: <Group sx={{ fontSize: 32, color: '#a435f0' }} /> },
  ];

  return (
    <Box>
      <Box sx={{ bgcolor: '#1c1d1f', color: '#fff', py: 6, mb: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Platform Administration</Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, color: '#d1d7dc' }}>
            Welcome back, {user?.full_name || 'Admin'}. Manage everything in one place.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Overview</Typography>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {stats.map((stat, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid #d1d7dc', borderRadius: 0, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ bgcolor: 'rgba(164, 53, 240, 0.1)', p: 1.5, borderRadius: '50%', mr: 2 }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{stat.value}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Quick Actions</Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid #d1d7dc', borderRadius: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <VerifiedUser sx={{ fontSize: 48, color: '#2d2f31', mx: 'auto', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Manage Users</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>View, edit, or suspend user accounts across the platform.</Typography>
              <Button variant="outlined" sx={{ borderRadius: 0, fontWeight: 700 }} onClick={() => navigate('/admin/users')}>Go to Users</Button>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid #d1d7dc', borderRadius: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <LibraryBooks sx={{ fontSize: 48, color: '#2d2f31', mx: 'auto', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Platform Courses</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>Review all published courses and curriculum details.</Typography>
              <Button variant="outlined" sx={{ borderRadius: 0, fontWeight: 700 }} onClick={() => navigate('/teacher/courses')}>Go to Courses</Button>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid #d1d7dc', borderRadius: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Settings sx={{ fontSize: 48, color: '#2d2f31', mx: 'auto', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>System Settings</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>Configure global application variables and permissions.</Typography>
              <Button variant="outlined" sx={{ borderRadius: 0, fontWeight: 700 }}>Settings</Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
