import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Button,
  Container,
  Pagination as MuiPagination
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchCourses } from '../../store/slices/courseSlice';
import CatalogCourseCard from '../../components/catalog/CatalogCourseCard';
import FilterSidebar from '../../components/catalog/FilterSidebar';
import CatalogHeader from '../../components/catalog/CatalogHeader';
import CatalogToolbar from '../../components/catalog/CatalogToolbar';

const CourseCatalog: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { courses, loading } = useAppSelector((state) => state.courses);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedSort, setSelectedSort] = useState('relevant');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Sync searchQuery with URL param 'q'
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleClearAll = () => {
    setSelectedRating(null);
    setSelectedLevels([]);
    setSelectedCategories([]);
    setPriceFilter('all');
    setSearchQuery('');
  };

  const filteredCourses = useCallback(() => {
    let result = [...courses];
    
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q)
      );
    }
    
    // Rating filter
    if (selectedRating) {
      result = result.filter(c => (c.rating_avg || 0) >= selectedRating);
    }
    
    // Level filter
    if (selectedLevels.length > 0) {
      result = result.filter(c => selectedLevels.includes(c.level || 'Beginner'));
    }
    
    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(c => selectedCategories.includes(c.category || ''));
    }

    // Price filter
    if (priceFilter === 'free') result = result.filter(c => c.is_free);
    if (priceFilter === 'paid') result = result.filter(c => !c.is_free);

    // Sorting
    if (selectedSort === 'rating') {
      result.sort((a, b) => (b.rating_avg || 0) - (a.rating_avg || 0));
    } else if (selectedSort === 'newest') {
      result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    } else if (selectedSort === 'popular') {
      result.sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0));
    }
    
    return result;
  }, [courses, searchQuery, selectedRating, selectedLevels, selectedCategories, selectedSort, priceFilter]);

  const results = filteredCourses();

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <CatalogHeader 
          categoryName={
            searchQuery 
              ? `Results for "${searchQuery}"` 
              : selectedCategories.length === 1 
                ? selectedCategories[0] 
                : "Academic Disciplines"
          } 
          resultCount={results.length} 
        />

        <Grid container spacing={6}>
          {/* Sidebar Filters */}
          <Grid size={{ xs: 12, md: 3 }}>
            <FilterSidebar
              selectedCategories={selectedCategories}
              onCategoryChange={toggleCategory}
              selectedRating={selectedRating}
              onRatingChange={setSelectedRating}
              selectedLevel={selectedLevels}
              onLevelChange={toggleLevel}
              priceFilter={priceFilter}
              onPriceChange={setPriceFilter}
              onClearAll={handleClearAll}
            />
          </Grid>

          {/* Main Content Area */}
          <Grid size={{ xs: 12, md: 9 }}>
            <CatalogToolbar
              sortBy={selectedSort}
              onSortChange={(e: SelectChangeEvent) => setSelectedSort(e.target.value as string)}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : results.length === 0 ? (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: { xs: 6, md: 12 }, 
                  textAlign: 'center', 
                  borderRadius: '24px', 
                  border: '2px dashed #e2e8f0',
                  bgcolor: '#f8fafc' 
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#64748b', mb: 1 }}>
                  No courses matched your filters
                </Typography>
                <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>
                  Try adjusting your search or clearing filters to find what you're looking for.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={handleClearAll}
                  sx={{ 
                    bgcolor: '#0055d1', 
                    borderRadius: '12px', 
                    px: 4, 
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 800,
                    '&:hover': { bgcolor: '#0040a1' }
                  }}
                >
                  Clear all filters
                </Button>
              </Paper>
            ) : (
              <>
                <Grid container spacing={4}>
                  {results.map((course) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={course.id}>
                      <CatalogCourseCard
                        id={course.public_id}
                        title={course.title}
                        instructor="Academic Curator"
                        instructorAvatar=""
                        thumbnail={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop'}
                        rating={course.rating_avg || 4.5}
                        reviewsCount={course.rating_count || 120}
                        price={course.price || 0}
                        level={course.level || 'Intermediate'}
                        duration="12.5 Hours" 
                        isBestseller={(course.rating_avg || 0) >= 4.8}
                        isNew={false}
                        onClick={() => navigate(`/courses/${course.public_id}`)}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                  <MuiPagination 
                    count={Math.ceil(results.length / 12) || 1} 
                    color="primary" 
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontWeight: 800,
                        borderRadius: '12px',
                        height: 48,
                        minWidth: 48,
                        fontSize: '1rem'
                      },
                      '& .Mui-selected': {
                        bgcolor: '#0055d1 !important',
                        color: '#ffffff'
                      }
                    }}
                  />
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseCatalog;
