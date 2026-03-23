import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Box, Typography, LinearProgress } from '@mui/material';
import { Movie, CloudUpload } from '@mui/icons-material';
import type { Lesson } from '../../../models/course';
import type { Quiz } from '../../../services/contentService';
import QuizEditor from '../../quiz/QuizEditor';
import { designTokens } from '../../../theme/designTokens';

interface LessonFormProps {
  open: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  quiz: Quiz | null;
  onChangeLesson: (updates: Partial<Lesson>) => void;
  onChangeQuiz: (quiz: Quiz | null) => void;
  onSave: () => void;
  onUploadVideo: (file: File) => void;
  saving?: boolean;
  uploading?: boolean;
  uploadProgress?: number;
}

const LessonForm: React.FC<LessonFormProps> = ({ 
  open, onClose, lesson, quiz, onChangeLesson, onChangeQuiz, onSave, onUploadVideo, saving, uploading, uploadProgress 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const checkVideoUpload = () => {
    if (selectedFile) onUploadVideo(selectedFile);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{lesson?.id ? 'Edit Lesson' : 'New Lesson'}</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, borderBottom: `1px solid ${designTokens.colors.border}`, display: 'flex', flexDirection: 'column', gap: 2.5, bgcolor: '#fcfcfc' }}>
          <TextField 
            fullWidth 
            autoFocus
            label="Lesson Title" 
            placeholder="e.g. Introduction to React"
            value={lesson?.title || ''} 
            onChange={e => onChangeLesson({ title: e.target.value })} 
            disabled={saving || uploading}
            error={!lesson?.title?.trim() && !!lesson}
            helperText={!lesson?.title?.trim() ? "Lesson title is required to enable saving" : ""}
          />
          <TextField 
            select 
            fullWidth 
            label="Content Type" 
            value={lesson?.content_type || 'video'} 
            onChange={e => {
              const newType = e.target.value as any;
              onChangeLesson({ content_type: newType });
              if (newType === 'quiz' && !quiz) {
                onChangeQuiz({
                  id: 0,
                  lesson_id: lesson?.id || 0,
                  title: lesson?.title || '',
                  pass_score: 80,
                  max_attempts: 3,
                  questions: []
                });
              }
            }}
            disabled={saving || uploading}
          >
            <MenuItem value="video">Video</MenuItem>
            <MenuItem value="text">Text / Article</MenuItem>
            <MenuItem value="quiz">Quiz</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {lesson?.content_type === 'text' && (
            <TextField 
              fullWidth 
              multiline 
              rows={8} 
              label="Text Content" 
              value={lesson?.text_content || ''} 
              onChange={e => onChangeLesson({ text_content: e.target.value })} 
              disabled={saving}
            />
          )}

          {lesson?.content_type === 'quiz' && (
            <QuizEditor quiz={quiz} loading={false} onChange={onChangeQuiz} />
          )}

          {lesson?.content_type === 'video' && (
            <Box sx={{ border: `2px dashed ${designTokens.colors.border}`, p: 4, textAlign: 'center', borderRadius: 2, bgcolor: designTokens.colors.surface }}>
              <input type="file" accept="video/*" style={{ display: 'none' }} id="video-upload-input" onChange={handleFileChange} />
              <label htmlFor="video-upload-input">
                <Button variant="outlined" component="span" startIcon={<Movie />} disabled={uploading}>
                  {selectedFile ? 'Change File' : 'Choose Video File'}
                </Button>
              </label>
              {selectedFile && (
                 <Box sx={{ mt: 2 }}>
                   <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>{selectedFile.name}</Typography>
                   <Button 
                     variant="contained" 
                     size="small" 
                     startIcon={<CloudUpload />} 
                     onClick={checkVideoUpload} 
                     disabled={uploading}
                     sx={{ bgcolor: '#a435f0', '&:hover': { bgcolor: '#8710d8' } }}
                   >
                     {uploading ? 'Uploading...' : 'Upload Video'}
                   </Button>
                 </Box>
              )}
              {uploading && (
                 <Box sx={{ mt: 2 }}>
                   <LinearProgress variant="determinate" value={uploadProgress || 0} color="secondary" />
                   <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>{uploadProgress}%</Typography>
                 </Box>
              )}
              {lesson.media_file_id && !selectedFile && !uploading && (
                <Typography variant="body2" color="success.main" sx={{ mt: 2, fontWeight: 700 }}>✓ Video uploaded and attached</Typography>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={saving || uploading}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={onSave} 
          disabled={saving || uploading || !lesson?.title?.trim()}
          sx={{ bgcolor: '#a435f0', '&:hover': { bgcolor: '#8710d8' } }}
        >
          {saving ? 'Saving...' : 'Save Lesson'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LessonForm;
