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
  DialogActions,
  Stack
} from '@mui/material';
import { Calendar, ShieldAlert, History } from 'lucide-react';
import api from '../../services/api';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllEnrollments } from '../../store/slices/enrollmentSlice';
import { type Enrollment } from '../../models/enrollment';
import { designTokens } from '../../theme/designTokens';

const AdminEnrollments: React.FC = () => {
  const dispatch = useAppDispatch();
  const { allEnrollments: enrollments, loading } = useAppSelector((state) => state.enrollments);

  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [newExpiry, setNewExpiry] = useState('');

  useEffect(() => {
    dispatch(fetchAllEnrollments());
  }, [dispatch]);

  const handleUpdateExpiry = async () => {
    if (!selectedEnrollment || !newExpiry) return;
    try {
      await api.patch(`/enrollments/admin/${selectedEnrollment.id}/expiry`, null, {
        params: { expiry_date: new Date(newExpiry).toISOString() }
      });
      setSelectedEnrollment(null);
      dispatch(fetchAllEnrollments());
    } catch (err) {
      console.error('Failed to update expiry', err);
    }
  };

  return (
    <Box>
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
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ border: `1px solid ${designTokens.colors.border}` }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Expiry</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enrollments.map((enr) => (
                <TableRow key={enr.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar 
                        src={enr.user?.avatar_url} 
                        sx={{ 
                          width: 36, 
                          height: 36,
                          bgcolor: designTokens.colors.primaryLight,
                          color: designTokens.colors.primary,
                          fontWeight: 700,
                          fontSize: '14px'
                        }}
                      >
                        {enr.user?.full_name?.[0] || '?'}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                          {enr.user?.full_name || 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display="block">
                          {enr.user?.email || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500, maxWidth: 200 }} noWrap>
                      {enr.course?.title || 'Unknown Course'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={enr.status?.toUpperCase()} 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        fontWeight: 700, 
                        fontSize: '11px',
                        color: enr.status === 'active' ? designTokens.colors.success : designTokens.colors.textSecondary,
                        borderColor: enr.status === 'active' ? `${designTokens.colors.success}44` : designTokens.colors.border,
                        bgcolor: enr.status === 'active' ? `${designTokens.colors.success}11` : 'transparent'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {enr.expiry_date ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2" sx={{ 
                          color: new Date(enr.expiry_date) < new Date() ? designTokens.colors.accentWarm : 'text.primary',
                          fontWeight: new Date(enr.expiry_date) < new Date() ? 700 : 400
                        }}>
                          {format(new Date(enr.expiry_date), 'MMM dd, yyyy')}
                        </Typography>
                        {new Date(enr.expiry_date) < new Date() && <ShieldAlert size={14} color={designTokens.colors.accentWarm} />}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Lifetime Access</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
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
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {enrollments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <Typography color="text.secondary">No enrollments found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Update Expiry Dialog */}
      <Dialog 
        open={!!selectedEnrollment} 
        onClose={() => setSelectedEnrollment(null)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, px: 3, pt: 3 }}>Update Access Expiry</DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          <Box sx={{ pt: 1, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Set a new expiry date for <strong>{selectedEnrollment?.user?.full_name || 'User'}</strong> in the course:
              <br />
              <Typography component="span" variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {selectedEnrollment?.course?.title || 'Course'}
              </Typography>
            </Typography>
            <TextField
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={newExpiry}
              onChange={(e) => setNewExpiry(e.target.value)}
              InputLabelProps={{ shrink: true }}
              label="Expiry Date & Time"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setSelectedEnrollment(null)} variant="text" color="inherit" sx={{ fontWeight: 700 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateExpiry} sx={{ fontWeight: 700, px: 3 }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminEnrollments;
