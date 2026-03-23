import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

/**
 * ProtectedRoute component - redirects to login if user is not authenticated.
 * Stores the location the user was trying to access to redirect back after login.
 */
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    // Optionally return a loading spinner here
    return null;
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated users to login page, but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
