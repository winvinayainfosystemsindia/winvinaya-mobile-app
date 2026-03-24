import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import {
    School as SchoolIcon,
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { designTokens } from '../../theme/designTokens';

interface LessonInfoBarProps {
    lessonNumber: number;
    lessonTitle: string;
    courseTitle: string;
    moduleLabel: string;
    onPrev: () => void;
    onNext: () => void;
    canGoPrev: boolean;
    canGoNext: boolean;
}

const LessonInfoBar: React.FC<LessonInfoBarProps> = ({
    lessonNumber,
    lessonTitle,
    courseTitle,
    moduleLabel,
    onPrev,
    onNext,
    canGoPrev,
    canGoNext,
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                gap: 2.5,
                py: 3,
                px: { xs: 2, md: 4 },
                borderBottom: `1px solid ${designTokens.colors.border}`,
                bgcolor: designTokens.colors.surface,
            }}
        >
            {/* Lesson Title & Breadcrumb */}
            <Box sx={{ minWidth: 0 }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 800,
                        fontSize: { xs: '1.1rem', md: '1.35rem' },
                        color: designTokens.colors.textPrimary,
                        mb: 0.5,
                        lineHeight: 1.3,
                    }}
                >
                    {String(lessonNumber).padStart(2, '0')}. {lessonTitle}
                </Typography>
                <Stack direction="row" spacing={0.75} alignItems="center">
                    <SchoolIcon sx={{ fontSize: 15, color: designTokens.colors.primary }} />
                    <Typography sx={{ fontSize: '0.83rem', color: designTokens.colors.textSecondary }}>
                        {courseTitle} &bull; {moduleLabel}
                    </Typography>
                </Stack>
            </Box>

            {/* Prev / Next Buttons */}
            <Stack direction="row" spacing={1.25} flexShrink={0}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={onPrev}
                    disabled={!canGoPrev}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        borderRadius: '10px',
                        borderColor: designTokens.colors.border,
                        color: designTokens.colors.textPrimary,
                        px: 2.5,
                        '&:hover': {
                            borderColor: designTokens.colors.primary,
                            color: designTokens.colors.primary,
                            bgcolor: designTokens.colors.primaryLight,
                        },
                        '&.Mui-disabled': {
                            borderColor: designTokens.colors.border,
                            color: designTokens.colors.textSecondary,
                            opacity: 0.5,
                        },
                    }}
                >
                    Previous
                </Button>
                <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={onNext}
                    disabled={!canGoNext}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        borderRadius: '10px',
                        background: `linear-gradient(135deg, ${designTokens.colors.primary} 0%, ${designTokens.colors.primaryDark} 100%)`,
                        color: '#fff',
                        px: 2.5,
                        boxShadow: '0 4px 14px rgba(0,86,210,0.25)',
                        '&:hover': {
                            background: `linear-gradient(135deg, ${designTokens.colors.primaryDark} 0%, #002f7a 100%)`,
                            boxShadow: '0 6px 18px rgba(0,86,210,0.35)',
                            transform: 'translateY(-1px)',
                        },
                        '&:active': { transform: 'scale(0.97)' },
                        '&.Mui-disabled': {
                            background: designTokens.colors.primaryLight,
                            color: designTokens.colors.primary,
                            opacity: 0.55,
                            boxShadow: 'none',
                        },
                        transition: 'all 0.2s ease',
                    }}
                >
                    Next Lesson
                </Button>
            </Stack>
        </Box>
    );
};

export default LessonInfoBar;
