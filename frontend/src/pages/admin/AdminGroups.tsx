import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Tooltip,
  Alert,
  Stack
} from '@mui/material';
import { Plus, Users, MoreVertical, UserPlus, BookOpen } from 'lucide-react';
import api from '../../services/api';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchGroups } from '../../store/slices/groupSlice';
import { designTokens } from '../../theme/designTokens';

const AdminGroups: React.FC = () => {
  const dispatch = useAppDispatch();
  const { groups, loading, error: reduxError } = useAppSelector((state) => state.groups);

  const [openCreate, setOpenCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleCreateGroup = async () => {
    if (!newName) return;
    setLocalError(null);
    try {
      await api.post('/groups/', null, {
        params: { name: newName, description: newDesc }
      });
      setOpenCreate(false);
      setNewName('');
      setNewDesc('');
      dispatch(fetchGroups());
    } catch (err: any) {
      console.error('Failed to create group', err);
      setLocalError(err.response?.data?.detail || 'Failed to create group');
    }
  };

  const displayedError = localError || reduxError;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Group Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organize students into batches and manage bulk enrollments.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setOpenCreate(true)}
          sx={{ px: 3, fontWeight: 700 }}
        >
          Create New Group
        </Button>
      </Box>

      {displayedError && <Alert severity="error" sx={{ mb: 4, borderRadius: 1 }}>{displayedError}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ border: `1px solid ${designTokens.colors.border}` }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Group Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.length > 0 ? groups.map((group) => (
                <TableRow key={group.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        p: 1,
                        bgcolor: designTokens.colors.primaryLight,
                        borderRadius: 1,
                        color: designTokens.colors.primary,
                        display: 'flex'
                      }}>
                        <Users size={18} />
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {group.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {group.description || 'No description provided.'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(group.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Add Members">
                        <IconButton size="small"><UserPlus size={18} /></IconButton>
                      </Tooltip>
                      <Tooltip title="Bulk Enroll">
                        <IconButton size="small" color="primary"><BookOpen size={18} /></IconButton>
                      </Tooltip>
                      <IconButton size="small"><MoreVertical size={18} /></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                    <Users size={48} color={designTokens.colors.border} style={{ marginBottom: 16 }} />
                    <Typography variant="body1" color="text.secondary">
                      No groups found. Create your first batch to get started!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Group Dialog */}
      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, px: 3, pt: 3 }}>Create New Group</DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Group Name"
              fullWidth
              variant="outlined"
              value={newName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
              placeholder="e.g. Summer Batch 2024"
              autoFocus
            />
            <TextField
              label="Description (Optional)"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={newDesc}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDesc(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setOpenCreate(false)} variant="text" color="inherit" sx={{ fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateGroup}
            disabled={!newName}
            sx={{ fontWeight: 700, px: 3 }}
          >
            Create Group
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminGroups;
