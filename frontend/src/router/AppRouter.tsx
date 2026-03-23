import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import Register from '../pages/Register';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import AdminCourseCreate from '../pages/AdminCourseCreate';
import AdminCourseEdit from '../pages/AdminCourseEdit';
import CourseDetail from '../pages/CourseDetail';
import CoursePlayer from '../pages/CoursePlayer';
import AdminGroups from '../pages/admin/AdminGroups';
import AdminEnrollments from '../pages/admin/AdminEnrollments';

const AppRouter: React.FC = () => {
	return (
		<Routes>
			{/* Layout wraps everything to provide global header */}
			{/* Auth Routes (No Navbar) */}
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />

			{/* Layout wraps everything else to provide global header */}
			<Route element={<MainLayout />}>
				{/* Public Routes */}
				<Route path="/" element={<Home />} />

				{/* Protected Routes */}
				<Route element={<ProtectedRoute />}>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/courses/:courseId" element={<CourseDetail />} />
					<Route path="/courses/:courseId/learn" element={<CoursePlayer />} />
					<Route path="/candidates" element={<Navigate to="/dashboard" replace />} />
					<Route path="/training" element={<Navigate to="/dashboard" replace />} />
					<Route path="/allocations" element={<Navigate to="/dashboard" replace />} />
					<Route path="/users" element={<Navigate to="/dashboard" replace />} />
					<Route path="/settings" element={<Navigate to="/dashboard" replace />} />
					
					{/* Admin Routes */}
					<Route path="/admin/courses/create" element={<AdminCourseCreate />} />
					<Route path="/admin/courses/:courseId/edit" element={<AdminCourseEdit />} />
					<Route path="/admin/groups" element={<AdminGroups />} />
					<Route path="/admin/enrollments" element={<AdminEnrollments />} />
				</Route>
			</Route>

			{/* Catch-all */}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
};

export default AppRouter;
