import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  items: any[];
  unreadCount: number;
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<any>) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAllRead: (state) => {
      state.unreadCount = 0;
    }
  },
});

export const { addNotification, markAllRead } = notificationSlice.actions;
export default notificationSlice.reducer;
