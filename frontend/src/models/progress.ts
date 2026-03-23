export const ProgressStatus = {
  not_started: 'not_started',
  in_progress: 'in_progress',
  completed: 'completed',
} as const;

export type ProgressStatus = (typeof ProgressStatus)[keyof typeof ProgressStatus];

export interface LessonProgress {
  id: number;
  lesson_id: number;
  user_id: number;
  status: ProgressStatus;
  video_position_seconds?: number;
  completed_at?: string;
}

export interface CourseProgress {
  id: number;
  course_id: number;
  user_id: number;
  status: ProgressStatus;
  progress_percent: number;
  lesson_progress: LessonProgress[];
}
