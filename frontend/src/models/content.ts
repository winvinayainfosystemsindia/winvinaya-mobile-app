export const QuizQuestionType = {
  mcq: 'mcq',
  true_false: 'true_false',
  match_the_following: 'match_the_following',
  short_answer: 'short_answer',
  comprehensive: 'comprehensive',
} as const;

export type QuizQuestionType = (typeof QuizQuestionType)[keyof typeof QuizQuestionType];

export interface MatchingPair {
  id: number;
  source_text: string;
  target_text: string;
  source_image_id?: number;
  target_image_id?: number;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question_text: string;
  question_type: QuizQuestionType;
  options?: { key: string; text: string }[];
  correct_answer: string;
  explanation?: string;
  image_id?: number;
  order: number;
  points: number;
  matching_pairs: MatchingPair[];
}

export interface Quiz {
  id: number;
  lesson_id: number;
  title: string;
  description?: string;
  pass_score: number;
  time_limit_minutes?: number;
  max_attempts: number;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: number;
  quiz_id: number;
  user_id: number;
  answers: Record<string, any>;
  score?: number;
  passed?: boolean;
  attempt_number: number;
  started_at: string;
  submitted_at?: string;
}
