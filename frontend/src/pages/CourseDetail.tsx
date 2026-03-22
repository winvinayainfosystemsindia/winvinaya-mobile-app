import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import { useAppSelector } from '../store/hooks';
import api from '../services/api';
import courseService from '../services/courseService';
import type { Course, Lesson } from '../models/course';
import type { CourseProgress } from '../models/progress';
import CourseSidebar from '../components/course/CourseSidebar';
import CourseContentArea from '../components/course/CourseContentArea';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
  const [videoData, setVideoData] = useState<{ stream_url: string; status: string } | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  const fetchCourse = async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const data = await courseService.getCourseStructure(parseInt(courseId));
      setCourse(data);
      
      try {
        const progressRes = await api.get(`/progress/course/${courseId}`);
        setCourseProgress(progressRes.data);
      } catch (pErr) {
        console.warn('Progress not initialized');
      }

      if (data.modules && data.modules.length > 0 && !selectedLesson) {
        const firstLesson = data.modules[0].lessons?.[0];
        if (firstLesson) {
          setSelectedLesson(firstLesson);
          setExpandedModule(data.modules[0].id!);
        }
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      if (selectedLesson?.content_type === 'video' && selectedLesson.media_file_id) {
        setVideoLoading(true);
        try {
          const data = await courseService.getVideoStreamUrl(selectedLesson.media_file_id);
          setVideoData(data);
        } catch (error) {
          setVideoData(null);
        } finally {
          setVideoLoading(false);
        }
      } else {
        setVideoData(null);
      }
    };
    fetchVideoUrl();
  }, [selectedLesson]);

  const handleAutoAdvance = () => {
    if (!course || !selectedLesson) return;
    const allLessons = course.modules.flatMap(m => m.lessons || []);
    const currentIndex = allLessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      setSelectedLesson(nextLesson);
      const nextModule = course.modules.find(m => m.lessons?.some(l => l.id === nextLesson.id));
      if (nextModule) setExpandedModule(nextModule.id!);
    }
  };

  const isInstructor = user?.role === 'admin' || user?.role === 'instructor';

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  if (!course) return <Container sx={{ mt: 4 }}><Typography variant="h5">Course not found</Typography><Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>Back</Button></Container>;

  return (
    <Box sx={{ pb: 8 }}>
      <Box sx={{ bgcolor: '#f7f9fa', borderBottom: '1px solid #d1d7dc', py: 2 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Breadcrumbs>
              <MuiLink underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer' }}>Courses</MuiLink>
              <Typography color="text.primary">{course.title}</Typography>
            </Breadcrumbs>
            {isInstructor && <Button variant="outlined" startIcon={<Edit />} onClick={() => navigate(`/admin/courses/${course.id}/edit`)}>Edit Course</Button>}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            {selectedLesson ? (
              <CourseContentArea 
                lesson={selectedLesson} course={course} videoData={videoData} videoLoading={videoLoading}
                onQuizComplete={async () => { await fetchCourse(); handleAutoAdvance(); }}
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 10 }}><Typography variant="h6">Select a lesson to start</Typography></Box>
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <CourseSidebar 
              course={course} progress={courseProgress} selectedLesson={selectedLesson} expandedModule={expandedModule}
              onLessonClick={(lesson, mid) => { setSelectedLesson(lesson); setExpandedModule(mid); }}
              onToggleModule={(mid) => setExpandedModule(expandedModule === mid ? null : mid)}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseDetail;
