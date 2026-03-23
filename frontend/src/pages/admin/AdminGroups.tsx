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
  Alert
} from '@mui/material';
import { 
  Plus, 
  Users, 
  MoreVertical, 
  UserPlus, 
  BookOpen
} from 'lucide-react';
import api from '../../services/api';

interface Group {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

const AdminGroups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await api.get('/groups/');
      setGroups(response.data);
    } catch (err) {
      console.error('Failed to fetch groups', err);
      setError('Could not load groups. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    if (!newName) return;
    try {
      await api.post('/groups/', null, {
        params: { name: newName, description: newDesc }
      });
      setOpenCreate(false);
      setNewName('');
      setNewDesc('');
      fetchGroups();
    } catch (err) {
      console.error('Failed to create group', err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
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
          sx={{ borderRadius: 2, px: 3, py: 1.5, textTransform: 'none', fontWeight: 600 }}
        >
          Create New Group
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Group Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.length > 0 ? groups.map((group) => (
                <TableRow key={group.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 1.5, color: '#fff', display: 'flex' }}>
                        <Users size={18} />
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {group.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {group.description || 'No description provided.'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(group.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Add Members">
                      <IconButton size="small"><UserPlus size={18} /></IconButton>
                    </Tooltip>
                    <Tooltip title="Bulk Enroll">
                      <IconButton size="small" color="primary"><BookOpen size={18} /></IconButton>
                    </Tooltip>
                    <IconButton size="small"><MoreVertical size={18} /></IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                    <Users size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
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
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Group</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Group Name"
              fullWidth
              value={newName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
              placeholder="e.g. Summer Batch 2024"
            />
            <TextField
              label="Description (Optional)"
              fullWidth
              multiline
              rows={3}
              value={newDesc}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDesc(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenCreate(false)} color="inherit">Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateGroup} 
            disabled={!newName}
          >
            Create Group
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminGroups;
