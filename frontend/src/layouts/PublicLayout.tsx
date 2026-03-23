import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery, Drawer } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import Sidebar from '../components/layout/Sidebar';

const PublicLayout: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

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
            <Sidebar 
                mobileOpen={drawerOpen} 
                onDrawerToggle={handleDrawerToggle} 
                isMobile={isMobile} 
            />
            <Box component="main" sx={{ flexGrow: 1, pt: '72px' }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default PublicLayout;
