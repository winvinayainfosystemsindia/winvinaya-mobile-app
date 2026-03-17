import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

const AppRouter: React.FC = () => {
	return (
		<Routes>
			{/* Public Routes */}
			<Route path="/login" element={<Login />} />

			{/* Protected Routes */}
			<Route element={<ProtectedRoute />}>
				<Route element={<MainLayout />}>
					<Route path="/dashboard" element={<Dashboard />} />
					{/* Add placeholders for other routes referenced in useSearchActions */}
					<Route path="/candidates" element={<Navigate to="/dashboard" replace />} />
					<Route path="/training" element={<Navigate to="/dashboard" replace />} />
					<Route path="/allocations" element={<Navigate to="/dashboard" replace />} />
					<Route path="/users" element={<Navigate to="/dashboard" replace />} />
					<Route path="/settings" element={<Navigate to="/dashboard" replace />} />
				</Route>
			</Route>

			{/* Catch-all */}
			<Route path="/" element={<Navigate to="/dashboard" replace />} />
			<Route path="*" element={<Navigate to="/dashboard" replace />} />
		</Routes>
	);
};

export default AppRouter;
