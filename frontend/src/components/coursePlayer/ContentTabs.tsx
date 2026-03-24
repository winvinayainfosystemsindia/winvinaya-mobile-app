import React, { useState } from 'react';
import {
    Box, Typography, Stack, Chip, Avatar, Paper, Link,
    Button, TextField, Divider,
} from '@mui/material';
import {
    Download as DownloadIcon,
    Article as ArticleIcon,
    Code as CodeIcon,
    ThumbUp as ThumbUpIcon,
} from '@mui/icons-material';
import { designTokens } from '../../theme/designTokens';

interface ContentTabsProps {
    lessonDetails: string;
    lessonTitle: string;
}

const TABS = ['Overview', 'Resources', 'Q&A', 'Notes'];

const ContentTabs: React.FC<ContentTabsProps> = ({ lessonDetails }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [noteText, setNoteText] = useState('');

    return (
        <Box sx={{ bgcolor: designTokens.colors.surface, width: '100%' }}>
            {/* ── Tab Strip ── */}
            <Box sx={{
                borderBottom: `1px solid ${designTokens.colors.border}`,
                px: { xs: 2, md: 4 },
            }}>
                <Stack direction="row" spacing={0}>
                    {TABS.map((tab, idx) => (
                        <Box
                            key={tab}
                            onClick={() => setActiveTab(idx)}
                            sx={{
                                pb: '14px',
                                pt: '16px',
                                mr: 4,
                                cursor: 'pointer',
                                borderBottom: activeTab === idx
                                    ? `2px solid ${designTokens.colors.primary}`
                                    : '2px solid transparent',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <Typography sx={{
                                fontSize: '0.875rem',
                                fontWeight: activeTab === idx ? 700 : 500,
                                color: activeTab === idx
                                    ? designTokens.colors.primary
                                    : designTokens.colors.textSecondary,
                                transition: 'color 0.15s ease',
                                userSelect: 'none',
                                '&:hover': { color: designTokens.colors.primary },
                            }}>
                                {tab}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>

            {/* ── Tab Content ── */}
            <Box sx={{ p: { xs: 2, md: 4 } }}>

                {/* Overview */}
                {activeTab === 0 && (
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                        {/* Left — Description */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{
                                fontWeight: 800,
                                fontSize: '1.05rem',
                                mb: 1.5,
                                color: designTokens.colors.textPrimary,
                            }}>
                                About this lesson
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: designTokens.colors.textSecondary,
                                lineHeight: 1.85,
                                mb: 3,
                                fontSize: '0.9rem',
                            }}>
                                {lessonDetails}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {['UI Design', 'Minimalism', 'Professional'].map(tag => (
                                    <Chip
                                        key={tag}
                                        label={tag.toUpperCase()}
                                        size="small"
                                        sx={{
                                            bgcolor: designTokens.colors.primaryLight,
                                            color: designTokens.colors.primary,
                                            fontWeight: 700,
                                            fontSize: '0.68rem',
                                            letterSpacing: '0.05em',
                                            borderRadius: '6px',
                                            border: `1px solid ${designTokens.colors.primary}22`,
                                            height: 26,
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Box>

                        {/* Right — Instructor Card */}
                        <Box sx={{ width: { xs: '100%', md: '220px' }, flexShrink: 0 }}>
                            <Paper elevation={0} sx={{
                                p: 2.5,
                                border: `1px solid ${designTokens.colors.border}`,
                                borderRadius: '14px',
                                bgcolor: designTokens.colors.bg,
                            }}>
                                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', mb: 2, color: designTokens.colors.textPrimary }}>
                                    Instructor
                                </Typography>
                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.75 }}>
                                    <Avatar
                                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&auto=format&fit=crop"
                                        sx={{ width: 46, height: 46 }}
                                    />
                                    <Box>
                                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: designTokens.colors.textPrimary, lineHeight: 1.3 }}>
                                            Prof. Adrian Thorne
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.72rem', color: designTokens.colors.textSecondary }}>
                                            Senior Design Lead
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Divider sx={{ mb: 1.75, borderColor: designTokens.colors.border }} />
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        borderRadius: '8px',
                                        fontSize: '0.82rem',
                                        borderColor: designTokens.colors.border,
                                        color: designTokens.colors.textPrimary,
                                        '&:hover': {
                                            borderColor: designTokens.colors.primary,
                                            color: designTokens.colors.primary,
                                            bgcolor: designTokens.colors.primaryLight,
                                        },
                                    }}
                                >
                                    View Profile
                                </Button>
                            </Paper>
                        </Box>
                    </Stack>
                )}

                {/* Resources */}
                {activeTab === 1 && (
                    <Box>
                        <Typography sx={{ fontWeight: 800, mb: 2, color: designTokens.colors.textPrimary }}>
                            Downloads
                        </Typography>
                        <Stack spacing={1.5}>
                            {[
                                { icon: <ArticleIcon />, name: 'session_slides.pdf', size: '4.2 MB' },
                                { icon: <CodeIcon />, name: 'starter_code.zip', size: '12 KB' },
                                { icon: <ArticleIcon />, name: 'reading_references.pdf', size: '2.8 MB' },
                            ].map((res, idx) => (
                                <Box key={idx} sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2,
                                    border: `1px solid ${designTokens.colors.border}`,
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    bgcolor: designTokens.colors.surface,
                                    transition: 'all 0.15s ease',
                                    '&:hover': {
                                        bgcolor: designTokens.colors.bg,
                                        borderColor: designTokens.colors.primary,
                                        boxShadow: `0 4px 12px rgba(0,86,210,0.08)`,
                                    },
                                }}>
                                    <Box sx={{ color: designTokens.colors.textSecondary, mr: 2, display: 'flex' }}>
                                        {res.icon}
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Link href="#" underline="hover" sx={{ color: designTokens.colors.primary, fontWeight: 700, fontSize: '0.88rem' }}>
                                            {res.name}
                                        </Link>
                                        <Typography sx={{ fontSize: '0.75rem', color: designTokens.colors.textSecondary }}>
                                            {res.size}
                                        </Typography>
                                    </Box>
                                    <DownloadIcon sx={{ color: designTokens.colors.textSecondary, fontSize: 20 }} />
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                )}

                {/* Q&A */}
                {activeTab === 2 && (
                    <Box>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                placeholder="Search questions…"
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                            <Button variant="contained" sx={{
                                bgcolor: designTokens.colors.primary,
                                fontWeight: 700,
                                textTransform: 'none',
                                borderRadius: '8px',
                                flexShrink: 0,
                                px: 2.5,
                                '&:hover': { bgcolor: designTokens.colors.primaryDark },
                            }}>
                                Ask Question
                            </Button>
                        </Stack>
                        {[
                            { name: 'John S.', initials: 'JS', time: '2 days ago', question: 'Getting a compilation error on step 3. The compiler says "undefined reference to qubit_state". Using Qiskit 0.39.', replies: 3 },
                            { name: 'Priya M.', initials: 'PM', time: '5 days ago', question: 'What does the dagger symbol mean on the gate notation shown at 8:20?', replies: 1 },
                        ].map((item, idx) => (
                            <Paper key={idx} elevation={0} sx={{
                                p: 2.5,
                                mb: 2,
                                border: `1px solid ${designTokens.colors.border}`,
                                borderRadius: '12px',
                                bgcolor: designTokens.colors.surface,
                            }}>
                                <Stack direction="row" spacing={2}>
                                    <Avatar sx={{
                                        bgcolor: designTokens.colors.primary,
                                        width: 36,
                                        height: 36,
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        flexShrink: 0,
                                    }}>
                                        {item.initials}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                            <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: designTokens.colors.textPrimary }}>
                                                {item.name}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.75rem', color: designTokens.colors.textSecondary }}>
                                                {item.time}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ color: designTokens.colors.textSecondary, lineHeight: 1.7, mb: 1.5 }}>
                                            {item.question}
                                        </Typography>
                                        <Stack direction="row" spacing={2}>
                                            <Button
                                                size="small"
                                                startIcon={<ThumbUpIcon sx={{ fontSize: 13 }} />}
                                                sx={{ textTransform: 'none', color: designTokens.colors.textSecondary, fontWeight: 600, p: 0, fontSize: '0.78rem', minWidth: 0, '&:hover': { bgcolor: 'transparent', color: designTokens.colors.textPrimary } }}
                                            >
                                                Like
                                            </Button>
                                            <Button
                                                size="small"
                                                sx={{ textTransform: 'none', color: designTokens.colors.primary, fontWeight: 700, p: 0, fontSize: '0.78rem', minWidth: 0, '&:hover': { bgcolor: 'transparent' } }}
                                            >
                                                {item.replies} {item.replies === 1 ? 'Reply' : 'Replies'}
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Paper>
                        ))}
                    </Box>
                )}

                {/* Notes */}
                {activeTab === 3 && (
                    <Box>
                        <Typography sx={{ fontWeight: 800, mb: 0.5, color: designTokens.colors.textPrimary }}>
                            My Notes
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.textSecondary, mb: 2.5 }}>
                            Notes are tied to the current video timestamp.
                        </Typography>
                        <Box sx={{
                            p: 1.5,
                            bgcolor: designTokens.colors.primaryLight,
                            borderRadius: '8px',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: designTokens.colors.primary, flexShrink: 0 }} />
                            <Typography sx={{ fontSize: '0.82rem', color: designTokens.colors.primary, fontFamily: 'monospace' }}>
                                At 12:45
                            </Typography>
                        </Box>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Write a note for this moment…"
                            value={noteText}
                            onChange={e => setNoteText(e.target.value)}
                            sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.9rem' } }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                disabled={!noteText.trim()}
                                sx={{
                                    bgcolor: designTokens.colors.primary,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    '&:hover': { bgcolor: designTokens.colors.primaryDark },
                                    '&.Mui-disabled': { bgcolor: designTokens.colors.primaryLight, color: designTokens.colors.primary },
                                }}
                            >
                                Save Note
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ContentTabs;
