import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import type { QuizQuestion } from '../../models/content';

interface QuestionReviewProps {
  questions: QuizQuestion[];
  userAnswers: Record<string, any>;
}

const QuestionReview: React.FC<QuestionReviewProps> = ({ questions, userAnswers }) => {
  return (
    <Box sx={{ mt: 6, textAlign: 'left' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Question Review
      </Typography>
      {questions.map((q, idx) => {
        const userAnswer = userAnswers[q.id];
        // For matching questions, we might need a more complex check, but for now:
        const isCorrect = String(userAnswer).toLowerCase() === String(q.correct_answer).toLowerCase();
        
        return (
          <Card key={q.id} sx={{ mb: 3, borderLeft: `6px solid ${isCorrect ? '#4caf50' : '#f44336'}` }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {idx + 1}. {q.question_text}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Your Answer: <strong>{typeof userAnswer === 'object' ? JSON.stringify(userAnswer) : (userAnswer || 'No Answer')}</strong>
              </Typography>
              {!isCorrect && q.question_type !== 'match_the_following' && (
                <Typography variant="body2" color="success.main" sx={{ mt: 0.5 }}>
                  Correct Answer: <strong>{q.correct_answer}</strong>
                </Typography>
              )}
              {q.explanation && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" display="block">Explanation:</Typography>
                  <Typography variant="body2">{q.explanation}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default QuestionReview;
