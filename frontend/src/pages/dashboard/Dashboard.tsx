import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  CircularProgress,
  Avatar,
  Chip,
  Paper,
  Stack,
} from '@mui/material';
import {
  PlayCircle,
  People,
  MenuBook,
  AssignmentTurnedIn,
  TrendingUp,
  Star,
  ArrowForward,
  School,
  EmojiEvents,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchCourses } from '../../store/slices/courseSlice';
import { fetchUsers } from '../../store/slices/userSlice';
import { fetchMyEnrollments } from '../../store/slices/enrollmentSlice';
import { designTokens } from '../../theme/designTokens';

// ─────────────────────────────────────────────────────
//  Reusable stat card
// ─────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color?: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color = designTokens.colors.primary, trend }) => (
  <Card sx={{ height: '100%', borderRadius: 3 }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: `${color}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
          }}
        >
          {icon}
        </Box>
        {trend && (
          <Chip
            label={trend}
            size="small"
            sx={{ bgcolor: `${designTokens.colors.success}18`, color: designTokens.colors.success, fontWeight: 700, fontSize: '11px' }}
          />
        )}
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: designTokens.colors.dark }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </CardContent>
  </Card>
);

// ─────────────────────────────────────────────────────
//  Dashboard
// ─────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { courses, loading: coursesLoading } = useAppSelector((state) => state.courses);
  const { users } = useAppSelector((state) => state.users);
  const { myEnrollments, loading: enrollLoading } = useAppSelector((state) => state.enrollments);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'manager') {
      dispatch(fetchUsers());
      dispatch(fetchCourses());
    } else if (user?.role === 'teacher') {
      dispatch(fetchCourses());
    } else if (user?.role === 'user') {
      dispatch(fetchMyEnrollments());
      dispatch(fetchCourses());
    }
  }, [dispatch, user?.role]);

  if (!user) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  const firstName = user.full_name?.split(' ')[0] || user.username;
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  // ── ADMIN / MANAGER DASHBOARD ──
  if (user.role === 'admin' || user.role === 'manager') {
    return (
      <Box>
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${designTokens.colors.dark} 0%, #2d2f31 100%)`,
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""', position: 'absolute', inset: 0,
              background: `linear-gradient(135deg, ${designTokens.colors.primary}30 0%, transparent 60%)`,
              pointerEvents: 'none',
            },
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>
            {greeting}, {firstName}!
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>
            Here's what's happening on your platform today.
          </Typography>
        </Box>

        {/* Stat Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { icon: <People />, value: users.length, label: 'Total Users', color: '#5864ff', trend: '+12%' },
            { icon: <MenuBook />, value: courses.length, label: 'Active Courses', color: designTokens.colors.primary, trend: '+3 this week' },
            { icon: <AssignmentTurnedIn />, value: '—', label: 'Enrollments', color: designTokens.colors.success },
            { icon: <TrendingUp />, value: '—', label: 'Avg. Completion', color: designTokens.colors.accent },
          ].map((s, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <StatCard {...s} />
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${designTokens.colors.border}`, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Quick Actions</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
            <Button variant="contained" startIcon={<MenuBook />} onClick={() => navigate('/admin/users')}>Manage Users</Button>
            <Button variant="outlined" startIcon={<School />} onClick={() => navigate('/admin/groups')}>Manage Groups</Button>
            <Button variant="outlined" startIcon={<AssignmentTurnedIn />} onClick={() => navigate('/admin/enrollments')}>View Enrollments</Button>
            <Button variant="outlined" startIcon={<TrendingUp />} onClick={() => navigate('/reports')}>Reports</Button>
          </Stack>
        </Paper>

        {/* Recent Courses */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recent Courses</Typography>
        <Grid container spacing={2}>
          {courses.slice(0, 4).map((course: any) => (
            <Grid size={{ xs: 12, sm: 6 }} key={course.id}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                  <Box
                    sx={{
                      width: 48, height: 48, borderRadius: 2,
                      bgcolor: designTokens.colors.primaryLight,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: designTokens.colors.primary, flexShrink: 0
                    }}
                  >
                    <MenuBook />
                  </Box>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.25 }} noWrap>{course.title}</Typography>
                    <Typography variant="caption" color="text.secondary">Published</Typography>
                  </Box>
                  <Button size="small" variant="outlined" onClick={() => navigate(`/teacher/courses/${course.public_id}/build`)}>
                    Edit
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // ── TEACHER DASHBOARD ──
  if (user.role === 'teacher') {
    return (
      <Box>
        <Box
          sx={{
            mb: 4, p: 3, borderRadius: 3,
            background: `linear-gradient(135deg, #1c1d1f 0%, #2d2f31 100%)`,
            color: '#fff',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>
            {greeting}, {firstName}!
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>
            Manage your courses and track your students' progress.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { icon: <MenuBook />, value: courses.length, label: 'My Courses', color: designTokens.colors.primary },
            { icon: <Star />, value: '4.8', label: 'Avg. Rating', color: designTokens.colors.accent },
            { icon: <People />, value: '—', label: 'Total Students', color: '#5864ff' },
          ].map((s, i) => (
            <Grid size={{ xs: 12, sm: 4 }} key={i}><StatCard {...s} /></Grid>
          ))}
        </Grid>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>My Courses</Typography>
          <Button variant="contained" size="small" onClick={() => navigate('/teacher/courses')}>
            View All
          </Button>
        </Box>
        {coursesLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={32} /></Box>
        ) : (
          <Grid container spacing={2}>
            {courses.slice(0, 6).map((course: any) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }} noWrap>{course.title}</Typography>
                    <Chip label={course.is_published ? 'Published' : 'Draft'} size="small"
                      sx={{ bgcolor: course.is_published ? `${designTokens.colors.success}18` : '#f0f0f0', color: course.is_published ? designTokens.colors.success : 'text.secondary', fontWeight: 700, fontSize: '11px' }}
                    />
                    <Button fullWidth variant="outlined" size="small" sx={{ mt: 2 }}
                      onClick={() => navigate(`/teacher/courses/${course.public_id}/build`)}
                    >
                      Edit Course
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  }

  // ── USER / STUDENT DASHBOARD ──
  const inProgress = myEnrollments.filter(e => e.status === 'active' && e.progress_percent < 100);
  const completed = myEnrollments.filter(e => e.status === 'completed' || e.progress_percent >= 100);

  return (
    <Box>
      {/* Welcome + Resume Learning Hero */}
      <Box
        sx={{
          mb: 4, p: { xs: 2.5, md: 4 }, borderRadius: 3,
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
          {greeting}, {firstName}!
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, fontSize: 15 }}>
          {inProgress.length > 0
            ? `You have ${inProgress.length} course${inProgress.length > 1 ? 's' : ''} in progress. Keep going!`
            : 'Ready to start learning? Find your next course in the catalog!'}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            startIcon={<PlayCircle />}
            onClick={() => navigate('/my-learning')}
            sx={{ bgcolor: designTokens.colors.primary, '&:hover': { bgcolor: designTokens.colors.primaryDark } }}
          >
            My Learning
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/catalog')}
            endIcon={<ArrowForward />}
            sx={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' } }}
          >
            Browse Catalog
          </Button>
        </Stack>
      </Box>

      {/* Progress Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { icon: <MenuBook />, value: myEnrollments.length, label: 'Enrolled Courses', color: designTokens.colors.primary },
          { icon: <TrendingUp />, value: inProgress.length, label: 'In Progress', color: designTokens.colors.accent },
          { icon: <EmojiEvents />, value: completed.length, label: 'Completed', color: designTokens.colors.success },
        ].map((s, i) => (
          <Grid size={{ xs: 12, sm: 4 }} key={i}><StatCard {...s} /></Grid>
        ))}
      </Grid>

      {/* In-Progress Courses */}
      {enrollLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={32} /></Box>
      ) : inProgress.length > 0 ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Continue Learning</Typography>
            <Button size="small" onClick={() => navigate('/my-learning')} endIcon={<ArrowForward />}
              sx={{ fontWeight: 700, color: designTokens.colors.primary }}>
              See all
            </Button>
          </Box>
          <Grid container spacing={3}>
            {inProgress.slice(0, 3).map((enr: any, idx) => (
              <Grid size={{ xs: 12, md: 4 }} key={enr.id || idx}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Avatar sx={{ bgcolor: designTokens.colors.primaryLight, color: designTokens.colors.primary, width: 40, height: 40 }}>
                        <MenuBook fontSize="small" />
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }} noWrap>
                        {enr.course?.title || 'Untitled Course'}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Progress</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: designTokens.colors.accent }}>
                          {enr.progress_percent || 0}%
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={enr.progress_percent || 0} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PlayCircle />}
                      onClick={() => navigate(`/student/learn/${enr.course?.public_id}`)}
                      sx={{ mt: 1 }}
                    >
                      Continue
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 3, border: `1px dashed ${designTokens.colors.border}` }}>
          <School sx={{ fontSize: 48, color: '#d1d7dc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>No courses in progress</Typography>
          <Button variant="contained" onClick={() => navigate('/catalog')} sx={{ mt: 1 }}>
            Browse Catalog
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;
