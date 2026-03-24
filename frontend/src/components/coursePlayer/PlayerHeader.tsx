import React from 'react';
import { Box, Typography, Stack, CircularProgress } from '@mui/material';
import { CheckCircle as CheckCircleIcon, ArrowBackIos as BackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { designTokens } from '../../theme/designTokens';

interface PlayerHeaderProps {
    courseId: string;
    courseTitle: string;
    progressPercent: number;
    completedLessons: number;
    totalLessons: number;
}

const PlayerHeader: React.FC<PlayerHeaderProps> = ({
    courseId,
    courseTitle,
    progressPercent,
    completedLessons,
    totalLessons,
}) => {
    const navigate = useNavigate();

    return (
        <Box sx={{
            height: '64px',
            bgcolor: '#1c1d1f',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 2, md: 4 },
            borderBottom: '1px solid #3e4143',
            flexShrink: 0,
            zIndex: 100,
        }}>
            {/* Left: Logo + Course Title */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
                {/* Logo */}
                <Box
                    onClick={() => navigate('/')}
                    sx={{
                        display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer',
                        '&:hover': { opacity: 0.8 }
                    }}
                >
                    <Box sx={{
                        width: 32, height: 32, borderRadius: '8px',
                        bgcolor: designTokens.colors.primary,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 900, fontSize: '0.9rem', color: '#fff', fontFamily: 'inherit'
                    }}>
                        AC
                    </Box>
                </Box>

                <Box sx={{ width: '1px', height: 28, bgcolor: '#3e4143', flexShrink: 0 }} />

                {/* Course Title */}
                <Typography sx={{
                    fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.95rem' },
                    color: '#f7f9fa',
                    maxWidth: { xs: '140px', sm: '300px', md: '480px' },
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                    {courseTitle}
                </Typography>
            </Stack>

            {/* Right: Progress + Back */}
            <Stack direction="row" spacing={3} alignItems="center">
                {/* Progress */}
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex', width: 40, height: 40 }}>
                        <CircularProgress
                            variant="determinate"
                            value={100}
                            size={40}
                            thickness={4}
                            sx={{ color: '#3e4143', position: 'absolute' }}
                        />
                        <CircularProgress
                            variant="determinate"
                            value={progressPercent}
                            size={40}
                            thickness={4}
                            sx={{ color: '#a435f0' }}
                        />
                        <Box sx={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {progressPercent === 100 ? (
                                <CheckCircleIcon sx={{ fontSize: 18, color: '#a435f0' }} />
                            ) : (
                                <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: '#fff' }}>
                                    {Math.round(progressPercent)}%
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#f7f9fa', lineHeight: 1.2 }}>
                            {completedLessons}/{totalLessons}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#a1a7b3' }}>
                            Complete
                        </Typography>
                    </Box>
                </Stack>

                <Box sx={{ width: '1px', height: 28, bgcolor: '#3e4143' }} />

                {/* Back to course */}
                <Box
                    onClick={() => navigate(`/courses/${courseId}`)}
                    sx={{
                        display: 'flex', alignItems: 'center', gap: 0.5,
                        cursor: 'pointer', color: '#a1a7b3',
                        transition: 'color 0.2s',
                        '&:hover': { color: '#fff' }
                    }}
                >
                    <BackIcon sx={{ fontSize: 14 }} />
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                        Back
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
};

export default PlayerHeader;
