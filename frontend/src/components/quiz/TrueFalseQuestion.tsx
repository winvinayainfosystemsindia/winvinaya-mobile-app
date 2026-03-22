import React from 'react';
import { FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import type { QuizQuestion } from '../../models/content';

interface TrueFalseQuestionProps {
  question: QuizQuestion;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({ value, onChange, disabled }) => {
  return (
    <FormControl component="fieldset" disabled={disabled}>
      <RadioGroup
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <FormControlLabel value="True" control={<Radio />} label="True" />
        <FormControlLabel value="False" control={<Radio />} label="False" />
      </RadioGroup>
    </FormControl>
  );
};

export default TrueFalseQuestion;
