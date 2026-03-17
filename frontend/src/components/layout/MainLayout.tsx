import React, { useState } from 'react';
import {
	Box,
	Drawer,
	AppBar,
	Toolbar,
	List,
	Typography,
	Divider,
	IconButton,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Tooltip,
	Avatar,
	Menu,
	MenuItem,
	useMediaQuery,
	useTheme
} from '@mui/material';
import {
	Menu as MenuIcon,
	ChevronLeft as ChevronLeftIcon,
	Dashboard as DashboardIcon,
	Person as PersonIcon,
	Logout as LogoutIcon,
	Notifications as NotificationsIcon,
	Search as SearchIcon,
	Settings as SettingsIcon,
	Groups as GroupsIcon,
	Assignment as AssignmentIcon,
	School as SchoolIcon
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import Breadcrumbs from '../common/Breadcrumbs';

const drawerWidth = 240;

const MainLayout: React.FC = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [open, setOpen] = useState(!isMobile);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const { user } = useAppSelector((state) => state.auth);
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useAppDispatch();

	const handleDrawerToggle = () => {
		setOpen(!open);
	};

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		dispatch(logoutUser());
		handleMenuClose();
		navigate('/login');
	};

	const menuItems = [
		{ text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
		{ text: 'Candidates', icon: <GroupsIcon />, path: '/candidates' },
		{ text: 'Training', icon: <SchoolIcon />, path: '/training' },
		{ text: 'Allocations', icon: <AssignmentIcon />, path: '/allocations' },
		{ text: 'Users', icon: <PersonIcon />, path: '/users', roles: ['admin'] },
		{ text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
	];

	const filteredMenuItems = menuItems.filter(item => 
		!item.roles || (user && item.roles.includes(user.role))
	);

	const drawer = (
		<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
			<Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: [1] }}>
				<Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', ml: 1 }}>
					WinVinaya
				</Typography>
				<IconButton onClick={handleDrawerToggle}>
					<ChevronLeftIcon />
				</IconButton>
			</Toolbar>
			<Divider />
			<List component="nav" sx={{ flexGrow: 1, py: 2 }}>
				{filteredMenuItems.map((item) => (
					<ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
						<ListItemButton
							onClick={() => navigate(item.path)}
							selected={location.pathname === item.path}
							sx={{
								minHeight: 48,
								justifyContent: open ? 'initial' : 'center',
								px: 2.5,
								mx: 1,
								borderRadius: 1,
								'&.Mui-selected': {
									backgroundColor: 'rgba(236, 114, 17, 0.08)',
									color: 'primary.main',
									'& .MuiListItemIcon-root': {
										color: 'primary.main',
									},
								},
							}}
						>
							<ListItemIcon
								sx={{
									minWidth: 0,
									mr: open ? 3 : 'auto',
									justifyContent: 'center',
								}}
							>
								{item.icon}
							</ListItemIcon>
							<ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	return (
		<Box sx={{ display: 'flex' }}>
			<AppBar
				position="fixed"
				sx={{
					zIndex: theme.zIndex.drawer + 1,
					transition: theme.transitions.create(['width', 'margin'], {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.leavingScreen,
					}),
					...(open && {
						marginLeft: drawerWidth,
						width: `calc(100% - ${drawerWidth}px)`,
						transition: theme.transitions.create(['width', 'margin'], {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.enteringScreen,
						}),
					}),
					backgroundColor: '#ffffff',
					color: 'text.primary',
					borderBottom: '1px solid #d5dbdb'
				}}
			>
				<Toolbar sx={{ justifyContent: 'space-between' }}>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						{!open && (
							<IconButton
								color="inherit"
								aria-label="open drawer"
								onClick={handleDrawerToggle}
								edge="start"
								sx={{ mr: 2 }}
							>
								<MenuIcon />
							</IconButton>
						)}
						<Typography variant="h6" noWrap component="div" sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
							{menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
						</Typography>
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Tooltip title="Search">
							<IconButton color="inherit">
								<SearchIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title="Notifications">
							<IconButton color="inherit">
								<NotificationsIcon />
							</IconButton>
						</Tooltip>
						<IconButton
							onClick={handleMenuOpen}
							sx={{ p: 0.5 }}
							aria-controls="user-menu"
							aria-haspopup="true"
						>
							<Avatar 
								sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}
							>
								{user?.email?.charAt(0).toUpperCase() || 'U'}
							</Avatar>
						</IconButton>
						<Menu
							id="user-menu"
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
							transformOrigin={{ horizontal: 'right', vertical: 'top' }}
							anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
						>
							<Box sx={{ px: 2, py: 1 }}>
								<Typography variant="subtitle2" noWrap>{user?.email}</Typography>
								<Typography variant="caption" color="text.secondary" noWrap>
									{user?.role?.toUpperCase() || 'USER'}
								</Typography>
							</Box>
							<Divider />
							<MenuItem onClick={handleMenuClose}>
								<ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
								Profile
							</MenuItem>
							<MenuItem onClick={handleLogout}>
								<ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
								Logout
							</MenuItem>
						</Menu>
					</Box>
				</Toolbar>
			</AppBar>

			<Drawer
				variant={isMobile ? "temporary" : "permanent"}
				open={open}
				onClose={isMobile ? handleDrawerToggle : undefined}
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: drawerWidth,
						boxSizing: 'border-box',
						...(!open && !isMobile && {
							width: theme.spacing(7),
							overflowX: 'hidden',
						})
					},
				}}
			>
				{drawer}
			</Drawer>

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					minHeight: '100vh',
					backgroundColor: '#f2f3f3'
				}}
			>
				<Toolbar />
				<Breadcrumbs />
				<Outlet />
			</Box>
		</Box>
	);
};

export default MainLayout;
