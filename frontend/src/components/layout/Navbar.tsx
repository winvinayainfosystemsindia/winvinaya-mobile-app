import React, { useState } from 'react';
import {
	AppBar,
	Toolbar,
	Box,
	Typography,
	IconButton,
	Paper,
	InputBase,
	Tooltip,
	Avatar,
	Menu,
	MenuItem,
	Stack,
	Button,
	Divider,
	useTheme
} from '@mui/material';
import {
	Menu as MenuIcon,
	Search as SearchIcon,
	FavoriteBorder as FavoriteBorderIcon,
	ShoppingBag as ShoppingBagIcon,
	Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../models/auth';

interface NavbarProps {
	user: User | null;
	isAuthenticated: boolean;
	isMobile: boolean;
	onDrawerToggle: () => void;
	onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
	user,
	isAuthenticated,
	isMobile,
	onDrawerToggle,
	onLogout
}) => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogoutClick = () => {
		onLogout();
		handleMenuClose();
	};

	return (
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
						onClick={onDrawerToggle}
						edge="start"
						sx={{ mr: 1, color: '#1c1d1f' }}
					>
						<MenuIcon />
					</IconButton>
				)}

				{/* Logo */}
				<Box
					sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 2 }}
					onClick={() => navigate('/student/dashboard')}
				>
					<Box
						component="img"
						src="/assets/images/Nammacademy_Logo.png"
						alt="Nammacademy"
						sx={{ height: 60, width: 'auto' }}
						onError={(e: any) => {
							e.target.style.display = 'none';
						}}
					/>
				</Box>

				{!isMobile && (
					<Typography variant="body2" sx={{ cursor: 'pointer', color: '#1c1d1f', '&:hover': { color: 'primary.main' } }}>
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
						<Typography variant="body2" sx={{ cursor: 'pointer', color: '#1c1d1f', '&:hover': { color: 'primary.main' } }}>
							WinVinaya Business
						</Typography>
						<Typography variant="body2" sx={{ cursor: 'pointer', color: '#1c1d1f', '&:hover': { color: 'primary.main' } }}>
							Teach on WinVinaya
						</Typography>
						{(user?.role === 'admin' || user?.role === 'instructor') && (
							<Typography 
								variant="body2" 
								sx={{ 
									cursor: 'pointer', 
									color: 'primary.main', 
									fontWeight: 700, 
									'&:hover': { color: 'primary.dark' } 
								}}
								onClick={() => navigate('/teacher/courses')}
							>
								Instructor Dashboard
							</Typography>
						)}
					</Box>
				)}

				<Box sx={{ flexGrow: 1 }} />

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					{isAuthenticated ? (
						<>
							{!isMobile && (
								<>
									<Tooltip title="Favorites">
										<IconButton sx={{ color: '#1c1d1f' }}>
											<FavoriteBorderIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title="Shopping Cart">
										<IconButton sx={{ color: '#1c1d1f' }}>
											<ShoppingBagIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title="Notifications">
										<IconButton sx={{ color: '#1c1d1f' }}>
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
						</>
					) : (
						<Stack direction="row" spacing={1}>
							<Button
								variant="outlined"
								sx={{
									borderColor: '#1c1d1f',
									color: '#1c1d1f',
									fontWeight: 700,
									borderRadius: 0,
									height: 40,
									px: 3,
									'&:hover': { bgcolor: 'rgba(28,29,31,0.04)', borderColor: '#1c1d1f' }
								}}
								onClick={() => navigate('/login')}
							>
								Log in
							</Button>
							<Button
								variant="contained"
								sx={{
									bgcolor: '#1c1d1f',
									color: '#ffffff',
									fontWeight: 700,
									borderRadius: 0,
									height: 40,
									px: 3,
									'&:hover': { bgcolor: '#000000' }
								}}
								onClick={() => navigate('/register')}
							>
								Sign up
							</Button>
						</Stack>
					)}

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
						<MenuItem onClick={() => { navigate('/student/dashboard'); handleMenuClose(); }} sx={{ py: 1.5 }}>My learning</MenuItem>
						<MenuItem onClick={() => { navigate('/cart'); handleMenuClose(); }} sx={{ py: 1.5 }}>My cart</MenuItem>
						<MenuItem onClick={() => { navigate('/wishlist'); handleMenuClose(); }} sx={{ py: 1.5 }}>Wishlist</MenuItem>
						<Divider />
						<MenuItem onClick={() => { navigate('/notifications'); handleMenuClose(); }} sx={{ py: 1.5 }}>Notifications</MenuItem>
						<MenuItem onClick={() => { navigate('/messages'); handleMenuClose(); }} sx={{ py: 1.5 }}>Messages</MenuItem>
						<Divider />
						<MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }} sx={{ py: 1.5 }}>Account settings</MenuItem>
						<MenuItem onClick={() => { navigate('/payment-methods'); handleMenuClose(); }} sx={{ py: 1.5 }}>Payment methods</MenuItem>
						<Divider />
						{(user?.role === 'admin' || user?.role === 'instructor') && (
							<MenuItem onClick={() => { navigate('/teacher/courses'); handleMenuClose(); }} sx={{ py: 1.5, color: 'primary.main', fontWeight: 600 }}>
								Instructor Dashboard
							</MenuItem>
						)}
						<MenuItem onClick={handleLogoutClick} sx={{ py: 1.5, fontWeight: 700, color: 'primary.main' }}>Log out</MenuItem>
					</Menu>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
