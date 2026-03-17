import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import Register from '../pages/Register';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

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
					{/* Add placeholders for other routes */}
					<Route path="/courses" element={<Navigate to="/" replace />} />
					<Route path="/candidates" element={<Navigate to="/dashboard" replace />} />
					<Route path="/training" element={<Navigate to="/dashboard" replace />} />
					<Route path="/allocations" element={<Navigate to="/dashboard" replace />} />
					<Route path="/users" element={<Navigate to="/dashboard" replace />} />
					<Route path="/settings" element={<Navigate to="/dashboard" replace />} />
				</Route>
			</Route>

			{/* Catch-all */}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
};

export default AppRouter;
