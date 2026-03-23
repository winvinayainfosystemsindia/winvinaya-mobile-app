import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { 
  Check, 
  PlayCircleOutline, 
  Language, 
  Update, 
  WorkspacePremium,
  ExpandMore,
  Star
} from '@mui/icons-material';
import { useAppSelector } from '../store/hooks';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';
import type { Course, Module } from '../models/course';

const CourseDetail: React.FC = () => {
  const { coursePublicId } = useParams<{ coursePublicId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!coursePublicId) return;
      try {
        setLoading(true);
        const data = await courseService.getCourseByPublicId(coursePublicId);
        setCourse(data);
      } catch (error) {
        console.error('Failed to fetch course:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [coursePublicId]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${coursePublicId}` } });
      return;
    }
    if (!course?.id) return;
    
    try {
      setEnrolling(true);
      await enrollmentService.enroll(course.id);
      navigate(`/student/learn/${course.public_id}`);
    } catch (err: any) {
      if (err.response?.status === 409) {
        // Already enrolled
        navigate(`/student/learn/${course.public_id}`);
      } else {
        console.error('Enrollment failed', err);
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}><CircularProgress /></Box>;
  if (!course) return <Container sx={{ py: 10 }}><Typography variant="h4">Course not found</Typography></Container>;

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: '#1c1d1f', color: '#fff', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
                {course.title}
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 400, color: '#d1d7dc' }}>
                {course.short_description || course.description?.substring(0, 160) + '...'}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#f3ca8c' }}>
                  <Typography sx={{ fontWeight: 700, mr: 0.5 }}>{course.rating_avg || 4.5}</Typography>
                  <Star fontSize="small" />
                </Box>
                <Typography variant="body2" sx={{ color: '#cec0fc' }}>( {course.rating_count || 0} ratings )</Typography>
                <Typography variant="body2">Created by WinVinaya Education</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Update fontSize="small" />
                  <Typography variant="caption">Last updated 03/2026</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Language fontSize="small" />
                  <Typography variant="caption">{course.language || 'English'}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, pb: 10 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            {/* What you'll learn */}
            <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 0, border: '1px solid #d1d7dc' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>What you'll learn</Typography>
              <Grid container spacing={1}>
                {['Master the core concepts', 'Build real-world projects', 'Follow industry best practices', 'Certification upon completion'].map((item, idx) => (
                  <Grid key={idx} size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Check fontSize="small" sx={{ mt: 0.3 }} />
                      <Typography variant="body2">{item}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Course Content */}
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Course content</Typography>
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {course.modules.length} sections • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lectures
              </Typography>
              {course.modules.map((module: Module) => (
                <Accordion key={module.id} disableGutters elevation={0} sx={{ border: '1px solid #d1d7dc', mb: -0.1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: '#f7f9fa' }}>
                    <Typography sx={{ fontWeight: 700 }}>{module.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <List sx={{ py: 0 }}>
                      {module.lessons.map((lesson) => (
                        <ListItem key={lesson.id} sx={{ py: 1, px: 3 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}><PlayCircleOutline fontSize="small" /></ListItemIcon>
                          <ListItemText primary={lesson.title} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            {/* Description */}
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Description</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#2d2f31' }}>
              {course.description}
            </Typography>
          </Grid>

          {/* Sidebar Purchase Card (Floating Effect on Desktop) */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper 
              elevation={4} 
              sx={{ 
                p: 0, 
                borderRadius: 0, 
                position: { md: 'sticky' }, 
                top: { md: 24 },
                zIndex: 10
              }}
            >
              <Box sx={{ position: 'relative', pt: '56.25%', bgcolor: '#000' }}>
                <Box 
                  component="img" 
                  src={course.thumbnail_url || 'https://via.placeholder.com/600x400'} 
                  sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', textAlign: 'center' }}>
                  <PlayCircleOutline sx={{ fontSize: 64 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Preview this course</Typography>
                </Box>
              </Box>
              <Box sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                  {course.is_free ? 'Free' : `₹${course.price}`}
                </Typography>
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large" 
                  onClick={handleEnroll}
                  disabled={enrolling}
                  sx={{ 
                    bgcolor: '#a435f0', 
                    color: '#fff', 
                    fontWeight: 700, 
                    py: 1.5, 
                    borderRadius: 0,
                    '&:hover': { bgcolor: '#8710d8' }
                  }}
                >
                  {enrolling ? <CircularProgress size={24} color="inherit" /> : 'Enroll now'}
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                  30-Day Money-Back Guarantee
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>This course includes:</Typography>
                  <List dense sx={{ p: 0 }}>
                    <ListItem sx={{ px: 0 }}><ListItemIcon sx={{ minWidth: 28 }}><PlayCircleOutline fontSize="small" /></ListItemIcon><ListItemText primary="On-demand video" /></ListItem>
                    <ListItem sx={{ px: 0 }}><ListItemIcon sx={{ minWidth: 28 }}><WorkspacePremium fontSize="small" /></ListItemIcon><ListItemText primary="Certificate of completion" /></ListItem>
                    <ListItem sx={{ px: 0 }}><ListItemIcon sx={{ minWidth: 28 }}><Update fontSize="small" /></ListItemIcon><ListItemText primary="Full lifetime access" /></ListItem>
                  </List>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseDetail;
