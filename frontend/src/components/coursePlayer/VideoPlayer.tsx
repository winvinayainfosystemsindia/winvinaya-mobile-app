import React, { useState } from 'react';
import { Box, Typography, IconButton, Slider, Stack, Tooltip } from '@mui/material';
import {
    Pause as PauseIcon,
    PlayArrow as PlayIcon,
    Settings as SettingsIcon,
    Fullscreen as FullscreenIcon,
    VolumeUp as VolumeIcon,
} from '@mui/icons-material';
import { designTokens } from '../../theme/designTokens';

interface VideoPlayerProps {
    thumbnailUrl?: string;
    lessonTitle?: string;
    onNext: () => void;
    onPrev: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ thumbnailUrl }) => {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(31); // ~12:45 / 42:00

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                bgcolor: '#0d1117',
                borderRadius: '16px',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
            }}
        >
            {/* Background poster */}
            {thumbnailUrl && (
                <Box
                    component="img"
                    src={thumbnailUrl}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
                />
            )}

            {/* Centered Play/Pause Button */}
            <Box
                onClick={() => setPlaying(!playing)}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${designTokens.colors.primary} 0%, ${designTokens.colors.primaryDark} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: `0 8px 24px rgba(0,86,210,0.45)`,
                    backdropFilter: 'blur(4px)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        transform: 'translate(-50%, -50%) scale(1.1)',
                        boxShadow: `0 12px 32px rgba(0,86,210,0.55)`,
                    },
                    '&:active': {
                        transform: 'translate(-50%, -50%) scale(0.96)',
                    },
                }}
            >
                {playing
                    ? <PauseIcon sx={{ color: '#fff', fontSize: 36 }} />
                    : <PlayIcon sx={{ color: '#fff', fontSize: 36 }} />
                }
            </Box>

            {/* Bottom gradient control bar */}
            <Box sx={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)',
                px: 2.5,
                pt: 4,
                pb: 1.5,
            }}>
                {/* Progress Slider */}
                <Slider
                    value={progress}
                    onChange={(_, val) => setProgress(val as number)}
                    sx={{
                        color: designTokens.colors.tertiary,
                        height: 4,
                        mb: 0.5,
                        p: '8px 0',
                        '& .MuiSlider-thumb': {
                            width: 12,
                            height: 12,
                            '&:hover': { boxShadow: `0 0 0 8px rgba(0,194,146,0.2)` },
                        },
                        '& .MuiSlider-track': {
                            background: `linear-gradient(90deg, ${designTokens.colors.tertiary} 0%, ${designTokens.colors.tertiaryDark} 100%)`,
                            border: 'none',
                        },
                        '& .MuiSlider-rail': { bgcolor: 'rgba(255,255,255,0.2)' },
                    }}
                />

                {/* Control Row */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Tooltip title={playing ? 'Pause' : 'Play'}>
                            <IconButton
                                size="small"
                                onClick={() => setPlaying(!playing)}
                                sx={{ color: '#fff', p: 0.75 }}
                            >
                                {playing
                                    ? <PauseIcon sx={{ fontSize: 20 }} />
                                    : <PlayIcon sx={{ fontSize: 20 }} />
                                }
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Volume">
                            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.75)', p: 0.5 }}>
                                <VolumeIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                        <Typography sx={{
                            fontSize: '0.75rem',
                            color: 'rgba(255,255,255,0.85)',
                            fontFamily: 'monospace',
                            ml: 0.5,
                            userSelect: 'none',
                        }}>
                            12:45 / 42:00
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={0.25} alignItems="center">
                        <Tooltip title="Settings">
                            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.75)', p: 0.5 }}>
                                <SettingsIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Fullscreen">
                            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.75)', p: 0.5 }}>
                                <FullscreenIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
};

export default VideoPlayer;
