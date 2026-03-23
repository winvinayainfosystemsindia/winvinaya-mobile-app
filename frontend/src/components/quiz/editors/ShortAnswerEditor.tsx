import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import type { QuizQuestion } from '../../../models/content';

interface ShortAnswerEditorProps {
  question: QuizQuestion;
  onChange: (updatedQuestion: QuizQuestion) => void;
}

const ShortAnswerEditor: React.FC<ShortAnswerEditorProps> = ({ question, onChange }) => {
  return (
    <Box sx={{ p: 2, bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Accepted Answer</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Provide the exact short phrase or word that should be considered correct.
      </Typography>
      <TextField 
        fullWidth 
        size="small"
        placeholder="e.g., Paris"
        value={question.correct_answer || ''}
        onChange={e => onChange({ ...question, correct_answer: e.target.value })}
      />
    </Box>
  );
};

export default ShortAnswerEditor;
