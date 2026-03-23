import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, LinearProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { type Enrollment } from '../../models/enrollment';

interface CourseCardProps {
  enrollment: Enrollment;
}

const CourseCard: React.FC<CourseCardProps> = ({ enrollment }) => {
  const navigate = useNavigate();
  const { course, progress_percent } = enrollment;

  if (!course) return null;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        border: '1px solid #d1d7dc',
        borderRadius: 0,
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          cursor: 'pointer'
        }
      }}
      onClick={() => navigate(`/student/learn/${course.public_id}`)}
    >
      <CardMedia
        component="img"
        height="145"
        image={course.thumbnail_url || 'https://via.placeholder.com/300x145?text=No+Thumbnail'}
        alt={course.title}
        sx={{ borderBottom: '1px solid #d1d7dc' }}
      />
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.2, height: 38, overflow: 'hidden' }}>
          {course.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          {course.instructor_id ? 'Instructor ID: ' + course.instructor_id : 'WinVinaya Instructor'}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{Math.round(progress_percent)}% complete</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress_percent} 
            sx={{ 
              height: 4, 
              borderRadius: 2, 
              bgcolor: '#d1d7dc',
              '& .MuiLinearProgress-bar': { bgcolor: '#5624d0' }
            }} 
          />
        </Box>
      </CardContent>
      <Box sx={{ p: 1.5, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <Button 
          variant="text" 
          size="small" 
          sx={{ fontWeight: 700, color: '#5624d0', textTransform: 'none' }}
          onClick={(e) => {
            e.stopPropagation();
            // Go to ratings tab in course player logic could be added here
            navigate(`/student/learn/${course.public_id}/?tab=reviews`);
          }}
        >
          Leave a rating
        </Button>
      </Box>
    </Card>
  );
};

export default CourseCard;
