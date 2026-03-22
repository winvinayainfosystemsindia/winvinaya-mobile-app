import api from './api';
import type { Quiz, QuizAttempt } from '../models/content';

const contentService = {
  getQuiz: async (quizId: number): Promise<Quiz> => {
    const response = await api.get(`/content/${quizId}`);
    return response.data;
  },

  getQuizByLesson: async (lessonId: number): Promise<Quiz> => {
    const response = await api.get(`/content/lesson/${lessonId}`);
    return response.data;
  },

  submitQuiz: async (quizId: number, answers: Record<string, any>): Promise<QuizAttempt> => {
    const response = await api.post(`/content/${quizId}/submit`, {
      quiz_id: quizId,
      answers,
    });
    return response.data;
  },

  getAttempts: async (quizId: number): Promise<QuizAttempt[]> => {
    const response = await api.get(`/content/${quizId}/attempts`);
    return response.data;
  },
};

export default contentService;
export * from '../models/content'; // Re-export for convenience
