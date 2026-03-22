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
  Divider,
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
} from '@mui/icons-material';
import { courseService, type Course, type Module, type Lesson } from '../services/courseService';

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
    try {
      if (editingModule.id) {
        // Update existing
        const updatedModule = await courseService.updateModule(editingModule.id, { 
          title: editingModule.title, 
          order: editingModule.order 
        });
        setCourse(prev => prev ? {
          ...prev,
          modules: prev.modules.map(m => m.id === updatedModule.id ? updatedModule : m)
        } : null);
      } else {
        // Create new
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
      // If the lesson doesn't exist yet, we might need to create it first OR 
      // the backend video upload endpoint needs course/module/lesson IDs.
      // Our backend media/video endpoint takes course_id, module_id, lesson_id.
      // If it's a new lesson (no ID), we should probably create the lesson shell first.
      
      let lessonId = editingLesson.id;
      if (!lessonId) {
        const newLesson = await courseService.addLesson(editingModule.id!, {
          ...editingLesson,
          title: editingLesson.title || 'Untitled Lesson (Uploading Video...)',
          content_type: 'video'
        });
        lessonId = newLesson.id;
        setEditingLesson(newLesson);
        // Refresh course structure to show the new lesson shell
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
      setSnackbar({ open: true, message: 'Video upload failed. Please try again.', severity: 'error' });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSaveLesson = async () => {
    if (!editingLesson || !editingModule || !course) return;
    try {
      if (editingLesson.id) {
        // Update
        const updatedLesson = await courseService.updateLesson(editingLesson.id, editingLesson);
        setCourse(prev => prev ? {
          ...prev,
          modules: prev.modules.map(m => {
            if (m.id === editingModule.id) {
              return { ...m, lessons: m.lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l) };
            }
            return m;
          })
        } : null);
      } else {
        // Create
        const newLesson = await courseService.addLesson(editingModule.id!, editingLesson);
        setCourse(prev => prev ? {
          ...prev,
          modules: prev.modules.map(m => {
            if (m.id === editingModule.id) {
              return { ...m, lessons: [...m.lessons, newLesson] };
            }
            return m;
          })
        } : null);
      }
      setLessonDialogOpen(false);
      setSnackbar({ open: true, message: 'Lesson saved successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save lesson', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) return <Typography>Course not found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate(`/courses/${course.id}`)}>
          <ArrowBack />
        </IconButton>
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
              <TextField 
                fullWidth label="Course Title" 
                value={course.title} 
                onChange={e => setCourse({...course, title: e.target.value})}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField 
                fullWidth multiline rows={4} label="Description" 
                value={course.description} 
                onChange={e => setCourse({...course, description: e.target.value})}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField 
                fullWidth label="Category" 
                value={course.category} 
                onChange={e => setCourse({...course, category: e.target.value})}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField 
                select fullWidth label="Level" 
                value={course.level} 
                onChange={e => setCourse({...course, level: e.target.value})}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<Save />}
                loading={saving}
                onClick={handleUpdateCourse}
              >
                Save General Changes
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {activeTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Course Structure</Typography>
            <Button 
              variant="outlined" 
              startIcon={<Add />}
              onClick={() => {
                setEditingModule({ title: '', order: course.modules.length, lessons: [] });
                setModuleDialogOpen(true);
              }}
            >
              Add Module
            </Button>
          </Box>

          {course.modules.length === 0 ? (
            <Alert severity="info">No modules added yet. Click "Add Module" to start building your curriculum.</Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {course.modules.map((module) => (
                <Paper key={module.id} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <Box sx={{ bgcolor: '#f7f9fa', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #d1d7dc' }}>
                    <Typography sx={{ fontWeight: 700 }}>Module {module.order + 1}: {module.title}</Typography>
                    <Box>
                      <IconButton size="small" onClick={() => { setEditingModule(module); setModuleDialogOpen(true); }}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <List sx={{ py: 0 }}>
                    {module.lessons?.map((lesson) => (
                      <React.Fragment key={lesson.id}>
                        <ListItem sx={{ py: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                            {lesson.content_type === 'video' ? <Movie color="action" /> : <Description color="action" />}
                            <ListItemText primary={lesson.title} secondary={lesson.content_type} />
                            <IconButton size="small" onClick={() => { setEditingModule(module); setEditingLesson(lesson); setLessonDialogOpen(true); }}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Box>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                    <ListItem sx={{ py: 1, bgcolor: 'rgba(0,0,0,0.02)' }}>
                      <Button 
                        size="small" 
                        startIcon={<Add />} 
                        fullWidth 
                        onClick={() => {
                          setEditingModule(module);
                          setEditingLesson({ title: '', content_type: 'video', order: module.lessons?.length || 0 });
                          setLessonDialogOpen(true);
                        }}
                      >
                        Add Lesson
                      </Button>
                    </ListItem>
                  </List>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Module Dialog */}
      <Dialog open={moduleDialogOpen} onClose={() => setModuleDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editingModule?.id ? 'Edit Module' : 'New Module'}</DialogTitle>
        <DialogContent>
          <TextField 
            autoFocus fullWidth label="Module Title" sx={{ mt: 2 }}
            value={editingModule?.title || ''}
            onChange={e => setEditingModule(prev => prev ? {...prev, title: e.target.value} : null)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModuleDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveModule}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialogOpen} onClose={() => setLessonDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingLesson?.id ? 'Edit Lesson' : 'New Lesson'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <TextField 
            fullWidth label="Lesson Title"
            value={editingLesson?.title || ''}
            onChange={e => setEditingLesson(prev => prev ? {...prev, title: e.target.value} : null)}
          />
          <TextField 
            select fullWidth label="Content Type"
            value={editingLesson?.content_type || 'video'}
            onChange={e => setEditingLesson(prev => prev ? {...prev, content_type: e.target.value} : null)}
          >
            <MenuItem value="video">Video</MenuItem>
            <MenuItem value="text">Text / Article</MenuItem>
            <MenuItem value="quiz">Quiz</MenuItem>
          </TextField>
          
          {editingLesson?.content_type === 'text' && (
            <TextField 
              fullWidth multiline rows={8} label="Text Content"
              value={editingLesson?.text_content || ''}
              onChange={e => setEditingLesson(prev => prev ? {...prev, text_content: e.target.value} : null)}
            />
          )}
          
          <TextField 
            fullWidth multiline rows={2} label="Description"
            value={editingLesson?.description || ''}
            onChange={e => setEditingLesson(prev => prev ? {...prev, description: e.target.value} : null)}
          />

          {editingLesson?.content_type === 'video' && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Video Content</Typography>
              {editingLesson.media_file_id ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Video linked (Media ID: {editingLesson.media_file_id})
                </Alert>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  No video uploaded yet.
                </Alert>
              )}
              
              <Box sx={{ border: '1px dashed #ccc', p: 3, textAlign: 'center', borderRadius: 1 }}>
                <input
                  type="file"
                  accept="video/*"
                  style={{ display: 'none' }}
                  id="video-upload-input"
                  onChange={handleFileChange}
                />
                <label htmlFor="video-upload-input">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Movie />}
                    disabled={uploading}
                  >
                    {selectedFile ? 'Change Video' : 'Choose Video'}
                  </Button>
                </label>
                
                {selectedFile && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Selected: <strong>{selectedFile.name}</strong>
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<CloudUpload />}
                      onClick={handleVideoUpload}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Upload Video'}
                    </Button>
                  </Box>
                )}
                
                {uploading && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                    <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                      {uploadProgress}% uploaded
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLessonDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveLesson}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminCourseEdit;
