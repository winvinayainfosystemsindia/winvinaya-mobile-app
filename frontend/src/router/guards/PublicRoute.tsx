import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

/**
 * PublicRoute component - redirects to home if user is already authenticated.
 * Use this for pages like Login and Register.
 */
const PublicRoute: React.FC = () => {
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect only if specifically needed, but for now we follow user's request
    // to allow staying on these pages even if authenticated.
    /*
    if (!loading && isAuthenticated) {
      navigate('/', { replace: true });
    }
    */
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return null;
  }

  return <Outlet />;
};

export default PublicRoute;
