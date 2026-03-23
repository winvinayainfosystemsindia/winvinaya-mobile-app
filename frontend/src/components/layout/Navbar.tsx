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
	Notifications as NotificationsIcon,
	Language as LanguageIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../models/auth';
import { designTokens } from '../../theme/designTokens';

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
				borderBottom: `1px solid ${designTokens.colors.border}`,
				height: 72,
				justifyContent: 'center'
			}}
			elevation={0}
		>
			<Toolbar sx={{ px: { xs: 2, md: 4 }, gap: 2 }}>
				{isMobile && (
					<IconButton
						edge="start"
						onClick={onDrawerToggle}
						sx={{ mr: 1, color: designTokens.colors.dark }}
					>
						<MenuIcon />
					</IconButton>
				)}

				{/* Logo */}
				<Box
					sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 2 }}
					onClick={() => navigate('/')}
				>
					<Box
						component="img"
						src="/assets/images/Nammacademy_Logo.png"
						alt="Nammacademy"
						sx={{ height: 48, width: 'auto' }}
						onError={(e: any) => {
							e.target.style.display = 'none';
						}}
					/>
					{!isMobile && (
						<Typography sx={{ fontWeight: 800, fontSize: '20px', ml: 1, color: designTokens.colors.dark }}>
							Namm<span style={{ color: designTokens.colors.primary }}>Academy</span>
						</Typography>
					)}
				</Box>

				{!isMobile && (
					<Typography
						variant="body2"
						sx={{
							cursor: 'pointer',
							color: designTokens.colors.textPrimary,
							fontWeight: 500,
							'&:hover': { color: designTokens.colors.primary }
						}}
					>
						Categories
					</Typography>
				)}

				{/* Search Bar — Center pill shape */}
				<Paper
					component="form"
					sx={{
						p: '2px 16px',
						display: 'flex',
						alignItems: 'center',
						flexGrow: 1,
						bgcolor: '#f7f9fa',
						borderRadius: 50,
						border: `1px solid ${designTokens.colors.dark}`,
						maxWidth: 700,
						height: 46,
						boxShadow: 'none',
						'&:hover': { bgcolor: '#f1f3f4' }
					}}
				>
					<SearchIcon sx={{ fontSize: 20, color: designTokens.colors.textSecondary, mr: 1 }} />
					<InputBase
						sx={{ flex: 1, fontSize: '14px' }}
						placeholder="Search for anything"
						inputProps={{ 'aria-label': 'search courses' }}
					/>
				</Paper>

				{!isMobile && (
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
						<Typography
							variant="body2"
							sx={{
								cursor: 'pointer',
								color: designTokens.colors.textPrimary,
								fontWeight: 500,
								'&:hover': { color: designTokens.colors.primary }
							}}
						>
							Business
						</Typography>
						<Typography
							variant="body2"
							sx={{
								cursor: 'pointer',
								color: designTokens.colors.textPrimary,
								fontWeight: 500,
								'&:hover': { color: designTokens.colors.primary }
							}}
						>
							Teach
						</Typography>
					</Box>
				)}

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
					{isAuthenticated ? (
						<>
							{!isMobile && (
								<Stack direction="row" spacing={1}>
									<Tooltip title="My Learning">
										<Button
											sx={{ color: designTokens.colors.textPrimary, textTransform: 'none', fontWeight: 500 }}
											onClick={() => navigate('/my-learning')}
										>
											My learning
										</Button>
									</Tooltip>
									<IconButton sx={{ color: designTokens.colors.dark }}>
										<FavoriteBorderIcon fontSize="small" />
									</IconButton>
									<IconButton sx={{ color: designTokens.colors.dark }}>
										<ShoppingBagIcon fontSize="small" />
									</IconButton>
									<IconButton sx={{ color: designTokens.colors.dark }}>
										<NotificationsIcon fontSize="small" />
									</IconButton>
								</Stack>
							)}

							<IconButton
								onClick={handleMenuOpen}
								sx={{ p: 0.5 }}
							>
								<Avatar
									sx={{
										width: 32,
										height: 32,
										bgcolor: designTokens.colors.dark,
										fontSize: '13px',
										fontWeight: 700
									}}
								>
									{user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
								</Avatar>
							</IconButton>
						</>
					) : (
						<Stack direction="row" spacing={1}>
							<Button
								variant="outlined"
								sx={{
									borderColor: designTokens.colors.dark,
									color: designTokens.colors.dark,
									fontWeight: 700,
									borderRadius: 0,
									height: 40,
									px: 3,
									'&:hover': { bgcolor: 'rgba(28,29,31,0.04)', borderColor: designTokens.colors.dark }
								}}
								onClick={() => navigate('/login')}
							>
								Log in
							</Button>
							<Button
								variant="contained"
								sx={{
									bgcolor: designTokens.colors.dark,
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
							{!isMobile && (
								<IconButton sx={{ border: `1px solid ${designTokens.colors.dark}`, borderRadius: 0, height: 40, width: 40 }}>
									<LanguageIcon fontSize="small" sx={{ color: designTokens.colors.dark }} />
								</IconButton>
							)}
						</Stack>
					)}

					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleMenuClose}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
						transformOrigin={{ vertical: 'top', horizontal: 'right' }}
						PaperProps={{
							sx: {
								borderRadius: 0,
								mt: 1.5,
								minWidth: 260,
								boxShadow: designTokens.shadows.dropdown,
								border: `1px solid ${designTokens.colors.border}`
							}
						}}
					>
						<Box sx={{ px: 2, py: 2 }}>
							<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
								<Avatar sx={{ width: 48, height: 48, bgcolor: designTokens.colors.dark }}>
									{user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
								</Avatar>
								<Box sx={{ minWidth: 0 }}>
									<Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
										{user?.full_name || 'User'}
									</Typography>
									<Typography variant="caption" color="text.secondary" noWrap display="block">
										{user?.email}
									</Typography>
								</Box>
							</Box>
						</Box>
						<Divider />
						<MenuItem onClick={() => { navigate('/my-learning'); handleMenuClose(); }} sx={{ py: 1.2, fontSize: '14px' }}>My learning</MenuItem>
						<MenuItem onClick={() => { navigate('/cart'); handleMenuClose(); }} sx={{ py: 1.2, fontSize: '14px' }}>My cart</MenuItem>
						<MenuItem onClick={() => { navigate('/wishlist'); handleMenuClose(); }} sx={{ py: 1.2, fontSize: '14px' }}>Wishlist</MenuItem>
						<Divider />
						<MenuItem onClick={() => { navigate('/notifications'); handleMenuClose(); }} sx={{ py: 1.2, fontSize: '14px' }}>Notifications</MenuItem>
						<MenuItem onClick={() => { navigate('/messages'); handleMenuClose(); }} sx={{ py: 1.2, fontSize: '14px' }}>Messages</MenuItem>
						<Divider />
						<MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }} sx={{ py: 1.2, fontSize: '14px' }}>Account settings</MenuItem>
						<MenuItem onClick={() => { navigate('/payment-methods'); handleMenuClose(); }} sx={{ py: 1.2, fontSize: '14px' }}>Payment methods</MenuItem>
						<Divider />
						{(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'teacher') && (
							<MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose(); }} sx={{ py: 1.2, color: designTokens.colors.primary, fontWeight: 700, fontSize: '14px' }}>
								Instructor Dashboard
							</MenuItem>
						)}
						<MenuItem onClick={handleLogoutClick} sx={{ py: 1.2, fontWeight: 700, color: designTokens.colors.primary, fontSize: '14px' }}>Log out</MenuItem>
					</Menu>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
