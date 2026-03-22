import api from './api';
import type { Course, Module, Lesson } from '../models/course';

export const courseService = {
  createCourse: async (courseData: Partial<Course>): Promise<Course> => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  addModule: async (courseId: number, moduleData: { title: string; order: number }): Promise<Module> => {
    const response = await api.post(`/courses/${courseId}/modules`, moduleData);
    return response.data;
  },

  addLesson: async (moduleId: number, lessonData: Partial<Lesson>): Promise<Lesson> => {
    const response = await api.post(`/courses/modules/${moduleId}/lessons`, {
      ...lessonData,
      module_id: moduleId,
    });
    return response.data;
  },

  getCourseStructure: async (courseId: number): Promise<Course> => {
    const response = await api.get(`/courses/${courseId}/structure`);
    return response.data;
  },

  getCourse: async (courseId: number): Promise<Course> => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  getCourses: async (): Promise<Course[]> => {
    const response = await api.get('/courses');
    return response.data;
  },

  updateCourse: async (courseId: number, courseData: Partial<Course>): Promise<Course> => {
    const response = await api.patch(`/courses/${courseId}`, courseData);
    return response.data;
  },

  updateModule: async (moduleId: number, moduleData: Partial<Module>): Promise<Module> => {
    const response = await api.patch(`/courses/modules/${moduleId}`, moduleData);
    return response.data;
  },

  updateLesson: async (lessonId: number, lessonData: Partial<Lesson>): Promise<Lesson> => {
    const response = await api.patch(`/courses/lessons/${lessonId}`, lessonData);
    return response.data;
  },

  uploadVideo: async (
    courseId: number,
    moduleId: number,
    lessonId: number,
    file: File,
    onProgress?: (progress: number) => void
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('course_id', courseId.toString());
    formData.append('module_id', moduleId.toString());
    formData.append('lesson_id', lessonId.toString());

    const response = await api.post('/media/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  getVideoStreamUrl: async (mediaId: number): Promise<{ stream_url: string; status: string }> => {
    const response = await api.get(`/media/${mediaId}/share-url`);
    return response.data;
  },
};

export default courseService;
export * from '../models/course';
