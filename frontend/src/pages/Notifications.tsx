import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Bell } from 'lucide-react';

const Notifications: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Notifications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Stay updated on your courses, assignments, and announcements.
        </Typography>
      </Box>
      <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3, border: '1px dashed #d1d7dc', boxShadow: 'none' }}>
        <Bell size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
        <Typography variant="h6" color="text.secondary">No new notifications</Typography>
      </Paper>
    </Box>
  );
};

export default Notifications;
