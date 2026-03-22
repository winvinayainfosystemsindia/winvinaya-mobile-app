import React from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { PlayCircleOutline } from '@mui/icons-material';
import { type Lesson, type Course } from '../../models/course';
import QuizPlayer from '../QuizPlayer';

interface CourseContentAreaProps {
  lesson: Lesson;
  course: Course;
  videoData: { stream_url: string; status: string } | null;
  videoLoading: boolean;
  onQuizComplete: (attempt: any) => void;
}

const CourseContentArea: React.FC<CourseContentAreaProps> = ({
  lesson,
  course,
  videoData,
  videoLoading,
  onQuizComplete,
}) => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        {lesson.title}
      </Typography>

      <Paper sx={{ p: 0, mb: 4, borderRadius: 2, overflow: 'hidden', bgcolor: '#000' }}>
        {lesson.content_type === 'video' ? (
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
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', textAlign: 'center', p: 3
                }}
              >
                <PlayCircleOutline sx={{ fontSize: 80, opacity: 0.8, mb: 2 }} />
                <Typography variant="body1">
                  {videoData?.status === 'processing'
                    ? 'Video is currently being processed.'
                    : 'No video linked to this lesson yet.'}
                </Typography>
              </Box>
            )}
          </Box>
        ) : lesson.content_type === 'quiz' ? (
          <Box sx={{ bgcolor: '#f7f9fa', p: { xs: 1, md: 3 } }}>
            <QuizPlayer
              quizId={lesson.id!}
              onComplete={onQuizComplete}
            />
          </Box>
        ) : lesson.content_type === 'ppt' ? (
          <Box sx={{ p: 0, bgcolor: '#f7f9fa' }}>
             {/* Placeholder for PPT Viewer - will show converted slide images */}
             <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6">PPT Presentation</Typography>
                <Typography color="text.secondary">Slide images will be displayed here.</Typography>
             </Box>
          </Box>
        ) : lesson.content_type === 'code' ? (
          <Box sx={{ p: 0, bgcolor: '#1e1e1e', height: 500 }}>
             {/* Placeholder for Code Editor / Sandbox */}
             <Box sx={{ p: 4, color: '#fff' }}>
                <Typography variant="h6">Coding Exercise</Typography>
                <Typography sx={{ opacity: 0.7 }}>Interactive code editor will be available here.</Typography>
             </Box>
          </Box>
        ) : (
          <Box sx={{ p: 4, bgcolor: '#fff', minHeight: 400 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {lesson.text_content || 'No text content available for this lesson.'}
            </Typography>
          </Box>
        )}
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>About this lesson</Typography>
        <Typography variant="body1" color="text.secondary">
          {lesson.description || 'No description provided.'}
        </Typography>
      </Box>
    </Box>
  );
};

export default CourseContentArea;
