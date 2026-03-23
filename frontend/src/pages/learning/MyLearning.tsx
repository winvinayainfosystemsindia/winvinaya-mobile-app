import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, CircularProgress, Button,
  Tabs, Tab, Card, CardContent, CardMedia, LinearProgress, Chip, Stack, Paper,
} from '@mui/material';
import { PlayCircle, School, Star, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchMyEnrollments } from '../../store/slices/enrollmentSlice';
import { designTokens } from '../../theme/designTokens';

const MyLearning: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { myEnrollments, loading } = useAppSelector((state) => state.enrollments);
  const [tab, setTab] = useState(0);

  useEffect(() => { dispatch(fetchMyEnrollments()); }, [dispatch]);

  const all = myEnrollments;
  const inProgress = myEnrollments.filter(e => (e.progress_percent || 0) > 0 && (e.progress_percent || 0) < 100);
  const completed = myEnrollments.filter(e => (e.progress_percent || 0) >= 100);
  const notStarted = myEnrollments.filter(e => (e.progress_percent || 0) === 0);

  const TABS = [
    { label: `All Courses (${all.length})`, items: all },
    { label: `In Progress (${inProgress.length})`, items: inProgress },
    { label: `Completed (${completed.length})`, items: completed },
    { label: `Not Started (${notStarted.length})`, items: notStarted },
  ];

  const activeItems = TABS[tab].items;

  return (
    <Box>
      {/* Hero Header */}
      <Box
        sx={{
          mb: 4, p: { xs: 3, md: 4 }, borderRadius: 3,
          background: `linear-gradient(135deg, ${designTokens.colors.dark} 0%, #2d2f31 100%)`,
          color: '#fff',
          position: 'relative', overflow: 'hidden',
          '&::before': {
            content: '""', position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, ${designTokens.colors.primary}25 0%, transparent 60%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>
          My Learning
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>
          {myEnrollments.length > 0
            ? `${myEnrollments.length} course${myEnrollments.length > 1 ? 's' : ''} in your library`
            : 'Your learning library is empty — start exploring!'}
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 3,
          borderBottom: `1px solid ${designTokens.colors.border}`,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '14px',
            color: 'text.secondary',
            '&.Mui-selected': { color: designTokens.colors.primary, fontWeight: 700 },
          },
          '& .MuiTabs-indicator': { bgcolor: designTokens.colors.primary, height: 2 },
        }}
      >
        {TABS.map((t, i) => <Tab key={i} label={t.label} />)}
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : activeItems.length === 0 ? (
        <Paper elevation={0} sx={{ p: 8, textAlign: 'center', borderRadius: 3, border: `1px dashed ${designTokens.colors.border}` }}>
          <School sx={{ fontSize: 52, color: '#d1d7dc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {tab === 0 ? 'No courses enrolled yet' : `No ${TABS[tab].label.split(' (')[0].toLowerCase()} courses`}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/catalog')} endIcon={<ArrowForward />} sx={{ mt: 1 }}>
            Browse Catalog
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {activeItems.map((enr: any, idx) => {
            const course = enr.course;
            const progress = enr.progress_percent || 0;
            const isCompleted = progress >= 100;

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={enr.id || idx}>
                <Card
                  sx={{
                    borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column',
                    cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: designTokens.shadows.cardHover },
                  }}
                  onClick={() => navigate(`/student/learn/${course?.public_id}`)}
                >
                  <CardMedia
                    component="img"
                    height={160}
                    image={course?.thumbnail_url || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop`}
                    alt={course?.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      {course?.category && (
                        <Chip
                          label={course.category}
                          size="small"
                          sx={{
                            bgcolor: designTokens.colors.primaryLight,
                            color: designTokens.colors.primary,
                            fontWeight: 700, fontSize: '11px',
                          }}
                        />
                      )}
                      {isCompleted && (
                        <Chip
                          icon={<Star sx={{ fontSize: '13px !important', color: `${designTokens.colors.accent} !important` }} />}
                          label="Completed"
                          size="small"
                          sx={{
                            bgcolor: `${designTokens.colors.success}18`,
                            color: designTokens.colors.success,
                            fontWeight: 700,
                            fontSize: '11px',
                          }}
                        />
                      )}
                    </Stack>

                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.3 }} noWrap>
                      {course?.title || 'Untitled Course'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                      WinVinaya Faculty
                    </Typography>

                    {/* Progress bar */}
                    <Box sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Progress</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: isCompleted ? designTokens.colors.success : designTokens.colors.accent }}>
                          {progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 8, borderRadius: 4,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: isCompleted ? designTokens.colors.success : designTokens.colors.accent,
                          },
                        }}
                      />
                    </Box>

                    <Button
                      fullWidth
                      variant={isCompleted ? 'outlined' : 'contained'}
                      startIcon={<PlayCircle />}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    >
                      {progress === 0 ? 'Start Learning' : isCompleted ? 'Review Course' : 'Continue'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default MyLearning;
