import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          System Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure global platform preferences and integrations.
        </Typography>
      </Box>
      <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3, border: '1px dashed #d1d7dc', boxShadow: 'none' }}>
        <SettingsIcon size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
        <Typography variant="h6" color="text.secondary">Settings Panel Coming Soon</Typography>
      </Paper>
    </Box>
  );
};

export default Settings;
