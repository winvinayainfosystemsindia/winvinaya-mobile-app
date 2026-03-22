import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  CircularProgress,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Drawer,
} from '@mui/material';
import { Menu as MenuIcon, ChevronRight } from '@mui/icons-material';
import CourseSidebar from '../components/course/CourseSidebar';
import CourseContentArea from '../components/course/CourseContentArea';
import type { Course, Lesson } from '../models/course';
import type { CourseProgress } from '../models/progress';
import courseService from '../services/courseService'; // Assuming these exist or will be enhanced
import progressService from '../services/progressService';

const CoursePlayer: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      try {
        setLoading(true);
        const [courseData, progressData] = await Promise.all([
          courseService.getCourse(Number(courseId)),
          progressService.getCourseProgress(Number(courseId))
        ]);
        setCourse(courseData);
        setProgress(progressData);

        // Auto-select first lesson or last accessed
        const firstModule = courseData.modules[0];
        if (firstModule && firstModule.lessons.length > 0) {
          setSelectedLesson(firstModule.lessons[0]);
          setExpandedModule(firstModule.id!);
        }
      } catch (err) {
        console.error('Failed to load course player data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const handleLessonClick = (lesson: Lesson, moduleId: number) => {
    setSelectedLesson(lesson);
    setExpandedModule(moduleId);
    if (isMobile) setSidebarOpen(false);
  };

  const handleQuizComplete = async () => {
    // Refresh progress after quiz
    if (courseId) {
      const updatedProgress = await progressService.getCourseProgress(Number(courseId));
      setProgress(updatedProgress);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course || !selectedLesson) return null;

  const sidebarContent = (
    <Box sx={{ width: 350, height: '100%', borderLeft: '1px solid #d1d7dc', bgcolor: '#fff', overflowY: 'auto' }}>
      <CourseSidebar
        course={course}
        progress={progress}
        selectedLesson={selectedLesson}
        expandedModule={expandedModule}
        onLessonClick={handleLessonClick}
        onToggleModule={(id) => setExpandedModule(id === expandedModule ? null : id)}
      />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', bgcolor: '#f7f9fa' }}>
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Main Content */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, md: 4 } }}>
          <Container maxWidth="lg">
            <CourseContentArea
              lesson={selectedLesson}
              course={course}
              videoData={null} // To be fetched dynamically based on lesson
              videoLoading={false}
              onQuizComplete={handleQuizComplete}
            />
          </Container>
        </Box>

        {/* Sidebar - Desktop */}
        {!isMobile && sidebarOpen && sidebarContent}

        {/* Sidebar - Mobile Drawer */}
        {isMobile && (
          <Drawer
            anchor="right"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          >
            {sidebarContent}
          </Drawer>
        )}
      </Box>

      {/* Toggle Sidebar Button (Floating or in bottom bar) */}
      <Tooltip title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}>
        <IconButton
          onClick={() => setSidebarOpen(!sidebarOpen)}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: sidebarOpen && !isMobile ? 360 : 20,
            bgcolor: '#fff',
            boxShadow: 3,
            '&:hover': { bgcolor: '#f0f0f0' },
            zIndex: 1201,
            transition: 'right 0.3s'
          }}
        >
          {sidebarOpen ? <ChevronRight /> : <MenuIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default CoursePlayer;
