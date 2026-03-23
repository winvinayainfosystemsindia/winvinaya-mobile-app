import React from 'react';
import { Box, Typography, Paper, CircularProgress, Tabs, Tab, Divider } from '@mui/material';
import { PlayCircleOutline } from '@mui/icons-material';
import { type Lesson, type Course } from '../../models/course';
import VideoPlayer from './VideoPlayer';
import QuizPlayer from '../QuizPlayer';
import PPTViewer from './PPTViewer';
import CodeSandbox from './CodeSandbox';
import DiscussionThread from './DiscussionThread';
import CourseRating from './CourseRating';

interface CourseContentAreaProps {
  lesson: Lesson;
  course: Course;
  videoData: { hls_url?: string; stream_url: string; status: string } | null;
  videoLoading: boolean;
  slides: any[];
  slidesLoading: boolean;
  codingExercise: any;
  codingLoading: boolean;
  markers: any[];
  discussions: any[];
  ratings: any[];
  onQuizComplete: (attempt: any) => void;
  onCodeSubmit?: (exerciseId: number, code: string) => Promise<any>;
  onPostDiscussion?: (body: string, parentId?: number) => Promise<void>;
  onRateCourse?: (rating: number, review?: string) => Promise<void>;
  onVideoTimeUpdate?: (time: number) => void;
  initialVideoTime?: number;
}

const CourseContentArea: React.FC<CourseContentAreaProps> = ({
  lesson,
  course,
  videoData,
  videoLoading,
  slides,
  slidesLoading,
  codingExercise,
  codingLoading,
  markers = [],
  discussions = [],
  ratings = [],
  onQuizComplete,
  onCodeSubmit,
  onPostDiscussion,
  onRateCourse,
  onVideoTimeUpdate,
  initialVideoTime = 0,
}) => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
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
              <VideoPlayer
                src={videoData.hls_url || videoData.stream_url}
                poster={course.thumbnail_url || undefined}
                initialTime={initialVideoTime}
                onTimeUpdate={onVideoTimeUpdate}
                markers={markers}
              />
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
          <Box sx={{ p: 0, bgcolor: '#f7f9fa', minHeight: 400 }}>
             {slidesLoading ? (
               <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                 <CircularProgress />
               </Box>
             ) : (
               <PPTViewer slides={slides} />
             )}
          </Box>
        ) : lesson.content_type === 'code' ? (
          <Box sx={{ p: 0, bgcolor: '#1e1e1e', height: 600 }}>
             {codingLoading ? (
               <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', color: '#fff' }}>
                 <CircularProgress color="inherit" />
               </Box>
             ) : codingExercise ? (
               <CodeSandbox 
                 exercise={codingExercise} 
                 onSubmit={(code) => onCodeSubmit ? onCodeSubmit(codingExercise.id, code) : Promise.reject('No submit handler')}
               />
             ) : (
               <Box sx={{ p: 4, color: '#fff' }}>
                 <Typography>No coding exercise details found.</Typography>
               </Box>
             )}
          </Box>
        ) : (
          <Box sx={{ p: 4, bgcolor: '#fff', minHeight: 400 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {lesson.text_content || 'No text content available for this lesson.'}
            </Typography>
          </Box>
        )}
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          textColor="primary" 
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', minWidth: 100 }
          }}
        >
          <Tab label="Overview" />
          <Tab label="Q&A" />
          <Tab label="Reviews" />
          {lesson.content_type === 'code' && <Tab label="Resources" />}
        </Tabs>
      </Box>

      <Box sx={{ py: 2 }}>
        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>About this lesson</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {lesson.description || 'No description provided for this lesson.'}
            </Typography>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Course Description</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {course.description || 'Welcome to this course!'}
            </Typography>
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            {onPostDiscussion && (
              <DiscussionThread 
                discussions={discussions} 
                onPost={onPostDiscussion} 
              />
            )}
          </Box>
        )}

        {tabValue === 2 && (
          <Box>
            {onRateCourse && (
              <CourseRating 
                ratings={ratings} 
                onRate={onRateCourse} 
              />
            )}
          </Box>
        )}

        {tabValue === 3 && lesson.content_type === 'code' && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Coding Exercise Resources</Typography>
            <Typography variant="body2" color="text.secondary">
              Use the built-in editor above to solve the exercise. If you get stuck, check the Q&A tab.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CourseContentArea;
