import api from './api';
import { type Enrollment } from '../models/enrollment';

export const enrollmentService = {
  getMyEnrollments: async (skip = 0, limit = 50): Promise<Enrollment[]> => {
    const response = await api.get('/enrollments/my', {
      params: { skip, limit }
    });
    return response.data;
  },

  enroll: async (courseId: number): Promise<Enrollment> => {
    const response = await api.post('/enrollments/', null, {
      params: { course_id: courseId }
    });
    return response.data;
  },

  unenroll: async (courseId: number): Promise<void> => {
    await api.delete(`/enrollments/${courseId}`);
  }
};

export default enrollmentService;
