export interface Lesson {
  id?: number;
  title: string;
  description?: string;
  content_type: 'video' | 'document' | 'text' | 'quiz' | 'assignment';
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
