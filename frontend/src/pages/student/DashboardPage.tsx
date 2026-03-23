import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress, Container, Tabs, Tab } from '@mui/material';
import enrollmentService from '../../services/enrollmentService';
import { type Enrollment } from '../../models/enrollment';
import CourseCard from '../../components/course/CourseCard';

const StudentDashboard: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const data = await enrollmentService.getMyEnrollments();
        setEnrollments(data);
      } catch (err) {
        console.error('Failed to fetch enrollments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ bgcolor: '#1c1d1f', color: '#fff', py: 6, mb: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>My learning</Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ '& .MuiTab-root': { fontWeight: 700, textTransform: 'none' } }}
          >
            <Tab label="All courses" />
            <Tab label="My Lists" />
            <Tab label="Wishlist" />
            <Tab label="Archived" />
            <Tab label="Learning tools" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <>
            {enrollments.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">You haven't enrolled in any courses yet.</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Explore our marketplace to start learning!</Typography>
              </Box>
            ) : (
              <Grid container spacing={4}>
                {enrollments.map((enrollment) => (
                  <Grid key={enrollment.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <CourseCard enrollment={enrollment} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {tabValue !== 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" color="text.secondary">This section is coming soon!</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default StudentDashboard;
