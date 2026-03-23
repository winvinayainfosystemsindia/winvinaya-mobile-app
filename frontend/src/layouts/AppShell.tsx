import React, { useState } from 'react';
import {
  Box,
  Drawer,
  CssBaseline,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Navbar from '../components/layout/Navbar';
import SideNav from './SideNav';
import { designTokens } from '../theme/designTokens';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { Outlet, useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = designTokens.spacing.sidebarWidth;
const DRAWER_COLLAPSED_WIDTH = designTokens.spacing.sidebarCollapsedWidth;
const STORAGE_KEY = 'sidebar_collapsed';

const AppShell: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const effectiveWidth = isMobile ? 0 : collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const handleCollapseToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />

      {/* Top Navbar */}
      <Navbar 
        user={user} 
        isAuthenticated={isAuthenticated} 
        isMobile={isMobile}
        onDrawerToggle={handleDrawerToggle}
        onLogout={handleLogout}
      />

      {/* Side Navigation — Mobile (temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <SideNav onClose={handleDrawerToggle} />
      </Drawer>

      {/* Side Navigation — Desktop (permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH,
          flexShrink: 0,
          transition: 'width 0.2s ease',
          '& .MuiDrawer-paper': {
            width: collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH,
            boxSizing: 'border-box',
            transition: 'width 0.2s ease',
            overflowX: 'hidden',
          },
        }}
        open
      >
        <SideNav collapsed={collapsed} />

        {/* Collapse toggle button */}
        <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement="right">
          <IconButton
            onClick={handleCollapseToggle}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 56,
              right: collapsed ? '50%' : 12,
              transform: collapsed ? 'translateX(50%)' : 'none',
              bgcolor: designTokens.colors.surface,
              border: `1px solid ${designTokens.colors.border}`,
              boxShadow: designTokens.shadows.card,
              width: 28,
              height: 28,
              transition: 'right 0.2s, transform 0.2s',
              '&:hover': {
                bgcolor: designTokens.colors.primaryLight,
                borderColor: designTokens.colors.primary,
              },
            }}
          >
            {collapsed ? (
              <ChevronRight sx={{ fontSize: 16 }} />
            ) : (
              <ChevronLeft sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Tooltip>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: `calc(100% - ${effectiveWidth}px)` },
          mt: `${designTokens.spacing.topbarHeight}px`,
          transition: 'width 0.2s ease, margin 0.2s ease',
          minWidth: 0, // prevent flex overflow
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppShell;
