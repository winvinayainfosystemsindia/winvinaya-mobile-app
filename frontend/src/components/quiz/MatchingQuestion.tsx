import React from 'react';
import { Box, Typography, Grid, Paper, Select, MenuItem } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import type { QuizQuestion } from '../../models/content';

interface MatchingQuestionProps {
  question: QuizQuestion;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  disabled?: boolean;
}

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({ question, value = {}, onChange, disabled }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Match the items in the left column with the correct options on the right.
      </Typography>
      {question.matching_pairs.map((pair) => (
        <Grid container spacing={2} key={pair.id} sx={{ mb: 2, alignItems: 'center' }}>
          <Grid size={{ xs: 5 }}>
            <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#f9f9f9' }}>
              {pair.source_text}
            </Paper>
          </Grid>
          <Grid size={{ xs: 1 }} sx={{ textAlign: 'center' }}>
            <ArrowForward color="disabled" />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Select
              fullWidth
              size="small"
              value={value[pair.source_text] || ''}
              onChange={(e) => {
                const newValue = { ...value };
                newValue[pair.source_text] = e.target.value as string;
                onChange(newValue);
              }}
              displayEmpty
              disabled={disabled}
            >
              <MenuItem value="" disabled>Select match</MenuItem>
              {question.matching_pairs.map(p => (
                <MenuItem key={p.id} value={p.target_text}>{p.target_text}</MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default MatchingQuestion;
