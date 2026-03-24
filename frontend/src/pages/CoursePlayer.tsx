import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import {
    LessonSidebar,
    VideoPlayer,
    ContentTabs,
    LessonInfoBar,
} from '../components/coursePlayer';
import type { ModuleData } from '../components/coursePlayer';
import { designTokens } from '../theme/designTokens';

const mockModules: ModuleData[] = [
    {
        id: 'm1',
        title: 'Foundations',
        lessons: [
            { id: 'l1', title: 'Introduction to Curator', type: 'video', duration: '8:24', completed: true },
            { id: 'l2', title: 'Setting up Workspace', type: 'video', duration: '12:15', completed: true },
            { id: 'l3', title: 'Principles of Minimalist UI', type: 'video', duration: '15:20', completed: false },
            { id: 'l4', title: 'Color Theory & Tone', type: 'video', duration: '18:50', completed: false },
            { id: 'l5', title: 'Typography Hierarchy', type: 'video', duration: '22:10', completed: false },
        ],
    },
    {
        id: 'm2',
        title: 'Layout Mastery',
        lessons: [
            { id: 'l6', title: 'Grid Systems Deep Dive', type: 'video', duration: '20:00', completed: false, locked: true },
            { id: 'l7', title: 'Responsive Breakpoints', type: 'video', duration: '18:30', completed: false, locked: true },
        ],
    },
];

const CoursePlayer: React.FC = () => {
    const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
    const navigate = useNavigate();

    const allLessons = mockModules.flatMap(m => m.lessons);
    const defaultLessonId = allLessons[0].id;
    const [activeLessonId, setActiveLessonId] = useState<string>(lessonId || defaultLessonId);

    const currentIndex = allLessons.findIndex(l => l.id === activeLessonId);
    const activeLesson = allLessons[currentIndex];
    const lessonNumber = currentIndex + 1;

    // Find module label for the active lesson
    let moduleLabel = '';
    mockModules.forEach((m, mIdx) => {
        if (m.lessons.some(l => l.id === activeLessonId)) {
            moduleLabel = `Module ${mIdx + 1}`;
        }
    });

    const handleLessonSelect = (id: string) => {
        setActiveLessonId(id);
        navigate(`/courses/${courseId}/learn/${id}`, { replace: true });
    };

    const handleNext = () => {
        if (currentIndex < allLessons.length - 1) {
            handleLessonSelect(allLessons[currentIndex + 1].id);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            handleLessonSelect(allLessons[currentIndex - 1].id);
        }
    };

    return (
        <Box sx={{ bgcolor: designTokens.colors.bg }}>
            <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2, md: 3 } }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    alignItems: 'flex-start',
                    minHeight: `calc(100vh - ${designTokens.spacing.topbarHeight}px)`,
                }}>

                    {/* ── Left Column: Video + Info Bar + Tabs ── */}
                    <Box sx={{ flex: 1, minWidth: 0, overflowY: { lg: 'auto' } }}>

                        {/* 1. Video Player — padded container */}
                        <Box sx={{ py: { xs: 2, md: 4 }, pr: { lg: 4 }, bgcolor: designTokens.colors.bg }}>
                            <VideoPlayer
                                thumbnailUrl="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1600&auto=format&fit=crop"
                                lessonTitle={activeLesson?.title || ''}
                                onNext={handleNext}
                                onPrev={handlePrev}
                            />
                        </Box>

                        {/* 2. Lesson Info Bar */}
                        <Box sx={{ pr: { lg: 4 } }}>
                            <LessonInfoBar
                                lessonNumber={lessonNumber}
                                lessonTitle={activeLesson?.title || ''}
                                courseTitle="Advanced Visual Design Systems"
                                moduleLabel={moduleLabel}
                                onPrev={handlePrev}
                                onNext={handleNext}
                                canGoPrev={currentIndex > 0}
                                canGoNext={currentIndex < allLessons.length - 1}
                            />
                        </Box>

                        {/* 3. Content Tabs */}
                        <Box sx={{ pr: { lg: 4 } }}>
                            <ContentTabs
                                lessonTitle={activeLesson?.title || ''}
                                lessonDetails={`In this session, we dive deep into the psychology of whitespace and how it influences user focus. We'll explore the 'No-Line' rule and how to use tonal transitions to create natural boundaries within your interfaces. By the end of this lesson, you will understand how to build complex layouts that feel light and breathable.`}
                            />
                        </Box>
                    </Box>

                    {/* ── Right Column: Sticky Lesson Sidebar ── */}
                    <LessonSidebar
                        modules={mockModules}
                        activeLessonId={activeLessonId}
                        onLessonSelect={handleLessonSelect}
                    />
                </Box>
            </Container>
        </Box>
    );
};

export default CoursePlayer;
