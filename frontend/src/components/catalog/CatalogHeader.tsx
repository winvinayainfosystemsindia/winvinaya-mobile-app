import React from 'react';
import { Box, Typography } from '@mui/material';

interface CatalogHeaderProps {
  categoryName: string;
  resultCount: number;
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({ categoryName, resultCount }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 900,
          fontSize: { xs: '2rem', md: '2.75rem' },
          color: '#0f172a',
          letterSpacing: '-0.04em',
          mb: 1
        }}
      >
        {categoryName}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#64748b',
          fontSize: '1.1rem',
          fontWeight: 500
        }}
      >
        {resultCount.toLocaleString()} results showing the best curated paths.
      </Typography>
    </Box>
  );
};

export default CatalogHeader;
