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
	Explore as ExploreIcon,
	FavoriteBorder as FavoriteBorderIcon,
	ShoppingBag as ShoppingBagIcon,
	Person as PersonIcon,
	Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
	mobileOpen: boolean;
	onDrawerToggle: () => void;
	isMobile: boolean;
}

const drawerWidth = 260;

const menuItems = [
	{ text: 'My Learning', icon: <SchoolIcon />, path: '/dashboard' },
	{ text: 'Browse Courses', icon: <ExploreIcon />, path: '/courses' },
	{ text: 'Wishlist', icon: <FavoriteBorderIcon />, path: '/wishlist' },
	{ text: 'My Cart', icon: <ShoppingBagIcon />, path: '/cart' },
	{ text: 'Profile', icon: <PersonIcon />, path: '/profile' },
	{ text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onDrawerToggle, isMobile }) => {
	const navigate = useNavigate();
	const location = useLocation();

	const drawerContent = (
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
								if (isMobile) onDrawerToggle();
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
		<Drawer
			variant="temporary"
			open={mobileOpen}
			onClose={onDrawerToggle}
			ModalProps={{ keepMounted: true }}
			sx={{
				display: { xs: 'block', md: 'none' },
				'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRadius: 0 },
			}}
		>
			{drawerContent}
		</Drawer>
	);
};

export default Sidebar;
