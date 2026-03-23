import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, IconButton, CircularProgress, Tabs, Tab, Button, Paper, List, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import { ArrowBack, Add, Edit, Movie, Description, QuizOutlined } from '@mui/icons-material';
import courseService from '../../services/courseService';
import contentService from '../../services/contentService';
import type { Course, Module, Lesson } from '../../models/course';
import type { Quiz } from '../../services/contentService';
import CourseInfoForm from '../../components/course/forms/CourseInfoForm';
import ModuleForm from '../../components/course/forms/ModuleForm';
import LessonForm from '../../components/course/forms/LessonForm';

const CourseBuilderPage: React.FC = () => {
  const { coursePublicId } = useParams<{ coursePublicId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Dialog States
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // Video Upload States
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!coursePublicId) return;
      try {
        setLoading(true);
        const data = await courseService.getCourseByPublicId(coursePublicId);
        setCourse(data);
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to load course details', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [coursePublicId]);

  const handleUpdateCourse = async () => {
    if (!course?.id) return;
    setSaving(true);
    try {
      const { modules, ...courseData } = course;
      await courseService.updateCourse(course.id, courseData);
      setSnackbar({ open: true, message: 'Course updated successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update course', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveModule = async () => {
    if (!editingModule || !course?.id) return;
    setSaving(true);
    try {
      let savedModule: Module;
      if (editingModule.id) {
        savedModule = await courseService.updateModule(editingModule.id, { title: editingModule.title });
        setCourse(prev => prev ? { ...prev, modules: prev.modules.map(m => m.id === savedModule.id ? savedModule : m) } : null);
      } else {
        savedModule = await courseService.addModule(course.id, { title: editingModule.title, order: course.modules.length });
        setCourse(prev => prev ? { ...prev, modules: [...prev.modules, savedModule] } : null);
      }
      setModuleDialogOpen(false);
      setSnackbar({ open: true, message: 'Section saved!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save section', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEditLesson = async (module: Module, lesson: Lesson) => {
    setEditingModule(module);
    setEditingLesson(lesson);
    setLessonDialogOpen(true);

    if (lesson.content_type === 'quiz' && lesson.id) {
      try {
        const quiz = await contentService.getQuizByLesson(lesson.id);
        setEditingQuiz(quiz);
      } catch (err) {
        setEditingQuiz({ id: 0, lesson_id: lesson.id, title: lesson.title, pass_score: 80, max_attempts: 3, questions: [] });
      }
    } else {
      setEditingQuiz(null);
    }
  };

  const handleSaveLesson = async () => {
    if (!editingLesson || !editingModule?.id) return;
    setSaving(true);
    try {
      let savedLesson = editingLesson.id 
        ? await courseService.updateLesson(editingLesson.id, editingLesson)
        : await courseService.addLesson(editingModule.id, { ...editingLesson, order: editingModule.lessons?.length || 0 });

      setCourse(prev => prev ? {
        ...prev,
        modules: prev.modules.map(m => m.id === editingModule.id 
          ? { ...m, lessons: editingLesson.id ? m.lessons.map(l => l.id === savedLesson.id ? savedLesson : l) : [...m.lessons, savedLesson] } 
          : m)
      } : null);

      if (savedLesson.content_type === 'quiz' && editingQuiz) {
        await contentService.saveQuiz(savedLesson.id!, editingQuiz);
      }
      
      setLessonDialogOpen(false);
      setSnackbar({ open: true, message: 'Lesson saved!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save lesson', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleUploadVideo = async (file: File) => {
    if (!editingLesson || !editingModule?.id || !course?.id) return;
    setUploading(true);
    try {
      let lessonId = editingLesson.id;
      if (!lessonId) {
        const newLesson = await courseService.addLesson(editingModule.id, { ...editingLesson, title: editingLesson.title || 'Untitled' });
        lessonId = newLesson.id;
        setEditingLesson(newLesson);
      }
      const media = await courseService.uploadVideo(course.id, editingModule.id, lessonId!, file, setUploadProgress);
      setEditingLesson(prev => prev ? { ...prev, media_file_id: media.id } : null);
      setSnackbar({ open: true, message: 'Video uploaded!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Video upload failed', severity: 'error' });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (loading || !course) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/teacher/courses')}><ArrowBack /></IconButton>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Course Builder</Typography>
      </Box>

      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="General Info" />
        <Tab label="Curriculum" />
      </Tabs>

      {activeTab === 0 && (
        <CourseInfoForm course={course} onChange={updates => setCourse({ ...course, ...updates })} onSave={handleUpdateCourse} saving={saving} />
      )}

      {activeTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Curriculum Outline</Typography>
            <Button variant="outlined" startIcon={<Add />} onClick={() => { setEditingModule({ id: 0, title: '', order: course.modules.length, lessons: [] }); setModuleDialogOpen(true); }}>New Section</Button>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {course.modules.map((module) => (
              <Paper key={module.id} variant="outlined" sx={{ borderRadius: 2 }}>
                <Box sx={{ bgcolor: '#f7f9fa', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 700 }}>Section {module.order + 1}: {module.title}</Typography>
                  <IconButton onClick={() => { setEditingModule(module); setModuleDialogOpen(true); }}><Edit fontSize="small" /></IconButton>
                </Box>
                <List sx={{ py: 0 }}>
                  {module.lessons?.map((lesson) => (
                    <ListItem key={lesson.id} sx={{ borderTop: '1px solid #d1d7dc' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                        {lesson.content_type === 'video' ? <Movie color="action" /> : lesson.content_type === 'quiz' ? <QuizOutlined color="action" /> : <Description color="action" />}
                        <ListItemText primary={lesson.title} secondary={lesson.content_type} />
                        <IconButton size="small" onClick={() => handleEditLesson(module, lesson)}><Edit fontSize="small" /></IconButton>
                      </Box>
                    </ListItem>
                  ))}
                  <ListItem sx={{ py: 1, bgcolor: 'rgba(0,0,0,0.02)', borderTop: '1px solid #d1d7dc' }}>
                    <Button size="small" startIcon={<Add />} fullWidth onClick={() => { setEditingModule(module); setEditingLesson({ id: 0, title: '', content_type: 'video', order: module.lessons?.length || 0 } as Lesson); setEditingQuiz(null); setLessonDialogOpen(true); }}>Add Lesson</Button>
                  </ListItem>
                </List>
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      <ModuleForm open={moduleDialogOpen} onClose={() => setModuleDialogOpen(false)} module={editingModule} onChange={updates => setEditingModule(prev => prev ? { ...prev, ...updates } : null)} onSave={handleSaveModule} saving={saving} />
      <LessonForm open={lessonDialogOpen} onClose={() => setLessonDialogOpen(false)} lesson={editingLesson} quiz={editingQuiz} onChangeLesson={updates => setEditingLesson(prev => prev ? { ...prev, ...updates } : null)} onChangeQuiz={setEditingQuiz} onSave={handleSaveLesson} onUploadVideo={handleUploadVideo} saving={saving} uploading={uploading} uploadProgress={uploadProgress} />
      
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default CourseBuilderPage;
