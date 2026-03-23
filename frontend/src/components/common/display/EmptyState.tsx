import React from 'react';
import { Box, Typography, Button, type SvgIconProps } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material';
import { designTokens } from '../../../theme/designTokens';

interface EmptyStateProps {
  icon?: React.ReactElement<SvgIconProps>;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'Nothing here yet',
  subtitle = 'There is no data to display at this time.',
  ctaLabel,
  onCta,
}) => (
  <Box
    sx={{
      py: 10,
      textAlign: 'center',
      borderRadius: 3,
      border: `1px dashed ${designTokens.colors.border}`,
      bgcolor: designTokens.colors.surface,
    }}
  >
    <Box sx={{ color: '#d1d7dc', mb: 2 }}>
      {icon ? React.cloneElement(icon, { sx: { fontSize: 56, ...(icon.props.sx || {}) } }) : (
        <SentimentDissatisfied sx={{ fontSize: 56 }} />
      )}
    </Box>
    <Typography variant="h6" color="text.secondary" gutterBottom>{title}</Typography>
    {subtitle && (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{subtitle}</Typography>
    )}
    {ctaLabel && onCta && (
      <Button variant="contained" onClick={onCta}>{ctaLabel}</Button>
    )}
  </Box>
);

export default EmptyState;
