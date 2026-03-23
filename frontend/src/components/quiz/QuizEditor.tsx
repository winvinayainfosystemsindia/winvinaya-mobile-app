import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Divider,
  IconButton,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { type Quiz, type QuizQuestion, QuizQuestionType } from '../../models/content';
import MCQEditor from './editors/MCQEditor';
import MatchEditor from './editors/MatchEditor';
import TrueFalseEditor from './editors/TrueFalseEditor';
import ShortAnswerEditor from './editors/ShortAnswerEditor';

interface QuizEditorProps {
  quiz: Quiz | null;
  loading: boolean;
  onChange: (quiz: Quiz) => void;
}

const QuizEditor: React.FC<QuizEditorProps> = ({ quiz, loading, onChange }) => {
  const handleAddQuestion = () => {
    if (!quiz) return;
    const newQuestion: QuizQuestion = {
      id: Date.now(),
      quiz_id: quiz.id,
      question_text: '',
      question_type: QuizQuestionType.mcq,
      correct_answer: '',
      order: quiz.questions.length,
      points: 1,
      matching_pairs: [],
      options: []
    };
    onChange({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };

  const updateQuestion = (index: number, updatedQ: QuizQuestion) => {
    if (!quiz) return;
    const qs = [...quiz.questions];
    qs[index] = updatedQ;
    onChange({ ...quiz, questions: qs });
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={24} /></Box>;
  if (!quiz) return null;

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>Quiz Configuration</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6 }}>
          <TextField 
            fullWidth type="number" label="Passing Score (%)" size="small"
            value={quiz.pass_score}
            onChange={e => onChange({...quiz, pass_score: parseInt(e.target.value) || 0})}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField 
            fullWidth type="number" label="Max Attempts" size="small"
            value={quiz.max_attempts}
            onChange={e => onChange({...quiz, max_attempts: parseInt(e.target.value) || 0})}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Questions ({quiz.questions.length})</Typography>
            <Button size="small" startIcon={<Add />} variant="outlined" onClick={handleAddQuestion}>Add Question</Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {quiz.questions.map((q, qIdx) => (
              <Paper key={qIdx} variant="outlined" sx={{ p: 2, position: 'relative', bgcolor: '#fafafa' }}>
                <IconButton 
                  size="small" sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={() => {
                    const qs = [...quiz.questions];
                    qs.splice(qIdx, 1);
                    onChange({...quiz, questions: qs});
                  }}
                >
                  <Delete fontSize="small" color="error" />
                </IconButton>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <TextField 
                      fullWidth label="Question Text" size="small"
                      value={q.question_text}
                      onChange={e => {
                        updateQuestion(qIdx, { ...q, question_text: e.target.value });
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField 
                      select fullWidth label="Type" size="small"
                      value={q.question_type}
                      onChange={e => {
                        updateQuestion(qIdx, { ...q, question_type: e.target.value as any });
                      }}
                    >
                      <MenuItem value={QuizQuestionType.mcq}>MCQ</MenuItem>
                      <MenuItem value={QuizQuestionType.true_false}>True / False</MenuItem>
                      <MenuItem value={QuizQuestionType.match_the_following}>Match the Following</MenuItem>
                      <MenuItem value={QuizQuestionType.short_answer}>Short Answer</MenuItem>
                    </TextField>
                  </Grid>
                  
                  {/* MCQ Choices Editor */}
                  {q.question_type === QuizQuestionType.mcq && (
                    <Grid size={{ xs: 12 }}>
                      <MCQEditor 
                        question={q} 
                        onChange={(updatedQ) => updateQuestion(qIdx, updatedQ)} 
                      />
                    </Grid>
                  )}

                  {q.question_type === QuizQuestionType.match_the_following && (
                    <Grid size={{ xs: 12 }}>
                      <MatchEditor 
                        question={q} 
                        onChange={(updatedQ) => updateQuestion(qIdx, updatedQ)} 
                      />
                    </Grid>
                  )}

                  {q.question_type === QuizQuestionType.true_false && (
                    <Grid size={{ xs: 12 }}>
                      <TrueFalseEditor 
                        question={q} 
                        onChange={(updatedQ) => updateQuestion(qIdx, updatedQ)} 
                      />
                    </Grid>
                  )}

                  {q.question_type === QuizQuestionType.short_answer && (
                    <Grid size={{ xs: 12 }}>
                      <ShortAnswerEditor 
                        question={q} 
                        onChange={(updatedQ) => updateQuestion(qIdx, updatedQ)} 
                      />
                    </Grid>
                  )}

                  <Grid size={{ xs: 12 }}>
                    <TextField 
                      fullWidth multiline rows={2} label="Explanation / Feedback" size="small"
                      value={q.explanation || ''}
                      onChange={e => {
                        updateQuestion(qIdx, { ...q, explanation: e.target.value });
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuizEditor;
