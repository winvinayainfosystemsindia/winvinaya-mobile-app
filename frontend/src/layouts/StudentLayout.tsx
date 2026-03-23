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
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  LayoutDashboard, 
  Library, 
  Trophy, 
  Award, 
  User, 
  LogOut,
  ChevronLeft,
  GraduationCap
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

const drawerWidth = 260;

const StudentLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const menuItems = [
    { text: 'My Learning', icon: <LayoutDashboard size={20} />, path: '/student/dashboard' },
    { text: 'Browse Courses', icon: <Library size={20} />, path: '/courses' },
    { text: 'Leaderboard', icon: <Trophy size={20} />, path: '/student/leaderboard' },
    { text: 'My Certificates', icon: <Award size={20} />, path: '/student/certificates' },
    { text: 'Profile', icon: <User size={20} />, path: '/student/profile' },
  ];

  const handleDrawerToggle = () => setOpen(!open);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 64 }}>
        <Box sx={{ p: 1, bgcolor: 'primary.main', borderRadius: 1.5, color: '#fff' }}>
          <GraduationCap size={24} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5, display: open || isMobile ? 'block' : 'none' }}>
          StudentPortal
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1, py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'primary.light' : 'transparent',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  '&:hover': { bgcolor: isActive ? 'primary.light' : 'rgba(164, 53, 240, 0.04)' },
                  transition: 'all 0.2s',
                  px: 2,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                {(open || isMobile) && (
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 700 : 500 }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main' }}>
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <LogOut size={20} />
          </ListItemIcon>
          {(open || isMobile) && <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${open ? drawerWidth : 64}px)` },
          ml: { md: `${open ? drawerWidth : 64}px` },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
              Happy Learning, {user?.full_name?.split(' ')[0]}!
            </Typography>
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                {user?.full_name?.charAt(0) || 'S'}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{ sx: { mt: 1.5, minWidth: 180, borderRadius: 2 } }}
            >
              <MenuItem onClick={() => { navigate('/student/profile'); handleMenuClose(); }}>My Profile</MenuItem>
              <MenuItem onClick={() => { navigate('/student/dashboard'); handleMenuClose(); }}>My Learning</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon><LogOut size={16} /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: open ? drawerWidth : 64 }, flexShrink: { md: 0 }, transition: 'width 0.2s' }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={open}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: open ? drawerWidth : 64,
                overflowX: 'hidden',
                transition: 'width 0.2s',
                borderRight: '1px solid',
                borderColor: 'divider'
              },
            }}
            open={open}
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, pt: { xs: 9, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 0 } }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default StudentLayout;
