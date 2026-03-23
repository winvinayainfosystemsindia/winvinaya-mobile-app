import React, { useState } from 'react';
import { Box, Typography, Button, Collapse } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { designTokens } from '../../theme/designTokens';

interface CourseDescriptionProps {
    description: string;
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({ description }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: designTokens.colors.textPrimary }}>
                Description
            </Typography>
            
            <Box sx={{ position: 'relative' }}>
                <Collapse in={expanded} collapsedSize={180}>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: 'text.secondary', 
                            lineHeight: 1.8,
                            whiteSpace: 'pre-line' 
                        }}
                    >
                        {description}
                    </Typography>
                </Collapse>
                
                {!expanded && (
                    <Box sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '60px', 
                        background: 'linear-gradient(transparent, #ffffff)' 
                    }} />
                )}
            </Box>

            <Button
                onClick={() => setExpanded(!expanded)}
                endIcon={expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                sx={{ 
                    mt: 2, 
                    fontWeight: 700, 
                    textTransform: 'none', 
                    color: designTokens.colors.primary,
                    p: 0,
                    '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                }}
            >
                {expanded ? 'Show less' : 'Show more'}
            </Button>
        </Box>
    );
};

export default CourseDescription;
