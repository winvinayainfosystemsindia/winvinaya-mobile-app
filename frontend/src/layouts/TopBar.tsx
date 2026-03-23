import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  InputBase,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  PlayCircle as PlayCircleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { designTokens } from '../theme/designTokens';

interface TopBarProps {
  drawerWidth: number;
  onDrawerToggle: () => void;
}

const roleColors: Record<string, string> = {
  admin: '#ec5252',
  manager: '#f69c08',
  teacher: '#1bad67',
  user: '#a435f0',
};

const TopBar: React.FC<TopBarProps> = ({ drawerWidth, onDrawerToggle }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchVal, setSearchVal] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
    navigate('/login');
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const avatarInitials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('')
    : user?.username?.[0]?.toUpperCase() || '?';

  const roleColor = user?.role ? roleColors[user.role] || '#a435f0' : '#a435f0';

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: 'width 0.2s, margin 0.2s',
      }}
    >
      <Toolbar sx={{ gap: 2, px: { xs: 1.5, md: 3 } }}>
        {/* Mobile hamburger */}
        <IconButton
          aria-label="toggle sidebar"
          onClick={onDrawerToggle}
          sx={{ display: { md: 'none' }, color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo (visible on mobile) */}
        <Box
          onClick={() => navigate('/dashboard')}
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            mr: 1,
          }}
        >
          <SchoolIcon sx={{ color: designTokens.colors.primary, fontSize: 26 }} />
          <Typography sx={{ fontWeight: 800, fontSize: '16px', color: '#1c1d1f' }}>
            Namm<span style={{ color: designTokens.colors.primary }}>Academy</span>
          </Typography>
        </Box>

        {/* Search bar — center-dominant, full width */}
        <Box sx={{ flexGrow: 1, maxWidth: 680, mx: 'auto' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#f7f9fa',
              border: '1px solid #d1d7dc',
              borderRadius: '999px',
              px: 2,
              py: 0.5,
              transition: 'border-color 0.15s, box-shadow 0.15s',
              '&:focus-within': {
                borderColor: designTokens.colors.primary,
                boxShadow: `0 0 0 3px ${designTokens.colors.primaryLight}`,
              },
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
            <InputBase
              fullWidth
              placeholder="Search for anything..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={handleSearch}
              sx={{ fontSize: '14px', '& input': { py: 0.5 } }}
              inputProps={{ 'aria-label': 'search courses' }}
            />
          </Box>
        </Box>

        {/* Right Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={() => navigate('/notifications')}
              sx={{ color: 'text.primary' }}
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon sx={{ fontSize: 22 }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Avatar + dropdown */}
          <Tooltip title="Account menu">
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: roleColor,
                  fontSize: '13px',
                  fontWeight: 700,
                  border: `2px solid ${roleColor}22`,
                }}
              >
                {avatarInitials}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Account Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            elevation: 3,
            sx: {
              minWidth: 220,
              borderRadius: 2,
              mt: 0.5,
              border: '1px solid #d1d7dc',
              overflow: 'visible',
            },
          }}
        >
          {/* User info header */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {user?.full_name || user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {user?.email}
            </Typography>
            <Box
              sx={{
                mt: 0.5,
                display: 'inline-block',
                bgcolor: `${roleColor}18`,
                color: roleColor,
                px: 1,
                py: 0.2,
                borderRadius: 1,
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              {user?.role}
            </Box>
          </Box>
          <Divider />
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/my-learning'); }} sx={{ gap: 1.5 }}>
            <PlayCircleIcon fontSize="small" sx={{ color: 'text.secondary' }} /> My Learning
          </MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }} sx={{ gap: 1.5 }}>
            <PersonIcon fontSize="small" sx={{ color: 'text.secondary' }} /> Profile
          </MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }} sx={{ gap: 1.5 }}>
            <SettingsIcon fontSize="small" sx={{ color: 'text.secondary' }} /> Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: 'error.main' }}>
            <LogoutIcon fontSize="small" /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
