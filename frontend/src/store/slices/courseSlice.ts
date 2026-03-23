import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import courseService from '../../services/courseService';
import { type Course } from '../../models/course';

interface CourseState {
  courses: Course[];
  activeCourse: Course | null;
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  activeCourse: null,
  loading: false,
  error: null,
};

/**
 * Fetch all available published courses.
 */
export const fetchCourses = createAsyncThunk(
  'courses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await courseService.getCourses();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch courses');
    }
  }
);

/**
 * Fetch a single course by its public_id
 */
export const fetchCourseById = createAsyncThunk(
  'courses/fetchById',
  async (publicId: string, { rejectWithValue }) => {
    try {
      const data = await courseService.getCourseByPublicId(publicId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch course detail');
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCourseError: (state) => {
      state.error = null;
    },
    clearActiveCourse: (state) => {
      state.activeCourse = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch all courses
    builder.addCase(fetchCourses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
      state.loading = false;
      state.courses = action.payload;
    });
    builder.addCase(fetchCourses.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch course by id
    builder.addCase(fetchCourseById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCourseById.fulfilled, (state, action: PayloadAction<Course>) => {
      state.loading = false;
      state.activeCourse = action.payload;
    });
    builder.addCase(fetchCourseById.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.activeCourse = null;
    });
  },
});

export const { clearCourseError, clearActiveCourse } = courseSlice.actions;
export default courseSlice.reducer;
