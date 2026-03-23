import { type Course } from './course';

export type EnrollmentStatus = 'active' | 'completed' | 'dropped';

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  status: EnrollmentStatus | string;
  progress_percent: number;
  enrolled_at: string;
  completed_at?: string;
  course?: Course | any;
  user?: any;
  expiry_date?: string;
}
