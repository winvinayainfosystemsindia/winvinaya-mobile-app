import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

interface RoleRouteProps {
  allowedRoles: string[];
}

const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
