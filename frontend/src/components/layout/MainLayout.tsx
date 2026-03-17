import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout: React.FC = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const [mobileOpen, setMobileOpen] = useState(false);
	const { user, isAuthenticated } = useAppSelector((state) => state.auth);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handleLogout = () => {
		dispatch(logoutUser());
		navigate('/login');
	};

	return (
		<Box sx={{ display: 'flex', bgcolor: '#ffffff' }}>
			<Navbar 
				user={user}
				isAuthenticated={isAuthenticated}
				isMobile={isMobile}
				onDrawerToggle={handleDrawerToggle}
				onLogout={handleLogout}
			/>

			<Sidebar 
				mobileOpen={mobileOpen}
				onDrawerToggle={handleDrawerToggle}
				isMobile={isMobile}
			/>

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					minHeight: '100vh',
					pt: '72px',
					bgcolor: '#ffffff'
				}}
			>
				<Outlet />
			</Box>
		</Box>
	);
};

export default MainLayout;
