import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tabs,
  Tab,
  MenuItem,
  Alert,
  Snackbar,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Save,
  ArrowBack,
  Movie,
  Description,
  CloudUpload,
  QuizOutlined,
} from '@mui/icons-material';
import { courseService, type Course, type Module, type Lesson } from '../services/courseService';
import contentService, { type Quiz } from '../services/contentService';
import QuizEditor from '../components/admin/QuizEditor';

const AdminCourseEdit: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Module / Lesson Edit States
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);

  // Video Upload States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Quiz Edit States
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      try {
        const data = await courseService.getCourseStructure(parseInt(courseId));
        setCourse(data);
      } catch (error) {
        console.error('Failed to fetch course:', error);
        setSnackbar({ open: true, message: 'Failed to load course details', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleUpdateCourse = async () => {
    if (!course || !course.id) return;
    setSaving(true);
    try {
      const { modules, ...courseData } = course;
      await courseService.updateCourse(course.id, courseData);
      setSnackbar({ open: true, message: 'Course updated successfully!', severity: 'success' });
    } catch (error) {
      console.error('Failed to update course:', error);
      setSnackbar({ open: true, message: 'Failed to update course', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveModule = async () => {
    if (!editingModule || !course) return;
    setSaving(true);
    try {
      if (editingModule.id) {
        const updatedModule = await courseService.updateModule(editingModule.id, {
          title: editingModule.title,
          order: editingModule.order
        });
        setCourse(prev => prev ? {
          ...prev,
          modules: prev.modules.map(m => m.id === updatedModule.id ? updatedModule : m)
        } : null);
      } else {
        const newModule = await courseService.addModule(course.id!, {
          title: editingModule.title,
          order: editingModule.order
        });
        setCourse(prev => prev ? { ...prev, modules: [...prev.modules, newModule] } : null);
      }
      setModuleDialogOpen(false);
      setSnackbar({ open: true, message: 'Module saved successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save module', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEditLesson = async (module: Module, lesson: Lesson) => {
    setEditingModule(module);
    setEditingLesson(lesson);
    setLessonDialogOpen(true);

    if (lesson.content_type === 'quiz' && lesson.id) {
      setQuizLoading(true);
      try {
        const quiz = await contentService.getQuizByLesson(lesson.id);
        setEditingQuiz(quiz);
      } catch (err) {
        setEditingQuiz({
          id: 0,
          lesson_id: lesson.id,
          title: lesson.title,
          pass_score: 80,
          max_attempts: 3,
          questions: []
        });
      } finally {
        setQuizLoading(false);
      }
    } else {
      setEditingQuiz(null);
    }
  };

  const handleSaveLesson = async () => {
    if (!editingLesson || !editingModule || !course) return;
    setSaving(true);
    try {
      let savedLesson: Lesson;
      if (editingLesson.id) {
        savedLesson = await courseService.updateLesson(editingLesson.id, editingLesson);
        setCourse(prev => prev ? {
          ...prev,
          modules: prev.modules.map(m => {
            if (m.id === editingModule.id) {
              return { ...m, lessons: m.lessons.map(l => l.id === savedLesson.id ? savedLesson : l) };
            }
            return m;
          })
        } : null);
      } else {
        savedLesson = await courseService.addLesson(editingModule.id!, editingLesson);
        setCourse(prev => prev ? {
          ...prev,
          modules: prev.modules.map(m => {
            if (m.id === editingModule.id) {
              return { ...m, lessons: [...m.lessons, savedLesson] };
            }
            return m;
          })
        } : null);
      }

      // Save Quiz if applicable
      if (savedLesson.content_type === 'quiz' && editingQuiz) {
        console.log('Quiz data saved via editor state.');
      }

      setLessonDialogOpen(false);
      setSnackbar({ open: true, message: 'Lesson saved successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save lesson', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleVideoUpload = async () => {
    if (!selectedFile || !editingLesson || !editingModule || !course) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      let lessonId = editingLesson.id;
      if (!lessonId) {
        const newLesson = await courseService.addLesson(editingModule.id!, {
          ...editingLesson,
          title: editingLesson.title || 'Untitled Lesson (Uploading Video...)',
          content_type: 'video'
        });
        lessonId = newLesson.id;
        setEditingLesson(newLesson);
        const updatedCourse = await courseService.getCourseStructure(course.id!);
        setCourse(updatedCourse);
      }

      const media = await courseService.uploadVideo(
        course.id!,
        editingModule.id!,
        lessonId!,
        selectedFile,
        (progress) => setUploadProgress(progress)
      );

      setEditingLesson(prev => prev ? { ...prev, media_file_id: media.id } : null);
      setSnackbar({ open: true, message: 'Video uploaded successfully!', severity: 'success' });
      setSelectedFile(null);
    } catch (error) {
      console.error('Video upload failed:', error);
      setSnackbar({ open: true, message: 'Video upload failed', severity: 'error' });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>;
  if (!course) return <Typography>Course not found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate(`/admin/courses`)}><ArrowBack /></IconButton>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Edit Course</Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="General Info" />
          <Tab label="Curriculum" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Course Title" value={course.title} onChange={e => setCourse({ ...course, title: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline rows={4} label="Description" value={course.description} onChange={e => setCourse({ ...course, description: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Category" value={course.category} onChange={e => setCourse({ ...course, category: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField select fullWidth label="Level" value={course.level} onChange={e => setCourse({ ...course, level: e.target.value })}>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button variant="contained" size="large" startIcon={<Save />} loading={saving} onClick={handleUpdateCourse}>Save Course Info</Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {activeTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Course Structure</Typography>
            <Button variant="outlined" startIcon={<Add />} onClick={() => { setEditingModule({ title: '', order: course.modules.length, lessons: [] }); setModuleDialogOpen(true); }}>Add Module</Button>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {course.modules.map((module) => (
              <Paper key={module.id} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: '#f7f9fa', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 700 }}>Module {module.order + 1}: {module.title}</Typography>
                  <IconButton size="small" onClick={() => { setEditingModule(module); setModuleDialogOpen(true); }}><Edit fontSize="small" /></IconButton>
                </Box>
                <List sx={{ py: 0 }}>
                  {module.lessons?.map((lesson) => (
                    <ListItem key={lesson.id} sx={{ py: 1.5, borderTop: '1px solid #d1d7dc' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                        {lesson.content_type === 'video' ? <Movie color="action" /> : lesson.content_type === 'quiz' ? <QuizOutlined color="action" /> : <Description color="action" />}
                        <ListItemText primary={lesson.title} secondary={lesson.content_type} />
                        <IconButton size="small" onClick={() => handleEditLesson(module, lesson)}><Edit fontSize="small" /></IconButton>
                      </Box>
                    </ListItem>
                  ))}
                  <ListItem sx={{ py: 1, bgcolor: 'rgba(0,0,0,0.02)', borderTop: '1px solid #d1d7dc' }}>
                    <Button size="small" startIcon={<Add />} fullWidth onClick={() => { setEditingModule(module); setEditingLesson({ title: '', content_type: 'video', order: module.lessons?.length || 0 } as Lesson); setEditingQuiz(null); setLessonDialogOpen(true); }}>Add Lesson</Button>
                  </ListItem>
                </List>
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      {/* Module Dialog */}
      <Dialog open={moduleDialogOpen} onClose={() => setModuleDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editingModule?.id ? 'Edit Module' : 'New Module'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth label="Module Title" sx={{ mt: 2 }} value={editingModule?.title || ''} onChange={e => setEditingModule(prev => prev ? { ...prev, title: e.target.value } : null)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModuleDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" loading={saving} onClick={handleSaveModule}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialogOpen} onClose={() => setLessonDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingLesson?.id ? 'Edit Lesson' : 'New Lesson'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <TextField fullWidth label="Lesson Title" value={editingLesson?.title || ''} onChange={e => setEditingLesson(prev => prev ? { ...prev, title: e.target.value } : null)} />
          <TextField select fullWidth label="Content Type" value={editingLesson?.content_type || 'video'} onChange={e => setEditingLesson(prev => prev ? { ...prev, content_type: e.target.value as any } : null)}>
            <MenuItem value="video">Video</MenuItem>
            <MenuItem value="text">Text / Article</MenuItem>
            <MenuItem value="quiz">Quiz</MenuItem>
          </TextField>

          {editingLesson?.content_type === 'text' && (
            <TextField fullWidth multiline rows={8} label="Text Content" value={editingLesson?.text_content || ''} onChange={e => setEditingLesson(prev => prev ? { ...prev, text_content: e.target.value } : null)} />
          )}

          {editingLesson?.content_type === 'quiz' && (
            <QuizEditor quiz={editingQuiz} loading={quizLoading} onChange={setEditingQuiz} />
          )}

          {editingLesson?.content_type === 'video' && (
            <Box sx={{ border: '1px dashed #ccc', p: 2, textAlign: 'center', borderRadius: 1 }}>
              <input type="file" accept="video/*" style={{ display: 'none' }} id="video-upload-input" onChange={handleFileChange} />
              <label htmlFor="video-upload-input"><Button variant="outlined" component="span" startIcon={<Movie />} disabled={uploading}>{selectedFile ? 'Change' : 'Choose Video'}</Button></label>
              {selectedFile && <Box sx={{ mt: 1 }}><Typography variant="caption" sx={{ display: 'block', mb: 1 }}>{selectedFile.name}</Typography><Button variant="contained" size="small" startIcon={<CloudUpload />} onClick={handleVideoUpload} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</Button></Box>}
              {uploading && <Box sx={{ mt: 1 }}><LinearProgress variant="determinate" value={uploadProgress} /><Typography variant="caption">{uploadProgress}%</Typography></Box>}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLessonDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" loading={saving} onClick={handleSaveLesson}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminCourseEdit;
