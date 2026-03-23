import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';

// Components
import Navbar from '../components/layout/Navbar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';

// Catalog
import CourseCatalog from '../pages/catalog/CourseCatalog';

// Common
import NotFound from '../pages/common/NotFound';
import Maintenance from '../pages/common/Maintenance';

// Guards
import PublicRoute from './guards/PublicRoute';
// import ProtectedRoute from './guards/ProtectedRoute';

const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar 
        user={user} 
        isAuthenticated={isAuthenticated} 
        isMobile={isMobile} 
        onDrawerToggle={handleDrawerToggle}
        onLogout={handleLogout}
      />
      <Box component="main" sx={{ flexGrow: 1, pt: '72px' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Example of a Protected Route (uncomment when needed):
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route> 
      */}

      <Route path="/maintenance" element={<Maintenance />} />
      
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<CourseCatalog />} />
        <Route path="/page-not-found" element={<NotFound />} />
      </Route>

      <Route path="*" element={<Navigate to="/page-not-found" replace />} />
    </Routes>
  );
};

export default AppRouter;
