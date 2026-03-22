import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ExpandMore,
  PlayCircleOutline,
  QuizOutlined,
  AssignmentOutlined,
  DescriptionOutlined,
  LockOutlined,
  CheckCircle,
} from '@mui/icons-material';
import type { Course, Module, Lesson } from '../../models/course';
import { type CourseProgress, ProgressStatus } from '../../models/progress';

interface CourseSidebarProps {
  course: Course;
  progress: CourseProgress | null;
  selectedLesson: Lesson | null;
  expandedModule: number | null;
  onLessonClick: (lesson: Lesson, moduleId: number) => void;
  onToggleModule: (moduleId: number) => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  progress,
  selectedLesson,
  expandedModule,
  onLessonClick,
  onToggleModule,
}) => {
  const getLessonStatus = (lessonId: number) => {
    if (!progress) return ProgressStatus.not_started;
    const lp = progress.lesson_progress?.find(p => p.lesson_id === lessonId);
    return lp?.status || ProgressStatus.not_started;
  };

  const checkIsLocked = (lesson: Lesson, allLessons: Lesson[]) => {
    // Admins/Instructors are never locked out (handled in parent usually, but good to have here)
    const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
    if (currentIndex === 0) return false;

    // Sequential logic: previous lesson must be completed
    const prevLesson = allLessons[currentIndex - 1];
    return getLessonStatus(prevLesson.id!) !== ProgressStatus.completed;
  };

  const allLessons = course.modules.flatMap(m => m.lessons || []);

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Course content</Typography>
      <Paper variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden' }}>
        {course.modules?.map((module: Module) => (
          <Accordion
            key={module.id}
            expanded={expandedModule === module.id}
            onChange={() => onToggleModule(module.id!)}
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
                {module.lessons?.map((lesson: Lesson) => {
                  const status = getLessonStatus(lesson.id!);
                  const isLocked = checkIsLocked(lesson, allLessons);

                  return (
                    <ListItemButton
                      key={lesson.id}
                      disabled={isLocked}
                      selected={selectedLesson?.id === lesson.id}
                      onClick={() => onLessonClick(lesson, module.id!)}
                      sx={{
                        py: 1.5,
                        opacity: isLocked ? 0.6 : 1,
                        '&.Mui-selected': { bgcolor: 'rgba(164, 53, 240, 0.08)', color: '#a435f0' }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                        {isLocked ? (
                          <LockOutlined fontSize="small" />
                        ) : status === ProgressStatus.completed ? (
                          <CheckCircle fontSize="small" color="success" />
                        ) : lesson.content_type === 'video' ? (
                          <PlayCircleOutline />
                        ) : lesson.content_type === 'quiz' ? (
                          <QuizOutlined />
                        ) : lesson.content_type === 'assignment' ? (
                          <AssignmentOutlined />
                        ) : (
                          <DescriptionOutlined />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={lesson.title}
                        primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: (selectedLesson?.id === lesson.id || status === ProgressStatus.completed) ? 700 : 400 }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Box>
  );
};

export default CourseSidebar;
