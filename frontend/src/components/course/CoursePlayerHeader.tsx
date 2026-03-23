import React from 'react';
import { Box, Typography, IconButton, LinearProgress, Tooltip } from '@mui/material';
import { ChevronLeft, Star, Share, HelpOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { type Course } from '../../models/course';
import { type CourseProgress } from '../../models/progress';

interface CoursePlayerHeaderProps {
  course: Course;
  progress: CourseProgress | null;
}

const CoursePlayerHeader: React.FC<CoursePlayerHeaderProps> = ({ course, progress }) => {
  const navigate = useNavigate();

  const progressPercent = progress ? Math.round(progress.progress_percent) : 0;

  return (
    <Box sx={{ 
      height: 64, 
      bgcolor: '#1c1d1f', 
      color: '#fff', 
      display: 'flex', 
      alignItems: 'center', 
      px: { xs: 1, md: 3 },
      boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
      zIndex: 1202
    }}>
      <IconButton 
        onClick={() => navigate('/student/dashboard')} 
        sx={{ color: '#fff', mr: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ChevronLeft />
      </IconButton>

      <Typography variant="h6" noWrap sx={{ fontWeight: 700, flexGrow: 1, fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
        {course.title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, gap: 2 }}>
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Star sx={{ color: '#f3ca8c', fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 700 }}>Leave a rating</Typography>
        </Box>

        <Box sx={{ width: 120, display: { xs: 'none', sm: 'block' } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{progressPercent}% complete</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progressPercent} 
            sx={{ 
              height: 4, 
              borderRadius: 2, 
              bgcolor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': { bgcolor: '#5624d0' }
            }} 
          />
        </Box>

        <Tooltip title="Share this course">
          <IconButton sx={{ color: '#fff' }}><Share fontSize="small" /></IconButton>
        </Tooltip>
        
        <Tooltip title="Help">
          <IconButton sx={{ color: '#fff' }}><HelpOutline fontSize="small" /></IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default CoursePlayerHeader;
