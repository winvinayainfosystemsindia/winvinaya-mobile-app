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
				bgcolor: '#ffffff',
				borderBottom: '1px solid #f1f5f9',
				height: 72,
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
							sx={{ mr: 1, color: '#0f172a' }}
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
											color: isActive ? '#0055d1' : '#475569',
											fontWeight: isActive ? 800 : 600,
											fontSize: '14px',
											cursor: 'pointer',
											textDecoration: 'none',
											transition: 'all 0.2s',
											whiteSpace: 'nowrap',
											borderBottom: isActive ? '2px solid #0055d1' : '2px solid transparent',
											pb: '4px',
											'&:hover': { 
												color: '#0055d1',
												borderBottom: '2px solid #0055d1'
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
								bgcolor: '#f1f5f9',
								borderRadius: '100px',
								border: '1px solid #e2e8f0',
								width: '100%',
								maxWidth: 500,
								height: 44,
								boxShadow: 'none',
								transition: 'all 0.2s',
								'&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' },
								'&:focus-within': {
									bgcolor: '#ffffff',
									borderColor: '#0055d1',
									boxShadow: '0 0 0 4px rgba(0, 85, 209, 0.1)'
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
						{isAuthenticated ? (
							<>
								<IconButton sx={{ color: '#475569', display: { xs: 'none', md: 'flex' } }}>
									<FavoriteBorderIcon fontSize="medium" />
								</IconButton>
								<IconButton sx={{ color: '#475569' }}>
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
											width: 40,
											height: 40,
											bgcolor: '#c2b280',
											color: '#ffffff',
											fontSize: '16px',
											fontWeight: 700
										}}
									>
										<PersonIcon />
									</Avatar>
								</IconButton>
							</>
						) : (
							<Stack direction="row" spacing={1.5}>
								<Button
									variant="text"
									sx={{
										color: '#0f172a',
										fontWeight: 800,
										textTransform: 'none',
										fontSize: '14px'
									}}
									onClick={() => navigate('/login')}
								>
									Log in
								</Button>
								<Button
									variant="contained"
									sx={{
										bgcolor: '#0055d1',
										color: '#ffffff',
										fontWeight: 800,
										borderRadius: '10px',
										px: 3,
										py: 1.2,
										textTransform: 'none',
										fontSize: '14px',
										boxShadow: 'none',
										'&:hover': { bgcolor: '#0040a1', boxShadow: 'none' }
									}}
									onClick={() => navigate('/register')}
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
								boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
								border: '1px solid #f1f5f9',
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
									<Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }} noWrap>
										{user?.full_name || 'User'}
									</Typography>
									<Typography variant="caption" sx={{ color: '#64748b' }} noWrap display="block">
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
