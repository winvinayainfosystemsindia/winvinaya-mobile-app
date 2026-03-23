import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  Divider,
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { menuConfig } from '../router/menuConfig';
import { designTokens } from '../theme/designTokens';

interface SideNavProps {
  onClose?: () => void;
  collapsed?: boolean;
}

// Group nav items into logical sections
const navSections = [
  {
    label: 'Overview',
    paths: ['/dashboard'],
  },
  {
    label: 'Learning',
    paths: ['/catalog', '/my-learning', '/teacher/courses', '/course-builder'],
  },
  {
    label: 'Administration',
    paths: ['/admin/users', '/admin/groups', '/admin/enrollments', '/reports', '/certificates'],
  },
  {
    label: 'Account',
    paths: ['/notifications', '/settings'],
  },
];

const SideNav: React.FC<SideNavProps> = ({ onClose, collapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const userRole = user?.role || 'guest';
  const visibleMenu = menuConfig.filter((item) => item.roles.includes(userRole as any));

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  // Build section → items map
  const sectionItems = navSections.map((section) => ({
    ...section,
    items: visibleMenu.filter((item) => section.paths.includes(item.path)),
  })).filter((s) => s.items.length > 0);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: designTokens.colors.sidebarBg,
        overflow: 'hidden',
      }}
    >
      {/* Brand Logo */}
      <Box
        onClick={() => handleNavigate('/dashboard')}
        sx={{
          height: `${designTokens.spacing.topbarHeight}px`,
          display: 'flex',
          alignItems: 'center',
          px: collapsed ? 2 : 3,
          borderBottom: `1px solid ${designTokens.colors.border}`,
          cursor: 'pointer',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 1,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <SchoolIcon sx={{ color: designTokens.colors.primary, fontSize: 26, flexShrink: 0 }} />
        {!collapsed && (
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '17px',
              color: designTokens.colors.dark,
              letterSpacing: '-0.3px',
              whiteSpace: 'nowrap',
            }}
          >
            Namm<span style={{ color: designTokens.colors.primary }}>Academy</span>
          </Typography>
        )}
      </Box>

      {/* Nav Sections */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 1 }}>
        {sectionItems.map((section, sIdx) => (
          <Box key={section.label}>
            {!collapsed && sIdx > 0 && <Divider sx={{ mx: 2, my: 0.5 }} />}
            {!collapsed && (
              <Typography
                sx={{
                  px: 3,
                  pt: 1.5,
                  pb: 0.5,
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: designTokens.colors.textSecondary,
                }}
              >
                {section.label}
              </Typography>
            )}
            <List disablePadding dense>
              {section.items.map((item) => {
                const active = isActive(item.path);
                const btn = (
                  <ListItem key={item.path} disablePadding>
                    <ListItemButton
                      selected={active}
                      onClick={() => handleNavigate(item.path)}
                      sx={{
                        mx: 1,
                        borderRadius: 1,
                        px: collapsed ? 1.5 : 1.5,
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        borderLeft: active
                          ? `3px solid ${designTokens.colors.primary}`
                          : '3px solid transparent',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: collapsed ? 0 : 38,
                          justifyContent: 'center',
                          color: active ? designTokens.colors.primary : designTokens.colors.textSecondary,
                        }}
                      >
                        <item.icon fontSize="small" />
                      </ListItemIcon>
                      {!collapsed && (
                        <ListItemText
                          primary={item.title}
                          primaryTypographyProps={{
                            fontSize: '14px',
                            fontWeight: active ? 700 : 500,
                            color: active ? designTokens.colors.primary : designTokens.colors.textPrimary,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                );

                return collapsed ? (
                  <Tooltip key={item.path} title={item.title} placement="right">
                    {btn}
                  </Tooltip>
                ) : btn;
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${designTokens.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          {collapsed ? 'v2' : 'NammAcademy v2.0'}
        </Typography>
      </Box>
    </Box>
  );
};

export default SideNav;
