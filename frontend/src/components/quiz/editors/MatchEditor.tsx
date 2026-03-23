import React from 'react';
import { Box, Typography, TextField, IconButton, Button } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import type { QuizQuestion } from '../../../models/content';

interface MatchEditorProps {
  question: QuizQuestion;
  onChange: (updatedQuestion: QuizQuestion) => void;
}

import { designTokens } from '../../../theme/designTokens';

const MatchEditor: React.FC<MatchEditorProps> = ({ question, onChange }) => {
  // ... (logic remains same)
  const handleAddPair = () => {
    const pairs = [...(question.matching_pairs || []), { id: Date.now(), source_text: '', target_text: '' }];
    onChange({ ...question, matching_pairs: pairs });
  };

  const handleUpdatePair = (index: number, field: 'source_text' | 'target_text', value: string) => {
    const pairs = [...question.matching_pairs];
    pairs[index] = { ...pairs[index], [field]: value };
    onChange({ ...question, matching_pairs: pairs });
  };

  const handleDeletePair = (index: number) => {
    const pairs = [...question.matching_pairs];
    pairs.splice(index, 1);
    onChange({ ...question, matching_pairs: pairs });
  };

  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: designTokens.colors.surface, border: `1px solid ${designTokens.colors.border}`, borderRadius: 2 }}>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1, fontWeight: 600 }}>Matching Pairs</Typography>
      {question.matching_pairs?.map((p, pIdx) => (
        <Box key={pIdx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField 
            fullWidth placeholder="Source item (e.g., Apple)" size="small" 
            value={p.source_text}
            onChange={e => handleUpdatePair(pIdx, 'source_text', e.target.value)}
          />
          <TextField 
            fullWidth placeholder="Target item (e.g., Red)" size="small" 
            value={p.target_text}
            onChange={e => handleUpdatePair(pIdx, 'target_text', e.target.value)}
          />
          <IconButton size="small" onClick={() => handleDeletePair(pIdx)}>
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button size="small" startIcon={<Add />} onClick={handleAddPair}>Add Pair</Button>
    </Box>
  );
};

export default MatchEditor;
