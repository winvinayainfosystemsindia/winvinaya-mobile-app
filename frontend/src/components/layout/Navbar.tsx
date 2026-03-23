import React, { useState } from 'react';
import {
	AppBar,
	Toolbar,
	Box,
	Typography,
	IconButton,
	Paper,
	InputBase,
	Avatar,
	Menu,
	MenuItem,
	Stack,
	Button,
	Divider,
	useTheme,
	Link,
	Container,
	Badge
} from '@mui/material';
import {
	Menu as MenuIcon,
	Search as SearchIcon,
	FavoriteBorder as FavoriteBorderIcon,
	NotificationsNone as NotificationsIcon,
	PersonOutline as PersonIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { designTokens } from '../../theme/designTokens';
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

	const location = useLocation();

	const [searchQuery, setSearchQuery] = useState('');

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
		}
	};

	const navLinks = [
		{ text: 'Explore Disciplines', path: '/catalog' },
		{ text: 'My Learning', path: '/my-learning' },
		{ text: 'Teach', path: '/teach' },
		{ text: 'Instructor', path: '/dashboard' },
	];

	return (
		<AppBar
			position="fixed"
			sx={{
				zIndex: theme.zIndex.drawer + 1,
				bgcolor: designTokens.colors.surface,
				borderBottom: `1px solid ${designTokens.colors.border}`,
				height: designTokens.spacing.topbarHeight,
				justifyContent: 'center'
			}}
			elevation={0}
		>
			<Container maxWidth="xl">
				<Toolbar sx={{ px: { xs: 0 }, gap: { xs: 1, md: 3 } }}>
					{isMobile && (
						<IconButton
							edge="start"
							onClick={onDrawerToggle}
							sx={{ mr: 1, color: designTokens.colors.textPrimary }}
						>
							<MenuIcon />
						</IconButton>
					)}

					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							cursor: 'pointer',
							mr: 2,
							gap: 1.5
						}}
						onClick={() => navigate('/')}
					>
						<img
							src="/assets/images/Nammacademy_Logo.png"
							alt="Nammacademy Logo"
							style={{ height: '50px', width: 'auto' }}
						/>
					</Box>

					{!isMobile && (
						<Stack direction="row" spacing={3} sx={{ mr: 2 }}>
							{navLinks.map((link) => {
								const isActive = location.pathname === link.path;
								return (
									<Link
										key={link.text}
										onClick={() => navigate(link.path)}
										sx={{
											color: isActive ? designTokens.colors.primary : designTokens.colors.textSecondary,
											fontWeight: isActive ? 800 : 600,
											fontSize: '14px',
											cursor: 'pointer',
											textDecoration: 'none',
											transition: 'all 0.2s',
											whiteSpace: 'nowrap',
											borderBottom: isActive ? `2px solid ${designTokens.colors.primary}` : '2px solid transparent',
											pb: '4px',
											'&:hover': { 
												color: designTokens.colors.primary,
												borderBottom: `2px solid ${designTokens.colors.primary}`
											}
										}}
									>
										{link.text}
									</Link>
								);
							})}
						</Stack>
					)}

					{/* Search Bar */}
					<Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
						<Paper
							component="form"
							onSubmit={handleSearchSubmit}
							sx={{
								p: '2px 14px',
								display: 'flex',
								alignItems: 'center',
								bgcolor: designTokens.colors.sidebarHover,
								borderRadius: '100px',
								border: `1px solid ${designTokens.colors.border}`,
								width: '100%',
								maxWidth: 500,
								height: 40,
								boxShadow: 'none',
								transition: 'all 0.2s',
								'&:hover': { bgcolor: designTokens.colors.sidebarHover, borderColor: designTokens.colors.border },
								'&:focus-within': {
									bgcolor: designTokens.colors.surface,
									borderColor: designTokens.colors.primary,
									boxShadow: `0 0 0 4px rgba(0, 86, 210, 0.1)`
								}
							}}
						>
							<SearchIcon sx={{ fontSize: 20, color: '#94a3b8', mr: 1 }} />
							<InputBase
								sx={{ flex: 1, fontSize: '14px', fontWeight: 500 }}
								placeholder="Search for courses..."
								inputProps={{ 'aria-label': 'search courses' }}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</Paper>
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1.5 } }}>
						{isAuthenticated && location.pathname !== '/' ? (
							<>
								<IconButton sx={{ color: designTokens.colors.textSecondary, display: { xs: 'none', md: 'flex' } }}>
									<FavoriteBorderIcon fontSize="medium" />
								</IconButton>
								<IconButton sx={{ color: designTokens.colors.textSecondary }}>
									<Badge color="error" variant="dot" overlap="circular">
										<NotificationsIcon fontSize="medium" />
									</Badge>
								</IconButton>

								<IconButton
									onClick={handleMenuOpen}
									sx={{
										p: 0,
										ml: 1,
									}}
								>
									<Avatar
										sx={{
											width: 36,
											height: 36,
											bgcolor: designTokens.colors.primary,
											color: '#ffffff',
											fontSize: '14px',
											fontWeight: 700
										}}
									>
										{user?.full_name?.charAt(0).toUpperCase() || <PersonIcon />}
									</Avatar>
								</IconButton>
							</>
						) : (
							<Stack direction="row" spacing={1}>
								<Button
									variant="text"
									sx={{
										color: designTokens.colors.textPrimary,
										fontWeight: 700,
										textTransform: 'none',
										fontSize: '14px',
										'&:hover': { bgcolor: designTokens.colors.sidebarHover }
									}}
									onClick={() => navigate('/auth/login')}
								>
									Log in
								</Button>
								<Button
									variant="contained"
									sx={{
										bgcolor: designTokens.colors.primary,
										color: '#ffffff',
										fontWeight: 700,
										borderRadius: '8px',
										px: 2.5,
										py: 1,
										textTransform: 'none',
										fontSize: '14px',
										boxShadow: 'none',
										'&:hover': { bgcolor: designTokens.colors.primaryDark, boxShadow: 'none' }
									}}
									onClick={() => navigate('/auth/register')}
								>
									Sign up
								</Button>
							</Stack>
						)}
					</Box>

					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleMenuClose}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
						transformOrigin={{ vertical: 'top', horizontal: 'right' }}
						PaperProps={{
							sx: {
								borderRadius: '16px',
								mt: 2,
								minWidth: 280,
								boxShadow: designTokens.shadows.cardHover,
								border: `1px solid ${designTokens.colors.border}`,
								overflow: 'hidden'
							}
						}}
					>
						<Box sx={{ px: 2.5, py: 2.5, bgcolor: '#f8fafc' }}>
							<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
								<Avatar sx={{ width: 48, height: 48, bgcolor: '#0055d1' }}>
									{user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
								</Avatar>
								<Box sx={{ minWidth: 0 }}>
									<Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2, color: designTokens.colors.textPrimary }} noWrap>
										{user?.full_name || 'User'}
									</Typography>
									<Typography variant="caption" sx={{ color: designTokens.colors.textSecondary }} noWrap display="block">
										{user?.email}
									</Typography>
								</Box>
							</Box>
						</Box>
						<Divider />
						<Box sx={{ py: 1 }}>
							<MenuItem onClick={() => { navigate('/my-learning'); handleMenuClose(); }} sx={{ py: 1.5, px: 2.5, fontSize: '14px', fontWeight: 500 }}>My learning</MenuItem>
							<MenuItem onClick={() => { navigate('/cart'); handleMenuClose(); }} sx={{ py: 1.5, px: 2.5, fontSize: '14px', fontWeight: 500 }}>My cart</MenuItem>
							<MenuItem onClick={() => { navigate('/wishlist'); handleMenuClose(); }} sx={{ py: 1.5, px: 2.5, fontSize: '14px', fontWeight: 500 }}>Wishlist</MenuItem>
						</Box>
						<Divider />
						<Box sx={{ py: 1 }}>
							<MenuItem onClick={() => { navigate('/notifications'); handleMenuClose(); }} sx={{ py: 1.5, px: 2.5, fontSize: '14px', fontWeight: 500 }}>Notifications</MenuItem>
						</Box>
						<Divider />
						<Box sx={{ py: 1 }}>
							<MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }} sx={{ py: 1.5, px: 2.5, fontSize: '14px', fontWeight: 500 }}>Account settings</MenuItem>
						</Box>
						<Divider />
						<Box sx={{ py: 1 }}>
							<MenuItem onClick={handleLogoutClick} sx={{ py: 1.5, px: 2.5, fontWeight: 700, color: '#dc2626', fontSize: '14px' }}>Log out</MenuItem>
						</Box>
					</Menu>
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default Navbar;
