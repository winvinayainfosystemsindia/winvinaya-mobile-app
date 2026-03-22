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

  saveQuiz: async (lessonId: number, quizData: Partial<Quiz>): Promise<Quiz> => {
    // Check if quiz exists for lesson
    try {
      const existing = await api.get(`/content/lesson/${lessonId}`);
      if (existing.data) {
        // Update (simplified: ideally we'd have a PATCH /content/{id})
        const response = await api.patch(`/content/${existing.data.id}`, quizData);
        return response.data;
      }
    } catch (err) {
      // Create new
      const response = await api.post('/content/', { ...quizData, lesson_id: lessonId });
      return response.data;
    }
    return null as any;
  },
};

export default contentService;
export * from '../models/content'; // Re-export for convenience
