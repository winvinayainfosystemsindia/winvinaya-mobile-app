import React, { useState } from 'react';
import { Box, Typography, Stack, LinearProgress } from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Check as CheckIcon,
} from '@mui/icons-material';
import { designTokens } from '../../theme/designTokens';

export interface LessonData {
    id: string;
    title: string;
    type: 'video' | 'article' | 'quiz';
    duration: string;
    completed: boolean;
    locked?: boolean;
}

export interface ModuleData {
    id: string;
    title: string;
    lessons: LessonData[];
}

interface LessonSidebarProps {
    modules: ModuleData[];
    activeLessonId: string;
    onLessonSelect: (lessonId: string) => void;
}

const LessonSidebar: React.FC<LessonSidebarProps> = ({
    modules,
    activeLessonId,
    onLessonSelect,
}) => {
    const [expanded, setExpanded] = useState<string[]>(modules.map(m => m.id));

    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedLessons = modules.reduce((acc, m) => acc + m.lessons.filter(l => l.completed).length, 0);
    const progressPercent = Math.round((completedLessons / totalLessons) * 100);

    let lessonCounter = 0;

    const toggleModule = (id: string) => {
        setExpanded(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    return (
        <Box sx={{
            width: { xs: '100%', lg: '400px' },
            minWidth: { lg: '400px' },
            bgcolor: designTokens.colors.bg,
            borderLeft: { lg: `1px solid ${designTokens.colors.border}` },
            borderTop: { xs: `1px solid ${designTokens.colors.border}`, lg: 'none' },
            display: 'flex',
            flexDirection: 'column',
            height: { lg: `calc(100vh - ${designTokens.spacing.topbarHeight}px)` },
            overflowY: 'auto',
            position: { lg: 'sticky' },
            top: { lg: `${designTokens.spacing.topbarHeight}px` },
            alignSelf: { lg: 'flex-start' },
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-thumb': { bgcolor: designTokens.colors.border, borderRadius: '4px' },
            '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
        }}>

            {/* ── Sticky Header ── */}
            <Box sx={{
                p: 2.5,
                borderBottom: `1px solid ${designTokens.colors.border}`,
                position: 'sticky',
                top: 0,
                bgcolor: designTokens.colors.bg,
                zIndex: 1,
            }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: designTokens.colors.textPrimary }}>
                        Course Content
                    </Typography>
                    <Box sx={{
                        px: 1.5, py: 0.4,
                        bgcolor: designTokens.colors.tertiaryLight,
                        borderRadius: '20px',
                    }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: designTokens.colors.tertiaryDark }}>
                            {progressPercent}% Complete
                        </Typography>
                    </Box>
                </Stack>

                {/* Teal progress bar */}
                <LinearProgress
                    variant="determinate"
                    value={progressPercent}
                    sx={{
                        height: 6,
                        borderRadius: '999px',
                        bgcolor: designTokens.colors.border,
                        '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(90deg, ${designTokens.colors.tertiary} 0%, ${designTokens.colors.tertiaryDark} 100%)`,
                            borderRadius: '999px',
                        },
                    }}
                />
            </Box>

            {/* ── Module List ── */}
            <Box sx={{ p: 1.5 }}>
                {modules.map((module, mIdx) => {
                    const isOpen = expanded.includes(module.id);
                    return (
                        <Box key={module.id} sx={{ mb: 1 }}>
                            {/* Module Header */}
                            <Box
                                onClick={() => toggleModule(module.id)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    px: 1.5,
                                    py: 1.25,
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    '&:hover': { bgcolor: designTokens.colors.sidebarHover },
                                    transition: 'background 0.15s',
                                }}
                            >
                                <Typography sx={{
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    color: designTokens.colors.textSecondary,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                }}>
                                    Module {mIdx + 1}: {module.title}
                                </Typography>
                                {isOpen
                                    ? <ExpandLessIcon sx={{ fontSize: '1rem', color: designTokens.colors.textSecondary }} />
                                    : <ExpandMoreIcon sx={{ fontSize: '1rem', color: designTokens.colors.textSecondary }} />
                                }
                            </Box>

                            {/* Lesson Items */}
                            {isOpen && (
                                <Box sx={{ mt: 0.5 }}>
                                    {module.lessons.map((lesson) => {
                                        lessonCounter++;
                                        const num = lessonCounter;
                                        const isActive = lesson.id === activeLessonId;

                                        return (
                                            <Box
                                                key={lesson.id}
                                                onClick={() => !lesson.locked && onLessonSelect(lesson.id)}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: 1.75,
                                                    px: 1.5,
                                                    py: 1.25,
                                                    borderRadius: '10px',
                                                    cursor: lesson.locked ? 'default' : 'pointer',
                                                    bgcolor: isActive
                                                        ? designTokens.colors.primaryLight
                                                        : 'transparent',
                                                    border: isActive
                                                        ? `1px solid ${designTokens.colors.primary}22`
                                                        : '1px solid transparent',
                                                    transition: 'all 0.15s ease',
                                                    '&:hover': {
                                                        bgcolor: !lesson.locked
                                                            ? (isActive ? designTokens.colors.primaryLight : designTokens.colors.sidebarHover)
                                                            : 'transparent',
                                                    },
                                                }}
                                            >
                                                {/* Status Icon */}
                                                <Box sx={{ flexShrink: 0, mt: 0.15 }}>
                                                    {lesson.completed ? (
                                                        <Box sx={{
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: '50%',
                                                            bgcolor: designTokens.colors.tertiary,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}>
                                                            <CheckIcon sx={{ fontSize: 15, color: '#fff' }} />
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: '50%',
                                                            border: `2px solid ${isActive ? designTokens.colors.primary : designTokens.colors.border}`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            bgcolor: isActive ? designTokens.colors.primary : 'transparent',
                                                        }}>
                                                            <Typography sx={{
                                                                fontSize: '0.62rem',
                                                                fontWeight: 800,
                                                                color: isActive ? '#fff' : designTokens.colors.textSecondary,
                                                            }}>
                                                                {String(num).padStart(2, '0')}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>

                                                {/* Title + meta */}
                                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                                    <Typography sx={{
                                                        fontSize: '0.85rem',
                                                        fontWeight: isActive ? 700 : 500,
                                                        color: isActive ? designTokens.colors.primary : designTokens.colors.textPrimary,
                                                        lineHeight: 1.4,
                                                        mb: 0.3,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}>
                                                        {String(num).padStart(2, '0')}. {lesson.title}
                                                    </Typography>

                                                    {isActive ? (
                                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                                            <Box sx={{
                                                                width: 6,
                                                                height: 6,
                                                                borderRadius: '50%',
                                                                bgcolor: designTokens.colors.primary,
                                                                animation: 'pulse 1.5s ease-in-out infinite',
                                                                '@keyframes pulse': {
                                                                    '0%, 100%': { opacity: 1 },
                                                                    '50%': { opacity: 0.4 },
                                                                },
                                                            }} />
                                                            <Typography sx={{
                                                                fontSize: '0.68rem',
                                                                fontWeight: 700,
                                                                color: designTokens.colors.primary,
                                                                letterSpacing: '0.06em',
                                                                textTransform: 'uppercase',
                                                            }}>
                                                                Playing Now
                                                            </Typography>
                                                        </Stack>
                                                    ) : (
                                                        <Typography sx={{ fontSize: '0.72rem', color: designTokens.colors.textSecondary }}>
                                                            {lesson.duration}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default LessonSidebar;
