import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import enrollmentReducer from './slices/enrollmentSlice';
import progressReducer from './slices/progressSlice';
import userReducer from './slices/userSlice';
import groupReducer from './slices/groupSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		ui: uiReducer,
		courses: courseReducer,
		enrollments: enrollmentReducer,
		progress: progressReducer,
		users: userReducer,
		groups: groupReducer,
		notifications: notificationReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
