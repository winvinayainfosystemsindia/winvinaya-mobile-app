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
import CoursePlayerHeader from '../components/course/CoursePlayerHeader';
import { type Course, type Lesson } from '../models/course';
import { type CourseProgress } from '../models/progress';
import courseService from '../services/courseService';
import progressService from '../services/progressService';
import contentService from '../services/contentService';

const CoursePlayer: React.FC = () => {
  const { coursePublicId, lessonPublicId } = useParams<{ coursePublicId: string; lessonPublicId?: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [videoData, setVideoData] = useState<{ hls_url?: string; stream_url: string; status: string } | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);
  const [slidesLoading, setSlidesLoading] = useState(false);
  const [codingExercise, setCodingExercise] = useState<any>(null);
  const [codingLoading, setCodingLoading] = useState(false);
  const [markers, setMarkers] = useState<any[]>([]);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!coursePublicId) return;
      try {
        setLoading(true);
        const courseData = await courseService.getCourseByPublicId(coursePublicId);
        const progressData = await progressService.getCourseProgress(courseData.id!);
        
        setCourse(courseData);
        setProgress(progressData);

        // Find initial lesson: either by lessonPublicId from URL, or first lesson
        let initialLesson: Lesson | null = null;
        let initialModuleId: number | null = null;

        if (lessonPublicId) {
          for (const mod of courseData.modules) {
            const found = mod.lessons.find(l => l.public_id === lessonPublicId);
            if (found) {
              initialLesson = found;
              initialModuleId = mod.id!;
              break;
            }
          }
        }

        if (!initialLesson && courseData.modules.length > 0) {
          const firstMod = courseData.modules[0];
          if (firstMod.lessons.length > 0) {
            initialLesson = firstMod.lessons[0];
            initialModuleId = firstMod.id!;
          }
        }

        if (initialLesson) {
          setSelectedLesson(initialLesson);
          setExpandedModule(initialModuleId);

          if (initialLesson.content_type === 'video' && initialLesson.media_file_id) {
            fetchVideoData(initialLesson.media_file_id);
            fetchMarkers(initialLesson.id!);
          } else if (initialLesson.content_type === 'ppt') {
            fetchSlides(initialLesson.id!);
          } else if (initialLesson.content_type === 'code') {
            fetchCodingExercise(initialLesson.id!);
          }
          fetchDiscussions(initialLesson.id!);
        }
      } catch (err) {
        console.error('Failed to load course player data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [coursePublicId, lessonPublicId]);

  const fetchVideoData = async (mediaId: number) => {
    try {
      setVideoLoading(true);
      const data = await contentService.getVideoUrl(mediaId);
      setVideoData(data);
    } catch (err) {
      console.error('Failed to fetch video URL', err);
      setVideoData(null);
    } finally {
      setVideoLoading(false);
    }
  };

  const fetchMarkers = async (lessonId: number) => {
    try {
      const data = await contentService.getVideoMarkers(lessonId);
      setMarkers(data);
    } catch (err) {
      console.error('Failed to fetch markers', err);
      setMarkers([]);
    }
  };

  const fetchSlides = async (lessonId: number) => {
    try {
      setSlidesLoading(true);
      const data = await contentService.getLessonSlides(lessonId);
      setSlides(data);
    } catch (err) {
      console.error('Failed to fetch slides', err);
      setSlides([]);
    } finally {
      setSlidesLoading(false);
    }
  };

  const fetchCodingExercise = async (lessonId: number) => {
    try {
      setCodingLoading(true);
      const data = await contentService.getCodingExercise(lessonId);
      setCodingExercise(data);
    } catch (err) {
      console.error('Failed to fetch coding exercise', err);
      setCodingExercise(null);
    } finally {
      setCodingLoading(false);
    }
  };

  const handleCodeSubmit = async (exerciseId: number, code: string) => {
    return await contentService.submitCode(exerciseId, code);
  };

  const handleLessonClick = (lesson: Lesson, moduleId: number) => {
    // Navigate to the new lesson URL, which will trigger the useEffect
    navigate(`/student/learn/${coursePublicId}/${lesson.public_id}`);
    
    // Optional: immediate state update for responsiveness
    setSelectedLesson(lesson);
    setExpandedModule(moduleId);
    setVideoData(null);
    setSlides([]);
    setCodingExercise(null);

    if (lesson.content_type === 'video' && lesson.media_file_id) {
      fetchVideoData(lesson.media_file_id);
      fetchMarkers(lesson.id!);
    } else if (lesson.content_type === 'ppt') {
      fetchSlides(lesson.id!);
    } else if (lesson.content_type === 'code') {
      fetchCodingExercise(lesson.id!);
    }


    fetchDiscussions(lesson.id!);

    if (isMobile) setSidebarOpen(false);
  };

  const fetchDiscussions = async (lessonId: number) => {
    try {
      const data = await contentService.getDiscussions(lessonId);
      setDiscussions(data);
    } catch (err) {
      console.error('Failed to fetch discussions', err);
      setDiscussions([]);
    }
  };

  const handlePostDiscussion = async (body: string, parentId?: number) => {
    if (!selectedLesson) return;
    try {
      await contentService.postDiscussion(selectedLesson.id!, body, parentId);
      fetchDiscussions(selectedLesson.id!); // Refresh
    } catch (err) {
      console.error('Failed to post discussion', err);
    }
  };

  const fetchRatings = async (cid: number) => {
    try {
      const data = await courseService.getRatings(cid);
      setRatings(data);
    } catch (err) {
      console.error('Failed to fetch ratings', err);
      setRatings([]);
    }
  };

  const handleRateCourse = async (rating: number, review?: string) => {
    if (!course) return;
    try {
      await courseService.postRating(course.id!, rating, review);
      fetchRatings(course.id!); // Refresh
    } catch (err) {
      console.error('Failed to post rating', err);
    }
  };

  const handleQuizComplete = async () => {
    // Refresh progress after quiz
    if (course?.id) {
      try {
        const updatedProgress = await progressService.getCourseProgress(course.id);
        setProgress(updatedProgress);
      } catch (err) {
        console.error('Failed to update progress', err);
      }
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#f7f9fa', overflow: 'hidden' }}>
      <CoursePlayerHeader course={course} progress={progress} />
      
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Main Content */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, md: 4 } }}>
          <Container maxWidth="lg">
            <CourseContentArea
              lesson={selectedLesson}
              course={course}
              videoData={videoData}
              videoLoading={videoLoading}
              slides={slides}
              slidesLoading={slidesLoading}
              codingExercise={codingExercise}
              codingLoading={codingLoading}
              markers={markers}
              discussions={discussions}
              ratings={ratings}
              onQuizComplete={handleQuizComplete}
              onCodeSubmit={handleCodeSubmit}
              onPostDiscussion={handlePostDiscussion}
              onRateCourse={handleRateCourse}
              initialVideoTime={progress?.lesson_progress?.find(p => p.lesson_id === selectedLesson.id)?.video_position_seconds || 0}
              onVideoTimeUpdate={(time) => {
                // Throttle progress updates ideally
                if (Math.floor(time) % 5 === 0) {
                  progressService.updateVideoPosition(selectedLesson.id!, Math.floor(time));
                }
              }}
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
