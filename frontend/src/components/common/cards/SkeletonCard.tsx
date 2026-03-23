import React from 'react';
import { Card, CardContent, Box, Skeleton } from '@mui/material';

const SkeletonCard: React.FC = () => (
  <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
    <Skeleton variant="rectangular" height={145} animation="wave" />
    <CardContent sx={{ p: 1.5 }}>
      <Skeleton variant="text" width="40%" height={16} sx={{ mb: 0.5 }} animation="wave" />
      <Skeleton variant="text" width="90%" height={20} animation="wave" />
      <Skeleton variant="text" width="70%" height={20} animation="wave" />
      <Skeleton variant="text" width="50%" height={16} sx={{ mb: 1 }} animation="wave" />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Skeleton variant="circular" width={16} height={16} animation="wave" />
        <Skeleton variant="text" width={80} height={16} animation="wave" />
      </Box>
    </CardContent>
  </Card>
);

export default SkeletonCard;
