import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Tooltip,
  IconButton,
  CircularProgress,
  Stack
} from '@mui/material';
import { MoreVertical, Edit, Shield, User as UserIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUsers } from '../../store/slices/userSlice';
import { format } from 'date-fns';
import { designTokens } from '../../theme/designTokens';

const AdminUsers: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return designTokens.colors.accentWarm;
      case 'teacher': return designTokens.colors.primary;
      case 'manager': return designTokens.colors.accent;
      default: return designTokens.colors.textSecondary;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all students, teachers, and administrative staff accounts.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ border: `1px solid ${designTokens.colors.border}` }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        src={user.avatar_url}
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: designTokens.colors.primaryLight,
                          color: designTokens.colors.primary,
                          fontWeight: 700,
                          fontSize: '14px'
                        }}
                      >
                        {user.full_name?.[0] || user.username?.[0] || '?'}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                          {user.full_name || user.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display="block">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={user.role === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                      label={user.role?.toUpperCase()}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 700,
                        fontSize: '11px',
                        color: getRoleColor(user.role),
                        borderColor: `${getRoleColor(user.role)}44`,
                        bgcolor: `${getRoleColor(user.role)}11`
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {user.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : 'Unknown'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_active ? 'Active' : 'Deactivated'}
                      size="small"
                      sx={{
                        fontSize: '11px',
                        fontWeight: 700,
                        bgcolor: user.is_active ? `${designTokens.colors.success}18` : '#f0f0f0',
                        color: user.is_active ? designTokens.colors.success : 'text.secondary'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Edit Permissions">
                        <IconButton size="small"><Edit size={16} /></IconButton>
                      </Tooltip>
                      <IconButton size="small"><MoreVertical size={16} /></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <Typography color="text.secondary">No users found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminUsers;
