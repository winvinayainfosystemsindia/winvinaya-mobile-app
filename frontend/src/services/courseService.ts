import api from './api';

export interface Lesson {
  id?: number;
  title: string;
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
};
