import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import progressService from '../../services/progressService';
import { type CourseProgressResponse, type LessonProgress } from '../../models/progress';

interface ProgressState {
  courseProgresses: Record<number, CourseProgressResponse>; // key is courseId
  loading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  courseProgresses: {},
  loading: false,
  error: null,
};

/**
 * Fetch progress for a single course
 */
export const fetchCourseProgress = createAsyncThunk(
  'progress/fetchCourseProgress',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const data = await progressService.getCourseProgress(courseId);
      return { courseId, data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch course progress');
    }
  }
);

/**
 * Update lesson progress
 */
export const updateLessonProgress = createAsyncThunk(
  'progress/updateLessonProgress',
  async ({ courseId, lessonId, payload }: { courseId: number, lessonId: number, payload: Partial<LessonProgress> }, { rejectWithValue }) => {
    try {
      const data = await progressService.updateLessonProgress(lessonId, payload);
      return { courseId, lessonId, data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update lesson progress');
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearProgressError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Course Progress
    builder.addCase(fetchCourseProgress.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCourseProgress.fulfilled, (state, action: PayloadAction<{ courseId: number, data: CourseProgressResponse }>) => {
      state.loading = false;
      state.courseProgresses[action.payload.courseId] = action.payload.data;
    });
    builder.addCase(fetchCourseProgress.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Lesson Progress
    builder.addCase(updateLessonProgress.pending, () => {
      // Don't show loading overlay for background silent updates
    });
    builder.addCase(updateLessonProgress.fulfilled, (state, action: PayloadAction<{ courseId: number, lessonId: number, data: LessonProgress }>) => {
      const { courseId, data } = action.payload;
      if (state.courseProgresses[courseId]) {
        // Find and replace the lesson progress in the array
        const progresses = state.courseProgresses[courseId].lesson_progress;
        const index = progresses.findIndex((p: LessonProgress) => p.lesson_id === data.lesson_id);
        if (index !== -1) {
          progresses[index] = data;
        } else {
          progresses.push(data);
        }
      }
    });
    builder.addCase(updateLessonProgress.rejected, (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    });
  },
});

export const { clearProgressError } = progressSlice.actions;
export default progressSlice.reducer;
