export interface Lesson {
  id?: number;
  public_id: string;
  title: string;
  description?: string;
  content_type: 'video' | 'document' | 'text' | 'quiz' | 'assignment' | 'ppt' | 'code' | 'interactive_video';
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
  public_id: string;
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
  expiry_days?: number;
  require_sequential?: boolean;
  passing_score?: number;
  rating_avg?: number;
  rating_count?: number;
  modules: Module[];
}
