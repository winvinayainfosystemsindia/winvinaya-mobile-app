import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

/**
 * PublicRoute component - redirects to home if user is already authenticated.
 * Use this for pages like Login and Register.
 */
const PublicRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    // Optionally return a loading spinner here
    return null;
  }

  if (isAuthenticated) {
    // If user is already logged in, redirect them to the home page
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
