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

  getVideoUrl: async (mediaId: number): Promise<{ hls_url: string; stream_url: string; status: string; media_id: number; public_id: string }> => {
    const response = await api.get(`/media/${mediaId}/share-url`);
    return response.data;
  },

  getLessonSlides: async (lessonId: number): Promise<any[]> => {
    const response = await api.get(`/content/lesson/${lessonId}/slides`);
    return response.data;
  },

  getCodingExercise: async (lessonId: number): Promise<any> => {
    const response = await api.get(`/content/lesson/${lessonId}/coding`);
    return response.data;
  },

  submitCode: async (exerciseId: number, code: string): Promise<any> => {
    const response = await api.post(`/content/coding/${exerciseId}/submit`, { code });
    return response.data;
  },

  getVideoMarkers: async (lessonId: number): Promise<any[]> => {
    const response = await api.get(`/content/lesson/${lessonId}/markers`);
    return response.data;
  },

  getDiscussions: async (lessonId: number): Promise<any[]> => {
    const response = await api.get(`/content/lesson/${lessonId}/discussions`);
    return response.data;
  },

  postDiscussion: async (lessonId: number, body: string, parentId?: number): Promise<any> => {
    const response = await api.post(`/content/lesson/${lessonId}/discussions`, { body, parent_id: parentId });
    return response.data;
  },
};

export default contentService;
export * from '../models/content'; // Re-export for convenience
