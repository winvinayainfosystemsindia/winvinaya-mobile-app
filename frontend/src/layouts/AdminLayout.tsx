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
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  UserPlus, 
  Settings, 
  LogOut,
  ChevronLeft,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

const drawerWidth = 260;

const AdminLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const menuItems = [
    { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { text: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    { text: 'Courses', icon: <BookOpen size={20} />, path: '/admin/courses' },
    { text: 'Groups', icon: <UserPlus size={20} />, path: '/admin/groups' },
    { text: 'Enrollments', icon: <ShieldCheck size={20} />, path: '/admin/enrollments' },
    { text: 'Platform Settings', icon: <Settings size={20} />, path: '/admin/settings' },
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
          AdminPortal
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1, py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ mr: 2 }}
            >
              {open ? <ChevronLeft /> : <MenuIcon />}
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
              {user?.full_name}
            </Typography>
            <Tooltip title="Account settings">
              <IconButton onClick={handleMenuOpen} size="small">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                  {user?.full_name?.charAt(0) || 'A'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{ sx: { mt: 1.5, minWidth: 180, borderRadius: 2 } }}
            >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
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

      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10, bgcolor: 'background.default' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
