import React from 'react';
import { FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import type { QuizQuestion } from '../../models/content';

interface MCQQuestionProps {
  question: QuizQuestion;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MCQQuestion: React.FC<MCQQuestionProps> = ({ question, value, onChange, disabled }) => {
  return (
    <FormControl component="fieldset" disabled={disabled}>
      <RadioGroup
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        {(question.options || []).map((opt) => (
          <FormControlLabel 
            key={opt.key} 
            value={opt.key} 
            control={<Radio />} 
            label={opt.text} 
            sx={{ mb: 1 }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default MCQQuestion;
