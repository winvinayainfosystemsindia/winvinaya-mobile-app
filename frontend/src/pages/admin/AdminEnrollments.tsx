import React, { useState, useEffect } from 'react';
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
  IconButton,
  Tooltip,
  CircularProgress,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Calendar, ShieldAlert, History } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

interface Enrollment {
  id: number;
  user: {
    id: number;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  course: {
    id: number;
    title: string;
  };
  status: string;
  enrolled_at: string;
  expiry_date?: string;
}

const AdminEnrollments: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [newExpiry, setNewExpiry] = useState('');

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/enrollments/admin/all');
      setEnrollments(response.data);
    } catch (err) {
      console.error('Failed to fetch enrollments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleUpdateExpiry = async () => {
    if (!selectedEnrollment || !newExpiry) return;
    try {
      await axios.patch(`/api/v1/enrollments/admin/${selectedEnrollment.id}/expiry`, null, {
        params: { expiry_date: new Date(newExpiry).toISOString() }
      });
      setSelectedEnrollment(null);
      fetchEnrollments();
    } catch (err) {
      console.error('Failed to update expiry', err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Enrollment Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor student progress and manage course access timelines.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Expiry</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enrollments.map((enr) => (
                <TableRow key={enr.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={enr.user.avatar_url} sx={{ width: 32, height: 32 }}>
                        {enr.user.full_name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {enr.user.full_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {enr.user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{enr.course.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={enr.status} 
                      size="small" 
                      color={enr.status === 'active' ? 'success' : 'default'}
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    {enr.expiry_date ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: new Date(enr.expiry_date) < new Date() ? 'error.main' : 'text.primary' }}>
                        <Typography variant="body2">
                          {format(new Date(enr.expiry_date), 'MMM dd, yyyy')}
                        </Typography>
                        {new Date(enr.expiry_date) < new Date() && <ShieldAlert size={14} />}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Lifetime</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Update Expiry">
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setSelectedEnrollment(enr);
                          setNewExpiry(enr.expiry_date ? format(new Date(enr.expiry_date), "yyyy-MM-dd'T'HH:mm") : '');
                        }}
                      >
                        <Calendar size={18} />
                      </IconButton>
                    </Tooltip>
                    <IconButton size="small"><History size={18} /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Update Expiry Dialog */}
      <Dialog open={!!selectedEnrollment} onClose={() => setSelectedEnrollment(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Update Access Expiry</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, minWidth: 300 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Set a new expiry date for <strong>{selectedEnrollment?.user.full_name}</strong> in the course <strong>{selectedEnrollment?.course.title}</strong>.
            </Typography>
            <TextField
              type="datetime-local"
              fullWidth
              value={newExpiry}
              onChange={(e) => setNewExpiry(e.target.value)}
              InputLabelProps={{ shrink: true }}
              label="Expiry Date & Time"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setSelectedEnrollment(null)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleUpdateExpiry}>Save Expiry</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminEnrollments;
