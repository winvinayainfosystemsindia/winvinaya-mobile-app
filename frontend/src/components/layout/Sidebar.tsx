import React from 'react';
import {
	Box,
	Drawer,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography
} from '@mui/material';
import {
	School as SchoolIcon,
	Category as CategoryIcon,
	HistoryEdu as TeachIcon,
	Dashboard as DashboardIcon,
	FavoriteBorder as FavoriteBorderIcon,
	ShoppingBag as ShoppingBagIcon,
	Person as PersonIcon,
	Settings as SettingsIcon,
	Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
	mobileOpen: boolean;
	onDrawerToggle: () => void;
	isMobile: boolean;
}

const drawerWidth = 280;

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onDrawerToggle, isMobile }) => {
	const navigate = useNavigate();
	const location = useLocation();

	const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
		{ text: 'Categories', icon: <CategoryIcon />, path: '/catalog' },
		{ text: 'My Learning', icon: <SchoolIcon />, path: '/my-learning' },
		{ text: 'Teach', icon: <TeachIcon />, path: '/teach' },
		{ text: 'Instructor', icon: <DashboardIcon />, path: '/dashboard' },
	];

  const secondaryItems = [
    { text: 'Wishlist', icon: <FavoriteBorderIcon />, path: '/wishlist' },
		{ text: 'My Cart', icon: <ShoppingBagIcon />, path: '/cart' },
		{ text: 'Profile', icon: <PersonIcon />, path: '/student/profile' },
		{ text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

	const drawerContent = (
		<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
			<Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
				<Box 
					component="img" 
					src="/assets/images/Nammacademy_Logo.png" 
					alt="Logo" 
					sx={{ height: 36, width: 'auto' }}
				/>
				<Typography variant="h6" sx={{ fontWeight: 900, color: '#0055d1', letterSpacing: -0.5 }}>
					Academic Curator
				</Typography>
			</Box>
			<Divider />
			<List sx={{ px: 2, py: 2 }}>
				{menuItems.map((item) => (
					<ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
						<ListItemButton
							onClick={() => {
								navigate(item.path);
								if (isMobile) onDrawerToggle();
							}}
							selected={location.pathname === item.path}
							sx={{
								borderRadius: '12px',
								'&.Mui-selected': {
									bgcolor: 'rgba(0, 85, 209, 0.08)',
									color: '#0055d1',
									'& .MuiListItemIcon-root': { color: '#0055d1' },
									'&:hover': { bgcolor: 'rgba(0, 85, 209, 0.12)' },
								},
								py: 1.5,
                px: 2
							}}
						>
							<ListItemIcon sx={{ minWidth: 40, color: '#64748b' }}>{item.icon}</ListItemIcon>
							<ListItemText 
								primary={item.text} 
								primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 700 : 600, fontSize: '14px' }} 
							/>
						</ListItemButton>
					</ListItem>
				))}
			</List>
      <Divider sx={{ mx: 2 }} />
      <List sx={{ px: 2, py: 2 }}>
				{secondaryItems.map((item) => (
					<ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
						<ListItemButton
							onClick={() => {
								navigate(item.path);
								if (isMobile) onDrawerToggle();
							}}
							selected={location.pathname === item.path}
							sx={{
								borderRadius: '12px',
								'&.Mui-selected': {
									bgcolor: 'rgba(0, 85, 209, 0.08)',
									color: '#0055d1',
									'& .MuiListItemIcon-root': { color: '#0055d1' },
									'&:hover': { bgcolor: 'rgba(0, 85, 209, 0.12)' },
								},
								py: 1.2,
                px: 2
							}}
						>
							<ListItemIcon sx={{ minWidth: 40, color: '#64748b' }}>{item.icon}</ListItemIcon>
							<ListItemText 
								primary={item.text} 
								primaryTypographyProps={{ fontWeight: 600, fontSize: '13px', color: '#64748b' }} 
							/>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	return (
		<Drawer
			variant="temporary"
			open={mobileOpen}
			onClose={onDrawerToggle}
			ModalProps={{ keepMounted: true }}
			sx={{
				display: { xs: 'block', md: 'none' },
				'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
			}}
		>
			{drawerContent}
		</Drawer>
	);
};

export default Sidebar;
