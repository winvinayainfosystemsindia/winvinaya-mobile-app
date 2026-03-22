import api from './api';

export interface Lesson {
  id?: number;
  title: string;
  description?: string;
  content_type: string;
  media_file_id?: number;
  text_content?: string;
  content_url?: string;
  order: number;
  module_id?: number;
}

export interface Module {
  id?: number;
  title: string;
  order: number;
  course_id?: number;
  lessons: Lesson[];
}

export interface Course {
  id?: number;
  title: string;
  description?: string;
  short_description?: string;
  category?: string;
  level: string;
  language: string;
  tags?: string;
  is_free: boolean;
  price: number;
  instructor_id?: number;
  status?: string;
  thumbnail_url?: string;
  modules: Module[];
}

export const courseService = {
  createCourse: async (courseData: Partial<Course>) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  addModule: async (courseId: number, moduleData: { title: string; order: number }) => {
    const response = await api.post(`/courses/${courseId}/modules`, moduleData);
    return response.data;
  },

  addLesson: async (moduleId: number, lessonData: Partial<Lesson>) => {
    const response = await api.post(`/courses/modules/${moduleId}/lessons`, {
      ...lessonData,
      module_id: moduleId,
    });
    return response.data;
  },

  getCourseStructure: async (courseId: number) => {
    const response = await api.get(`/courses/${courseId}/structure`);
    return response.data;
  },

  getCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  updateCourse: async (courseId: number, courseData: Partial<Course>) => {
    const response = await api.patch(`/courses/${courseId}`, courseData);
    return response.data;
  },

  updateModule: async (moduleId: number, moduleData: Partial<Module>) => {
    const response = await api.patch(`/courses/modules/${moduleId}`, moduleData);
    return response.data;
  },

  updateLesson: async (lessonId: number, lessonData: Partial<Lesson>) => {
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

  getVideoStreamUrl: async (mediaId: number) => {
    const response = await api.get(`/media/${mediaId}/share-url`);
    return response.data;
  },
};
