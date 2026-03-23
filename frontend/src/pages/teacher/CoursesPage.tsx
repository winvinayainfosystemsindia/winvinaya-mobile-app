import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, CircularProgress, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import courseService from '../../services/courseService';
import { type Course } from '../../models/course';
import { Add } from '@mui/icons-material';

const TeacherCoursesPage: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Course Dialog State
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourses();
        if (user && user.role === 'instructor') {
          setCourses(data.filter(c => Number(c.instructor_id) === Number(user.id)));
        } else {
          setCourses(data);
        }
      } catch (err) {
        console.error('Failed to fetch courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  const handleCreateCourse = async () => {
    if (!newCourseTitle.trim()) return;
    setCreating(true);
    try {
      const newCourse = await courseService.createCourse({
        title: newCourseTitle,
        description: '',
        short_description: '',
        category: 'Uncategorized',
        level: 'beginner',
        language: 'en',
        is_free: false,
        price: 0
      });
      // Assuming backend assigns public_id to newCourse object returned
      if (newCourse.public_id) {
        navigate(`/teacher/courses/${newCourse.public_id}/build`);
      } else {
        // Fallback or legacy redirect if public_id isn't immediately returned
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to create course', err);
    } finally {
      setCreating(false);
      setCreateDialogOpen(false);
    }
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
      <Box sx={{ bgcolor: '#1c1d1f', color: '#fff', py: 4, mb: 4 }}>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>My Courses</Typography>
            <Typography variant="body1" sx={{ color: '#d1d7dc' }}>Manage and edit your course library</Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ bgcolor: '#a435f0', borderRadius: 0, fontWeight: 700, '&:hover': { bgcolor: '#8710d8' } }}
          >
            New Course
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {courses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, border: '1px solid #d1d7dc', bgcolor: '#f7f9fa' }}>
             <Typography variant="h6" color="text.secondary">You haven't created any courses yet.</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #d1d7dc', borderRadius: 0 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f7f9fa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Course Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Enrolled</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{course.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{course.category || 'Uncategorized'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={course.status || 'Draft'} size="small" color={course.status === 'published' ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell>{course.is_free ? 'Free' : `₹${course.price}`}</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell align="right">
                       <Button 
                         variant="outlined" 
                         size="small" 
                         sx={{ borderRadius: 0, fontWeight: 700, textTransform: 'none' }}
                         onClick={() => navigate(`/teacher/courses/${course.public_id}/build`)}
                       >
                         Manage / Edit
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create a New Course</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            What do you want to teach? Give your course a working title (you can change it later).
          </Typography>
          <TextField 
            autoFocus 
            fullWidth 
            label="Course Title" 
            placeholder="e.g. Master React in 30 Days"
            value={newCourseTitle}
            onChange={e => setNewCourseTitle(e.target.value)}
            disabled={creating}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCreateDialogOpen(false)} disabled={creating}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateCourse} 
            disabled={!newCourseTitle.trim() || creating}
            sx={{ bgcolor: '#a435f0', '&:hover': { bgcolor: '#8710d8' } }}
          >
            {creating ? 'Creating...' : 'Continue'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherCoursesPage;
