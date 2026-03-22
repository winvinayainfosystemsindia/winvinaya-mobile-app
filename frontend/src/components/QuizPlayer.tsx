import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Replay,
  List as ListIcon,
} from '@mui/icons-material';
import contentService, { QuizQuestionType, type Quiz, type QuizAttempt } from '../services/contentService';
import MCQQuestion from './quiz/MCQQuestion';
import TrueFalseQuestion from './quiz/TrueFalseQuestion';
import MatchingQuestion from './quiz/MatchingQuestion';
import QuestionReview from './quiz/QuestionReview';

interface QuizPlayerProps {
  quizId: number;
  onComplete?: (attempt: QuizAttempt) => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ quizId, onComplete }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(-1); // -1: Welcome, 0..N-1: Questions, N: Results
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const data = await contentService.getQuiz(quizId);
        setQuiz(data);
      } catch (err) {
        setError('Failed to load quiz content.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizData();
  }, [quizId]);

  const handleStart = () => setCurrentStep(0);

  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (quiz && currentStep < quiz.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const result = await contentService.submitQuiz(quizId, answers);
      setAttempt(result);
      setCurrentStep(quiz?.questions.length || 0);
      if (onComplete) onComplete(result);
    } catch (err) {
      setError('Failed to submit quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setAttempt(null);
    setCurrentStep(-1);
    setShowReview(false);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!quiz) return <Alert severity="warning">Quiz not found</Alert>;

  // Welcome Screen
  if (currentStep === -1) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>{quiz.title}</Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>{quiz.description || 'Test your knowledge.'}</Typography>
        <Divider sx={{ mb: 4 }} />
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Grid size={{ xs: 6, md: 3 }}><Typography variant="h6">{quiz.questions.length}</Typography><Typography variant="caption" color="text.secondary">Questions</Typography></Grid>
          <Grid size={{ xs: 6, md: 3 }}><Typography variant="h6">{quiz.pass_score}%</Typography><Typography variant="caption" color="text.secondary">Pass Score</Typography></Grid>
          <Grid size={{ xs: 6, md: 3 }}><Typography variant="h6">{quiz.max_attempts}</Typography><Typography variant="caption" color="text.secondary">Attempts</Typography></Grid>
        </Grid>
        <Button variant="contained" size="large" onClick={handleStart} sx={{ px: 6, py: 1.5, borderRadius: 50 }}>Start Quiz</Button>
      </Paper>
    );
  }

  // Results Screen
  if (currentStep === quiz.questions.length) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
        {attempt?.passed ? <CheckCircle sx={{ fontSize: 100, color: 'success.main', mb: 2 }} /> : <Cancel sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />}
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>{attempt?.passed ? 'Congratulations!' : 'Keep Practicing!'}</Typography>
        <Typography variant="h5" color={attempt?.passed ? 'success.main' : 'error.main'} sx={{ mb: 2 }}>Your Score: {Math.round(attempt?.score || 0)}%</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="outlined" startIcon={<Replay />} onClick={handleRetry} disabled={quiz.max_attempts <= (attempt?.attempt_number || 0)}>Retry</Button>
          <Button variant="contained" startIcon={<ListIcon />} onClick={() => setShowReview(!showReview)}>{showReview ? 'Hide Review' : 'Review Answers'}</Button>
        </Box>
        {showReview && <QuestionReview questions={quiz.questions} userAnswers={answers} />}
      </Paper>
    );
  }

  // Active Question View
  const question = quiz.questions[currentStep];

  return (
    <Paper sx={{ p: 4, borderRadius: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2" color="text.secondary">Question {currentStep + 1} of {quiz.questions.length}</Typography>
        <Typography variant="subtitle2" color="primary.main">Points: {question.points}</Typography>
      </Box>
      <Stepper activeStep={currentStep} sx={{ mb: 4 }} alternativeLabel>
        {quiz.questions.map((_, index) => <Step key={index}><StepLabel /></Step>)}
      </Stepper>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>{question.question_text}</Typography>
        {question.question_type === QuizQuestionType.mcq && <MCQQuestion question={question} value={answers[question.id]} onChange={(val) => handleAnswerChange(question.id, val)} />}
        {question.question_type === QuizQuestionType.true_false && <TrueFalseQuestion question={question} value={answers[question.id]} onChange={(val) => handleAnswerChange(question.id, val)} />}
        {question.question_type === QuizQuestionType.match_the_following && <MatchingQuestion question={question} value={answers[question.id]} onChange={(val) => handleAnswerChange(question.id, val)} />}
      </Box>

      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" size="large" onClick={handleNext} disabled={!answers[question.id] || isSubmitting} sx={{ minWidth: 150 }}>
          {isSubmitting ? <CircularProgress size={24} /> : (currentStep === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question')}
        </Button>
      </Box>
    </Paper>
  );
};

export default QuizPlayer;
