import React from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Button, 
  Typography, 
  Radio, 
  FormControlLabel,
  RadioGroup
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { type QuizQuestion } from '../../../models/content';

interface MCQEditorProps {
  question: QuizQuestion;
  onChange: (updatedQuestion: QuizQuestion) => void;
}

const MCQEditor: React.FC<MCQEditorProps> = ({ question, onChange }) => {
  // Ensure options exist
  const options = question.options || [];

  const handleAddOption = () => {
    const nextKey = String.fromCharCode(65 + options.length); // A, B, C, D...
    const newOptions = [...options, { key: nextKey, text: '' }];
    onChange({ ...question, options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    // Re-key options to keep them A, B, C, D...
    const rekeyedOptions = newOptions.map((opt, i) => ({
      ...opt,
      key: String.fromCharCode(65 + i)
    }));
    onChange({ ...question, options: rekeyedOptions });
  };

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text };
    onChange({ ...question, options: newOptions });
  };

  const handleCorrectAnswerChange = (key: string) => {
    onChange({ ...question, correct_answer: key });
  };

  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: '#fff', borderRadius: 1, border: '1px solid #e0e0e0' }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mb: 2, display: 'block' }}>
        ANSWER CHOICES
      </Typography>
      
      <RadioGroup 
        value={question.correct_answer} 
        onChange={(e) => handleCorrectAnswerChange(e.target.value)}
      >
        {options.map((opt, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <FormControlLabel 
              value={opt.key} 
              control={<Radio size="small" />} 
              label="" 
              sx={{ mr: 0 }}
            />
            <TextField
              fullWidth
              size="small"
              label={`Option ${opt.key}`}
              value={opt.text}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder="Enter choice text..."
            />
            <IconButton 
              size="small" 
              color="error" 
              onClick={() => handleRemoveOption(index)}
              disabled={options.length <= 1}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </RadioGroup>

      <Button 
        size="small" 
        startIcon={<Add />} 
        onClick={handleAddOption}
        sx={{ mt: 1 }}
        disabled={options.length >= 26}
      >
        Add Choice
      </Button>

      {options.length === 0 && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          Please add at least one choice and select the correct answer.
        </Typography>
      )}
    </Box>
  );
};

export default MCQEditor;
