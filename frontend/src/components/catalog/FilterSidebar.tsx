import React from 'react';
import { 
  Box, 
  Typography, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Rating, 
  Divider, 
  Stack,
  RadioGroup,
  Radio,
  Button
} from '@mui/material';
import { Star } from '@mui/icons-material';

interface FilterSidebarProps {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  selectedRating: number | null;
  onRatingChange: (rating: number | null) => void;
  selectedLevel: string[];
  onLevelChange: (level: string) => void;
  priceFilter: string;
  onPriceChange: (price: string) => void;
  onClearAll: () => void;
}

const CATEGORIES = [
  'Computer Science',
  'Digital Arts',
  'Business Strategy',
  'Physics & Math',
  'Humanities'
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategories,
  onCategoryChange,
  selectedRating,
  onRatingChange,
  selectedLevel,
  onLevelChange,
  priceFilter,
  onPriceChange,
  onClearAll
}) => {
  return (
    <Box sx={{ pr: { md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', color: '#0f172a' }}>Filters</Typography>
        <Button 
          onClick={onClearAll} 
          sx={{ 
            color: '#0055d1', 
            fontWeight: 700, 
            textTransform: 'none',
            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } 
          }}
        >
          Clear all
        </Button>
      </Box>

      {/* Category Section */}
      <FilterGroup title="Category">
        <FormGroup>
          {CATEGORIES.map((cat) => (
            <FormControlLabel
              key={cat}
              control={
                <Checkbox 
                  size="small" 
                  checked={selectedCategories.includes(cat)}
                  onChange={() => onCategoryChange(cat)}
                  sx={{ color: '#e2e8f0', '&.Mui-checked': { color: '#0055d1' } }}
                />
              }
              label={<Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>{cat}</Typography>}
            />
          ))}
        </FormGroup>
      </FilterGroup>

      <Divider sx={{ my: 3, borderColor: '#f1f5f9' }} />

      {/* Rating Section */}
      <FilterGroup title="Ratings">
        <Stack spacing={1}>
          {[4, 3, 2, 1].map((rating) => (
            <Box 
              key={rating}
              onClick={() => onRatingChange(selectedRating === rating ? null : rating)}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                cursor: 'pointer',
                p: 0.5,
                borderRadius: '8px',
                transition: 'all 0.2s',
                bgcolor: selectedRating === rating ? '#f1f5f9' : 'transparent',
                '&:hover': { bgcolor: '#f8fafc' }
              }}
            >
              <Rating 
                value={rating} 
                readOnly 
                size="small" 
                emptyIcon={<Star sx={{ opacity: 0.3 }} fontSize="inherit" />}
                sx={{ color: '#f59e0b' }}
              />
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                {rating}.0 & Up
              </Typography>
            </Box>
          ))}
        </Stack>
      </FilterGroup>

      <Divider sx={{ my: 3, borderColor: '#f1f5f9' }} />

      {/* Skill Level Section */}
      <FilterGroup title="Skill Level">
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {LEVELS.map((level) => (
            <Button
              key={level}
              onClick={() => onLevelChange(level)}
              variant={selectedLevel.includes(level) ? 'contained' : 'outlined'}
              sx={{
                borderRadius: '100px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '12px',
                px: 2,
                py: 0.8,
                boxShadow: 'none',
                bgcolor: selectedLevel.includes(level) ? '#dae2ff' : 'transparent',
                color: selectedLevel.includes(level) ? '#0040a1' : '#64748b',
                borderColor: '#e2e8f0',
                '&:hover': {
                  bgcolor: selectedLevel.includes(level) ? '#dae2ff' : '#f8fafc',
                  borderColor: '#cbd5e1',
                  boxShadow: 'none'
                }
              }}
            >
              {level}
            </Button>
          ))}
        </Stack>
      </FilterGroup>

      <Divider sx={{ my: 3, borderColor: '#f1f5f9' }} />

      {/* Price Section */}
      <FilterGroup title="Price">
        <RadioGroup value={priceFilter} onChange={(e) => onPriceChange(e.target.value)}>
          <FormControlLabel 
            value="free" 
            control={<Radio size="small" sx={{ color: '#e2e8f0', '&.Mui-checked': { color: '#0055d1' } }} />} 
            label={<Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>Free</Typography>} 
          />
          <FormControlLabel 
            value="paid" 
            control={<Radio size="small" sx={{ color: '#e2e8f0', '&.Mui-checked': { color: '#0055d1' } }} />} 
            label={<Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>Paid</Typography>} 
          />
        </RadioGroup>
      </FilterGroup>

      <Divider sx={{ my: 3, borderColor: '#f1f5f9' }} />

      {/* Duration Section */}
      <FilterGroup title="Duration">
        <FormGroup>
          {['0-2 Hours', '3-6 Hours', '10+ Hours'].map((dur) => (
            <FormControlLabel
              key={dur}
              control={<Checkbox size="small" sx={{ color: '#e2e8f0', '&.Mui-checked': { color: '#0055d1' } }} />}
              label={<Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>{dur}</Typography>}
            />
          ))}
        </FormGroup>
      </FilterGroup>
    </Box>
  );
};

const FilterGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <Box>
    <Typography 
      sx={{ 
        fontWeight: 900, 
        fontSize: '11px', 
        color: '#94a3b8', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        mb: 2 
      }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);

export default FilterSidebar;
