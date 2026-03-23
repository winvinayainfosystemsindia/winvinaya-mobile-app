import React from 'react';
import { 
    Box, 
    Typography, 
    Accordion, 
    AccordionSummary, 
    AccordionDetails,
    Stack
} from '@mui/material';
import { 
    ExpandMore as ExpandMoreIcon, 
    PlayCircleOutline as PlayIcon,
    InsertDriveFileOutlined as FileIcon
} from '@mui/icons-material';
import { designTokens } from '../../theme/designTokens';

interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'quiz' | 'reading' | 'attachment';
    meta: string;
}

interface Module {
    title: string;
    lectureCount: number;
    duration: string;
    lessons: Lesson[];
}

interface CourseContentAccordionProps {
    modules: Module[];
}

const CourseContentAccordion: React.FC<CourseContentAccordionProps> = ({ modules }) => {
    return (
        <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: designTokens.colors.textPrimary }}>
                    Course Content
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.textSecondary }}>
                    {modules.length} sections • {modules.reduce((acc, m) => acc + m.lectureCount, 0)} lectures
                </Typography>
            </Box>

            {modules.map((module, idx) => (
                <Accordion 
                    key={idx} 
                    disableGutters 
                    elevation={0} 
                    sx={{ 
                        border: `1px solid ${designTokens.colors.border}`,
                        mb: -1, // collapse borders
                        '&:first-of-type': { borderTopLeftRadius: '8px', borderTopRightRadius: '8px' },
                        '&:last-of-type': { borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', mb: 0 },
                        '&:before': { display: 'none' }, // remove default divider
                        bgcolor: '#F8FAFC'
                    }}
                >
                    <AccordionSummary 
                        expandIcon={<ExpandMoreIcon sx={{ color: designTokens.colors.textPrimary }} />}
                        sx={{ px: 3, py: 1 }}
                    >
                        <Stack direction="row" justifyContent="space-between" sx={{ width: '100%', pr: 2 }} alignItems="center">
                            <Typography sx={{ fontWeight: 700, color: designTokens.colors.textPrimary }}>
                                {module.title}
                            </Typography>
                            <Typography sx={{ color: designTokens.colors.textSecondary, fontSize: '0.85rem' }}>
                                {module.lectureCount} lectures • {module.duration}
                            </Typography>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0, bgcolor: '#ffffff' }}>
                        {module.lessons.map((lesson) => (
                            <Box 
                                key={lesson.id}
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    px: 3, 
                                    py: 2, 
                                    borderBottom: `1px solid ${designTokens.colors.border}`,
                                    '&:last-child': { borderBottom: 'none' }
                                }}
                            >
                                <Stack direction="row" spacing={2} alignItems="center">
                                    {lesson.type === 'video' ? (
                                        <PlayIcon sx={{ color: designTokens.colors.textSecondary, fontSize: 20 }} />
                                    ) : (
                                        <FileIcon sx={{ color: designTokens.colors.textSecondary, fontSize: 20 }} />
                                    )}
                                    <Typography variant="body2" sx={{ color: designTokens.colors.textPrimary, fontWeight: 500 }}>
                                        {lesson.title}
                                    </Typography>
                                </Stack>
                                <Typography variant="caption" sx={{ color: designTokens.colors.textSecondary }}>
                                    {lesson.meta}
                                </Typography>
                            </Box>
                        ))}
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default CourseContentAccordion;
