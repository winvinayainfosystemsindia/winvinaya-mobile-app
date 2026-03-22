import api from './api';
import type { CourseProgress } from '../models/progress';

export const progressService = {
  getCourseProgress: async (courseId: number): Promise<CourseProgress> => {
    const response = await api.get(`/progress/course/${courseId}`);
    return response.data;
  },
  markLessonComplete: async (lessonId: number, score?: number): Promise<void> => {
    await api.post(`/progress/lesson/${lessonId}/complete`, { score });
  },
  updateVideoPosition: async (lessonId: number, position: number): Promise<void> => {
    await api.patch(`/progress/lesson/${lessonId}/position`, { position });
  }
};

export default progressService;
