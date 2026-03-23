import React from 'react';
import { Box, Typography } from '@mui/material';
import { Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';

const Certificates: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          My Certificates
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and download certifications for the courses you've successfully completed.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <EmptyState 
          icon={<Award />}
          title="No Certificates Earned Yet"
          subtitle="You'll receive a verified certificate once you complete 100% of a course."
          ctaLabel="Browse Catalog"
          onCta={() => navigate('/catalog')}
        />
      </Box>
    </Box>
  );
};

export default Certificates;
