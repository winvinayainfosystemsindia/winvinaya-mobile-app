import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import adminService from '../../services/adminService';

// Assuming group interfaces are defined in a model or inferred
interface GroupState {
  groups: any[];
  loading: boolean;
  error: string | null;
}

const initialState: GroupState = {
  groups: [],
  loading: false,
  error: null,
};

export const fetchGroups = createAsyncThunk(
  'groups/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminService.getGroups();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch groups');
    }
  }
);

const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGroups.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchGroups.fulfilled, (state, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.groups = action.payload;
    });
    builder.addCase(fetchGroups.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default groupSlice.reducer;
