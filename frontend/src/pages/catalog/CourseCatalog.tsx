import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Grid, Chip, CircularProgress,
  Paper, Divider, Stack, Button, FormGroup,
  FormControlLabel, Checkbox, Rating, InputBase,
} from '@mui/material';
import { Search as SearchIcon, FilterList, TuneRounded, School } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchCourses } from '../../store/slices/courseSlice';
import CourseCard from '../../components/common/CourseCard';
import { designTokens } from '../../theme/designTokens';

const LEVELS = ['Beginner', 'Intermediate', 'Expert', 'All Levels'];
const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
];

const CourseCatalog: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { courses, loading } = useAppSelector((state) => state.courses);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [minRating, setMinRating] = useState<number | null>(null);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  useEffect(() => { dispatch(fetchCourses()); }, [dispatch]);

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const filteredCourses = useCallback(() => {
    let result = [...courses];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q)
      );
    }
    if (minRating) result = result.filter(c => (c.rating_avg || 0) >= minRating);
    if (selectedLevels.length) result = result.filter(c => selectedLevels.includes(c.level || 'All Levels'));
    if (selectedSort === 'rating') result.sort((a, b) => (b.rating_avg || 0) - (a.rating_avg || 0));
    if (selectedSort === 'newest') result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    return result;
  }, [courses, searchQuery, minRating, selectedLevels, selectedSort]);

  const results = filteredCourses();

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>Course Catalog</Typography>
        <Typography color="text.secondary">
          Discover {courses.length}+ courses taught by world-class instructors
        </Typography>
      </Box>

      {/* Search bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#fff',
          border: `1.5px solid ${designTokens.colors.border}`,
          borderRadius: '999px',
          px: 2.5,
          py: 1,
          mb: 3,
          maxWidth: 640,
          '&:focus-within': {
            borderColor: designTokens.colors.primary,
            boxShadow: `0 0 0 3px ${designTokens.colors.primaryLight}`,
          },
        }}
      >
        <SearchIcon sx={{ color: 'text.secondary', mr: 1.5 }} />
        <InputBase
          fullWidth
          autoFocus
          placeholder="Search for courses, topics, or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          inputProps={{ 'aria-label': 'search catalog' }}
        />
      </Box>

      {/* Sort bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <TuneRounded sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Sort by:</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {SORT_OPTIONS.map(opt => (
            <Chip
              key={opt.value}
              label={opt.label}
              onClick={() => setSelectedSort(opt.value)}
              variant={selectedSort === opt.value ? 'filled' : 'outlined'}
              sx={{
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                bgcolor: selectedSort === opt.value ? designTokens.colors.primary : 'transparent',
                color: selectedSort === opt.value ? '#fff' : designTokens.colors.textPrimary,
                borderColor: selectedSort === opt.value ? designTokens.colors.primary : designTokens.colors.border,
              }}
            />
          ))}
        </Stack>
        {results.length > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            {results.length} result{results.length !== 1 ? 's' : ''}
          </Typography>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Filter Sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${designTokens.colors.border}`, position: 'sticky', top: 80 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterList sx={{ fontSize: 18 }} />
                <Typography sx={{ fontWeight: 700, fontSize: 15 }}>Filters</Typography>
              </Box>
              {(minRating || selectedLevels.length > 0) && (
                <Button
                  size="small"
                  onClick={() => { setMinRating(null); setSelectedLevels([]); }}
                  sx={{ fontSize: 12, color: designTokens.colors.primary, fontWeight: 700, p: 0, minWidth: 0 }}
                >
                  Clear all
                </Button>
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Rating filter */}
            <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'text.secondary' }}>
              Minimum Rating
            </Typography>
            {[4.5, 4.0, 3.5, 3.0].map(r => (
              <Box
                key={r}
                onClick={() => setMinRating(minRating === r ? null : r)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1, py: 0.5, cursor: 'pointer',
                  color: minRating === r ? designTokens.colors.primary : 'text.primary',
                  '&:hover': { color: designTokens.colors.primary },
                }}
              >
                <Rating value={r} precision={0.5} size="small" readOnly sx={{ color: designTokens.colors.accent }} />
                <Typography variant="body2" sx={{ fontWeight: minRating === r ? 700 : 400 }}>{r}+</Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            {/* Level filter */}
            <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'text.secondary' }}>
              Level
            </Typography>
            <FormGroup>
              {LEVELS.map(level => (
                <FormControlLabel
                  key={level}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedLevels.includes(level)}
                      onChange={() => toggleLevel(level)}
                      sx={{ color: designTokens.colors.border, '&.Mui-checked': { color: designTokens.colors.primary } }}
                    />
                  }
                  label={<Typography variant="body2">{level}</Typography>}
                />
              ))}
            </FormGroup>
          </Paper>
        </Grid>

        {/* Course Grid */}
        <Grid size={{ xs: 12, md: 9 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : results.length === 0 ? (
            <Paper elevation={0} sx={{ p: 8, textAlign: 'center', borderRadius: 3, border: `1px dashed ${designTokens.colors.border}` }}>
              <School sx={{ fontSize: 48, color: '#d1d7dc', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>No courses found</Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filters
              </Typography>
              <Button variant="outlined" sx={{ mt: 2 }} onClick={() => { setSearchQuery(''); setMinRating(null); setSelectedLevels([]); }}>
                Clear filters
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {results.map((course: any) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={course.id}>
                  <CourseCard
                    title={course.title}
                    instructor="WinVinaya Faculty"
                    thumbnail={course.thumbnail_url || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop`}
                    rating={course.rating_avg || 4.5}
                    reviewsCount={course.rating_count || 0}
                    price={course.price}
                    originalPrice={course.price ? Math.round(course.price * 1.6) : undefined}
                    category={course.category}
                    bestSeller={false}
                    onClick={() => navigate(`/courses/${course.public_id}`)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseCatalog;
