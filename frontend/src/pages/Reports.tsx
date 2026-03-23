import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

const Reports: React.FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Reports & Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track course completions, engagement, and system performance at a glance.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <EmptyState 
          icon={<BarChart />}
          title="Analytics Dashboard Coming Soon"
          subtitle="We're building advanced visualization tools to help you track organizational learning progress."
        />
      </Box>
    </Box>
  );
};

export default Reports;
