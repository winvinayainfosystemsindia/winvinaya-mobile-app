import React from 'react';
import { 
  Box, 
  Select, 
  MenuItem, 
  FormControl, 
  IconButton, 
  Stack
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { 
  GridView as GridViewIcon, 
  ViewList as ViewListIcon 
} from '@mui/icons-material';

interface CatalogToolbarProps {
  sortBy: string;
  onSortChange: (event: SelectChangeEvent) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const CatalogToolbar: React.FC<CatalogToolbarProps> = ({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        mb: 6,
        gap: 2
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <FormControl size="small">
          <Select
            value={sortBy}
            onChange={onSortChange}
            sx={{
              borderRadius: '12px',
              bgcolor: '#ffffff',
              minWidth: 160,
              fontSize: '14px',
              fontWeight: 700,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0055d1' }
            }}
          >
            <MenuItem value="relevant" sx={{ fontSize: '14px', fontWeight: 600 }}>Most Relevant</MenuItem>
            <MenuItem value="newest" sx={{ fontSize: '14px', fontWeight: 600 }}>Newest Arrival</MenuItem>
            <MenuItem value="popular" sx={{ fontSize: '14px', fontWeight: 600 }}>Most Popular</MenuItem>
            <MenuItem value="rating" sx={{ fontSize: '14px', fontWeight: 600 }}>Highest Rated</MenuItem>
          </Select>
        </FormControl>

        <Box 
          sx={{ 
            display: 'flex', 
            bgcolor: '#ffffff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px',
            p: 0.5
          }}
        >
          <IconButton
            size="small"
            onClick={() => onViewModeChange('grid')}
            sx={{
              borderRadius: '8px',
              bgcolor: viewMode === 'grid' ? '#0055d1' : 'transparent',
              color: viewMode === 'grid' ? '#ffffff' : '#94a3b8',
              '&:hover': { bgcolor: viewMode === 'grid' ? '#0055d1' : '#f1f5f9' }
            }}
          >
            <GridViewIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onViewModeChange('list')}
            sx={{
              borderRadius: '8px',
              bgcolor: viewMode === 'list' ? '#0055d1' : 'transparent',
              color: viewMode === 'list' ? '#ffffff' : '#94a3b8',
              '&:hover': { bgcolor: viewMode === 'list' ? '#0055d1' : '#f1f5f9' }
            }}
          >
            <ViewListIcon fontSize="small" />
          </IconButton>
        </Box>
      </Stack>
    </Box>
  );
};

export default CatalogToolbar;
