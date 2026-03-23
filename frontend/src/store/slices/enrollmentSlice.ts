import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import enrollmentService from '../../services/enrollmentService';
import api from '../../services/api';
import { type Enrollment } from '../../models/enrollment';

interface EnrollmentState {
  myEnrollments: Enrollment[];
  allEnrollments: Enrollment[]; // For admin
  loading: boolean;
  error: string | null;
}

const initialState: EnrollmentState = {
  myEnrollments: [],
  allEnrollments: [],
  loading: false,
  error: null,
};

/**
 * Fetch current user's enrollments
 */
export const fetchMyEnrollments = createAsyncThunk(
  'enrollments/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const data = await enrollmentService.getMyEnrollments();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch enrollments');
    }
  }
);

/**
 * Fetch all global enrollments (Admin only)
 */
export const fetchAllEnrollments = createAsyncThunk(
  'enrollments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // Assuming api wrapper for now to decouple from enrollmentService additions
      const response = await api.get('/enrollments/admin/all');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch global enrollments');
    }
  }
);

/**
 * Enroll in a course unconditionally
 */
export const enrollInCourse = createAsyncThunk(
  'enrollments/enroll',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const data = await enrollmentService.enroll(courseId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to enroll');
    }
  }
);

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    clearEnrollmentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // My Enrollments
    builder.addCase(fetchMyEnrollments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMyEnrollments.fulfilled, (state, action: PayloadAction<Enrollment[]>) => {
      state.loading = false;
      state.myEnrollments = action.payload;
    });
    builder.addCase(fetchMyEnrollments.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // All Enrollments (Admin)
    builder.addCase(fetchAllEnrollments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllEnrollments.fulfilled, (state, action: PayloadAction<Enrollment[]>) => {
      state.loading = false;
      state.allEnrollments = action.payload;
    });
    builder.addCase(fetchAllEnrollments.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Enroll in Course
    builder.addCase(enrollInCourse.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(enrollInCourse.fulfilled, (state, action: PayloadAction<Enrollment>) => {
      state.loading = false;
      const exists = state.myEnrollments.find(e => e.id === action.payload.id);
      if (!exists) {
        state.myEnrollments.push(action.payload);
      }
    });
    builder.addCase(enrollInCourse.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearEnrollmentError } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
