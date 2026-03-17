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
	useTheme,
	InputBase,
	Paper
} from '@mui/material';
import {
	Menu as MenuIcon,
	Person as PersonIcon,
	Notifications as NotificationsIcon,
	Search as SearchIcon,
	Settings as SettingsIcon,
	School as SchoolIcon,
	ShoppingBag as ShoppingBagIcon,
	FavoriteBorder as FavoriteBorderIcon,
	Explore as ExploreIcon
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';

const drawerWidth = 260;

const MainLayout: React.FC = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const [mobileOpen, setMobileOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const { user } = useAppSelector((state) => state.auth);
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useAppDispatch();

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
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
		{ text: 'My Learning', icon: <SchoolIcon />, path: '/dashboard' },
		{ text: 'Browse Courses', icon: <ExploreIcon />, path: '/courses' },
		{ text: 'Wishlist', icon: <FavoriteBorderIcon />, path: '/wishlist' },
		{ text: 'My Cart', icon: <ShoppingBagIcon />, path: '/cart' },
		{ text: 'Profile', icon: <PersonIcon />, path: '/profile' },
		{ text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
	];

	const drawer = (
		<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
			<Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
				<Box 
					component="img" 
					src="/logo.png" 
					alt="Udemy" 
					sx={{ width: 32, height: 32, borderRadius: 0 }}
					onError={(e: any) => e.target.style.display = 'none'} 
				/>
				<Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
					WinVinaya
				</Typography>
			</Box>
			<Divider />
			<List sx={{ px: 2, py: 2 }}>
				{menuItems.map((item) => (
					<ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
						<ListItemButton
							onClick={() => {
								navigate(item.path);
								if (isMobile) setMobileOpen(false);
							}}
							selected={location.pathname === item.path}
							sx={{
								borderRadius: 0,
								'&.Mui-selected': {
									bgcolor: 'rgba(164, 53, 240, 0.08)',
									color: 'primary.main',
									'& .MuiListItemIcon-root': { color: 'primary.main' },
									'&:hover': { bgcolor: 'rgba(164, 53, 240, 0.12)' },
								},
								py: 1.5
							}}
						>
							<ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
							<ListItemText 
								primary={item.text} 
								primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 700 : 400 }} 
							/>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	return (
		<Box sx={{ display: 'flex', bgcolor: '#ffffff' }}>
			<AppBar
				position="fixed"
				sx={{
					zIndex: theme.zIndex.drawer + 1,
					bgcolor: '#ffffff',
					borderBottom: '1px solid #d1d7dc',
				}}
				elevation={0}
			>
				<Toolbar sx={{ height: 72, px: { xs: 2, md: 4 }, gap: 2 }}>
					{isMobile && (
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={handleDrawerToggle}
							edge="start"
							sx={{ mr: 1 }}
						>
							<MenuIcon />
						</IconButton>
					)}
					
					{/* Logo */}
					<Box 
						sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', mr: 2 }}
						onClick={() => navigate('/dashboard')}
					>
						<Typography variant="h5" sx={{ fontWeight: 800, color: '#1c1d1f' }}>
							WinVinaya
						</Typography>
					</Box>

					{!isMobile && (
						<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
							Categories
						</Typography>
					)}

					{/* Search Bar */}
					<Paper
						component="form"
						sx={{
							p: '2px 4px',
							display: 'flex',
							alignItems: 'center',
							flexGrow: 1,
							bgcolor: '#f7f9fa',
							borderRadius: 50,
							border: '1px solid #1c1d1f',
							maxWidth: 600,
							height: 48,
							boxShadow: 'none'
						}}
					>
						<IconButton sx={{ p: '10px' }} aria-label="search">
							<SearchIcon sx={{ fontSize: 20 }} />
						</IconButton>
						<InputBase
							sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }}
							placeholder="Search for anything"
							inputProps={{ 'aria-label': 'search for anything' }}
						/>
					</Paper>

					{!isMobile && (
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
							<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
								Udemy Business
							</Typography>
							<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
								Teach on WinVinaya
							</Typography>
						</Box>
					)}

					<Box sx={{ flexGrow: 1 }} />

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						{!isMobile && (
							<>
								<Tooltip title="Favorites">
									<IconButton color="inherit">
										<FavoriteBorderIcon />
									</IconButton>
								</Tooltip>
								<Tooltip title="Shopping Cart">
									<IconButton color="inherit">
										<ShoppingBagIcon />
									</IconButton>
								</Tooltip>
								<Tooltip title="Notifications">
									<IconButton color="inherit">
										<NotificationsIcon />
									</IconButton>
								</Tooltip>
							</>
						)}

						<IconButton
							onClick={handleMenuOpen}
							sx={{ p: 0.5 }}
						>
							<Avatar 
								sx={{ 
									width: 32, 
									height: 32, 
									bgcolor: '#1c1d1f', 
									fontSize: '0.875rem',
									borderRadius: '50%'
								}}
							>
								{user?.email?.charAt(0).toUpperCase() || 'U'}
							</Avatar>
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
							PaperProps={{
								sx: { borderRadius: 0, mt: 1.5, minWidth: 200, boxShadow: '0 2px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08)' }
							}}
						>
							<Box sx={{ px: 2, py: 2 }}>
								<Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
									<Avatar sx={{ width: 48, height: 48, bgcolor: '#1c1d1f' }}>
										{user?.email?.charAt(0).toUpperCase()}
									</Avatar>
									<Box>
										<Typography variant="subtitle1" sx={{ lineHeight: 1.2 }}>{user?.full_name || 'User'}</Typography>
										<Typography variant="caption" color="text.secondary">{user?.email}</Typography>
									</Box>
								</Box>
							</Box>
							<Divider />
							<MenuItem onClick={() => navigate('/dashboard')} sx={{ py: 1.5 }}>My learning</MenuItem>
							<MenuItem onClick={() => navigate('/cart')} sx={{ py: 1.5 }}>My cart</MenuItem>
							<MenuItem onClick={() => navigate('/wishlist')} sx={{ py: 1.5 }}>Wishlist</MenuItem>
							<Divider />
							<MenuItem onClick={() => navigate('/notifications')} sx={{ py: 1.5 }}>Notifications</MenuItem>
							<MenuItem onClick={() => navigate('/messages')} sx={{ py: 1.5 }}>Messages</MenuItem>
							<Divider />
							<MenuItem onClick={() => navigate('/settings')} sx={{ py: 1.5 }}>Account settings</MenuItem>
							<MenuItem onClick={() => navigate('/payment-methods')} sx={{ py: 1.5 }}>Payment methods</MenuItem>
							<Divider />
							<MenuItem onClick={handleLogout} sx={{ py: 1.5, fontWeight: 700, color: 'primary.main' }}>Log out</MenuItem>
						</Menu>
					</Box>
				</Toolbar>
			</AppBar>

			<Drawer
				variant="temporary"
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{ keepMounted: true }}
				sx={{
					display: { xs: 'block', md: 'none' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRadius: 0 },
				}}
			>
				{drawer}
			</Drawer>

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
