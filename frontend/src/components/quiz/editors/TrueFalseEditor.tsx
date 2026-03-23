import React from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import type { QuizQuestion } from '../../../models/content';

interface TrueFalseEditorProps {
  question: QuizQuestion;
  onChange: (updatedQuestion: QuizQuestion) => void;
}

import { designTokens } from '../../../theme/designTokens';

const TrueFalseEditor: React.FC<TrueFalseEditorProps> = ({ question, onChange }) => {
  return (
    <Box sx={{ p: 2, bgcolor: designTokens.colors.surface, border: `1px solid ${designTokens.colors.border}`, borderRadius: 2 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Correct Answer</Typography>
      <RadioGroup
        row
        value={question.correct_answer || 'true'}
        onChange={e => onChange({ ...question, correct_answer: e.target.value })}
      >
        <FormControlLabel value="true" control={<Radio color="primary" />} label="True" />
        <FormControlLabel value="false" control={<Radio color="primary" />} label="False" />
      </RadioGroup>
    </Box>
  );
};

export default TrueFalseEditor;
