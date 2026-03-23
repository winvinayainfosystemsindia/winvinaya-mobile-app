import React from 'react';
import { Box, Typography, Grid, Paper, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { PeopleAlt, LibraryBooks, TrendingUp } from '@mui/icons-material';

const TeacherDashboard: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ bgcolor: '#1c1d1f', color: '#fff', py: 6, mb: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Instructor Dashboard</Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, color: '#d1d7dc' }}>
            Welcome back, {user?.full_name || 'Instructor'}! Here's what's happening today.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #d1d7dc', borderRadius: 0, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ bgcolor: 'rgba(164, 53, 240, 0.1)', p: 2, borderRadius: '50%', mr: 2 }}>
                <PeopleAlt sx={{ fontSize: 32, color: '#a435f0' }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Total Students</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>0</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #d1d7dc', borderRadius: 0, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ bgcolor: 'rgba(164, 53, 240, 0.1)', p: 2, borderRadius: '50%', mr: 2 }}>
                <LibraryBooks sx={{ fontSize: 32, color: '#a435f0' }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Active Courses</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>0</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #d1d7dc', borderRadius: 0, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ bgcolor: 'rgba(164, 53, 240, 0.1)', p: 2, borderRadius: '50%', mr: 2 }}>
                <TrendingUp sx={{ fontSize: 32, color: '#a435f0' }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Revenue</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>₹0</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', py: 8, border: '1px solid #d1d7dc', borderRadius: 0, bgcolor: '#f7f9fa' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Jump Into Course Creation</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Ready to share your knowledge? Create a new course visually using our builder. 
            Add videos, quizzes, standard lectures and more.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/admin/courses/create')} 
            sx={{ 
              bgcolor: '#a435f0', 
              color: '#fff', 
              fontWeight: 700, 
              px: 4, 
              borderRadius: 0,
              '&:hover': { bgcolor: '#8710d8' }
            }}
          >
            Create Your First Course
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default TeacherDashboard;
