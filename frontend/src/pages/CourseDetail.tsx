import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Button,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  PlayCircleOutline,
  DescriptionOutlined,
  ExpandMore,
  ArrowBack,
  Edit,
} from '@mui/icons-material';
import { courseService, type Course, type Module, type Lesson } from '../services/courseService';
import { useAppSelector } from '../store/hooks';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  // Video State
  const [videoData, setVideoData] = useState<{ stream_url: string; status: string } | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      try {
        const data = await courseService.getCourseStructure(parseInt(courseId));
        setCourse(data);
        
        // Auto-select first lesson if available
        if (data.modules && data.modules.length > 0 && data.modules[0].lessons && data.modules[0].lessons.length > 0) {
          setSelectedLesson(data.modules[0].lessons[0]);
          setExpandedModule(data.modules[0].id!);
        }
      } catch (error) {
        console.error('Failed to fetch course details:', error);
      } finally {
        setLoading(false);
      }
    };
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
          console.error('Failed to fetch video URL:', error);
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

  const handleLessonClick = (lesson: Lesson, moduleId: number) => {
    setSelectedLesson(lesson);
    setExpandedModule(moduleId);
  };

  const isInstructor = user?.role === 'admin' || user?.role === 'instructor';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">Course not found</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ pb: 8 }}>
      {/* Header / Breadcrumbs Area */}
      <Box sx={{ bgcolor: '#f7f9fa', borderBottom: '1px solid #d1d7dc', py: 2 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Breadcrumbs aria-label="breadcrumb">
              <MuiLink underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer' }}>
                Courses
              </MuiLink>
              <Typography color="text.primary">{course.title}</Typography>
            </Breadcrumbs>
            
            {isInstructor && (
              <Button 
                variant="outlined" 
                startIcon={<Edit />}
                onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
              >
                Edit Course
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* Main Content Area */}
          <Grid size={{ xs: 12, md: 8 }}>
            {selectedLesson ? (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                  {selectedLesson.title}
                </Typography>
                
                <Paper sx={{ p: 0, mb: 4, borderRadius: 2, overflow: 'hidden', bgcolor: '#000' }}>
                  {selectedLesson.content_type === 'video' ? (
                    <Box sx={{ position: 'relative', pt: '56.25%', bgcolor: '#000' }}>
                      {videoLoading ? (
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CircularProgress color="primary" />
                        </Box>
                      ) : videoData?.stream_url ? (
                        <video 
                          key={videoData.stream_url}
                          controls 
                          controlsList="nodownload"
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                          poster={course.thumbnail_url || undefined}
                        >
                          <source src={videoData.stream_url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            textAlign: 'center',
                            p: 3
                          }}
                        >
                          <PlayCircleOutline sx={{ fontSize: 80, opacity: 0.8, mb: 2 }} />
                          <Typography variant="body1">
                            {videoData?.status === 'processing' 
                              ? 'Video is currently being processed. Please check back in a few minutes.' 
                              : 'No video linked to this lesson yet.'}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{ p: 4, bgcolor: '#fff', minHeight: 400 }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {selectedLesson.text_content || 'No text content available for this lesson.'}
                      </Typography>
                    </Box>
                  )}
                </Paper>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>About this lesson</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {selectedLesson.description || 'No description provided.'}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography variant="h6">Select a lesson to start learning</Typography>
              </Box>
            )}
          </Grid>

          {/* Sidebar - Course Content */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Course content</Typography>
            <Paper variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden' }}>
              {course.modules?.map((module: Module) => (
                <Accordion 
                  key={module.id} 
                  expanded={expandedModule === module.id}
                  onChange={() => setExpandedModule(expandedModule === module.id ? null : module.id!)}
                  disableGutters
                  elevation={0}
                  sx={{ 
                    borderBottom: '1px solid #d1d7dc',
                    '&:last-child': { borderBottom: 0 },
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMore />}
                    sx={{ bgcolor: '#f7f9fa', '&.Mui-expanded': { borderBottom: '1px solid #d1d7dc' } }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{module.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {module.lessons?.length || 0} lessons
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <List sx={{ py: 0 }}>
                      {module.lessons?.map((lesson: Lesson) => (
                        <ListItemButton 
                          key={lesson.id}
                          selected={selectedLesson?.id === lesson.id}
                          onClick={() => handleLessonClick(lesson, module.id!)}
                          sx={{ 
                            py: 1.5,
                            '&.Mui-selected': { bgcolor: 'rgba(164, 53, 240, 0.08)', color: '#a435f0' }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                            {lesson.content_type === 'video' ? <PlayCircleOutline /> : <DescriptionOutlined />}
                          </ListItemIcon>
                          <ListItemText 
                            primary={lesson.title} 
                            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: selectedLesson?.id === lesson.id ? 700 : 400 }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseDetail;
