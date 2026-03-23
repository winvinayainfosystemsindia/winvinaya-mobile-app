import React from 'react';
import { Box, Typography, Link, Grid } from '@mui/material';
import { designTokens } from '../../theme/designTokens';
import CourseCard from './CourseCard';

interface Course {
    id: string;
    thumbnail: string;
    category: string;
    title: string;
    progress: number;
}

interface MyCoursesProps {
    courses: Course[];
}

const MyCourses: React.FC<MyCoursesProps> = ({ courses }) => {
    return (
        <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: designTokens.colors.textPrimary }}>
                    My Courses
                </Typography>
                <Link 
                    href="#" 
                    underline="none" 
                    sx={{ 
                        color: designTokens.colors.primary, 
                        fontWeight: 700, 
                        fontSize: '0.9rem',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    View All
                </Link>
            </Box>
            
            <Grid container spacing={3}>
                {courses.map((course) => (
                    <Grid size={{ xs: 12, md: 6 }} key={course.id}>
                        <CourseCard 
                            thumbnail={course.thumbnail}
                            category={course.category}
                            title={course.title}
                            progress={course.progress}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default MyCourses;
