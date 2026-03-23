import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
  CircularProgress,
  Avatar,
  Paper,
} from '@mui/material';
import { ArrowForward, Star, People, MenuBook, EmojiEvents } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchCourses } from '../store/slices/courseSlice';
import CourseCard from '../components/common/CourseCard';
import { designTokens } from '../theme/designTokens';

const CATEGORIES = [
  'Development', 'Business', 'Finance & Accounting', 'IT & Software',
  'Office Productivity', 'Personal Development', 'Design', 'Marketing',
  'Health & Fitness', 'Music', 'Teaching & Academics',
];

const STATS = [
  { icon: <People sx={{ fontSize: 28, color: designTokens.colors.accent }} />, value: '10,000+', label: 'Students enrolled' },
  { icon: <MenuBook sx={{ fontSize: 28, color: designTokens.colors.accent }} />, value: '500+', label: 'Courses available' },
  { icon: <Star sx={{ fontSize: 28, color: designTokens.colors.accent }} />, value: '4.8', label: 'Average rating' },
  { icon: <EmojiEvents sx={{ fontSize: 28, color: designTokens.colors.accent }} />, value: '98%', label: 'Completion rate' },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Software Developer',
    avatar: 'P',
    text: 'NammAcademy completely changed my career. The course quality is exceptional and the instructors are world-class.',
    rating: 5,
  },
  {
    name: 'Rahul Mehta',
    role: 'Data Analyst',
    avatar: 'R',
    text: 'I learned more in 3 weeks here than in a year of self-study. The structured curriculum is exactly what I needed.',
    rating: 5,
  },
  {
    name: 'Divya Nair',
    role: 'UX Designer',
    avatar: 'D',
    text: 'The design courses here are outstanding. Real projects, real feedback, real skills. Highly recommend!',
    rating: 5,
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState('Development');
  const { courses, loading } = useAppSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const featuredCourses = courses.slice(0, 8);

  return (
    <Box sx={{ pb: 8 }}>

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <Box
        sx={{
          bgcolor: designTokens.colors.heroBg,
          color: '#fff',
          py: { xs: 8, md: 10 },
          px: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(135deg, rgba(164,53,240,0.15) 0%, rgba(28,29,31,0) 60%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={4}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '32px', md: '48px' },
                  lineHeight: 1.15,
                  mb: 2,
                  color: '#fff',
                }}
              >
                Learn without limits.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '16px', md: '18px' },
                  color: 'rgba(255,255,255,0.80)',
                  mb: 4,
                  maxWidth: 520,
                  lineHeight: 1.7,
                }}
              >
                Discover skills for your career, taught by real-world experts. Start learning today and join 10,000+ students building their future.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/catalog')}
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: designTokens.colors.primary,
                    px: 4,
                    py: 1.5,
                    fontSize: '16px',
                    fontWeight: 700,
                    '&:hover': { bgcolor: designTokens.colors.primaryDark },
                  }}
                >
                  Explore Courses
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: '#fff',
                    px: 4,
                    py: 1.5,
                    fontSize: '16px',
                    '&:hover': {
                      borderColor: '#fff',
                      bgcolor: 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  Join for Free
                </Button>
              </Stack>
            </Grid>

            {/* Hero visual / illustration */}
            <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Box
                sx={{
                  width: 320,
                  height: 280,
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(12px)',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <EmojiEvents sx={{ fontSize: 60, color: designTokens.colors.accent }} />
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>
                  Start your journey
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center', px: 2 }}>
                  500+ courses • Expert instructors • Certificates
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════ CATEGORY PILLS ═══════════════ */}
      <Box sx={{ bgcolor: '#fff', borderBottom: `1px solid ${designTokens.colors.border}`, py: 2 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
              pb: 0.5,
              '&::-webkit-scrollbar': { height: 4 },
              '&::-webkit-scrollbar-thumb': { bgcolor: '#d1d7dc', borderRadius: 2 },
            }}
          >
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? 'filled' : 'outlined'}
                sx={{
                  flexShrink: 0,
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  bgcolor: selectedCategory === cat ? designTokens.colors.primary : 'transparent',
                  color: selectedCategory === cat ? '#fff' : designTokens.colors.textPrimary,
                  borderColor: selectedCategory === cat ? designTokens.colors.primary : designTokens.colors.border,
                  '&:hover': {
                    bgcolor: selectedCategory === cat ? designTokens.colors.primaryDark : designTokens.colors.primaryLight,
                  },
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 8 }}>

        {/* ═══════════════ FEATURED COURSES ═══════════════ */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                Most Popular Courses
              </Typography>
              <Typography color="text.secondary">
                Top-rated courses trusted by thousands of students
              </Typography>
            </Box>
            <Button
              variant="text"
              onClick={() => navigate('/catalog')}
              endIcon={<ArrowForward />}
              sx={{ fontWeight: 700, color: designTokens.colors.primary, whiteSpace: 'nowrap' }}
            >
              Browse all
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {featuredCourses.length === 0 ? (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>
                    <MenuBook sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6">No courses available yet</Typography>
                  </Box>
                </Grid>
              ) : (
                featuredCourses.map((course: any) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={course.id}>
                    <CourseCard
                      title={course.title}
                      instructor="WinVinaya Faculty"
                      thumbnail={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop'}
                      rating={course.rating_avg || 4.5}
                      reviewsCount={course.rating_count || 0}
                      category={course.category}
                      bestSeller={false}
                      onClick={() => navigate(`/courses/${course.public_id}`)}
                    />
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </Box>

        {/* ═══════════════ STATS BANNER ═══════════════ */}
        <Paper
          elevation={0}
          sx={{
            mb: 8,
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            border: `1px solid ${designTokens.colors.border}`,
            background: `linear-gradient(135deg, ${designTokens.colors.primaryLight} 0%, #fff 100%)`,
          }}
        >
          <Grid container spacing={3} justifyContent="center">
            {STATS.map((stat) => (
              <Grid size={{ xs: 6, md: 3 }} key={stat.label} sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  {stat.icon}
                  <Typography sx={{ fontSize: '28px', fontWeight: 800, color: designTokens.colors.dark }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* ═══════════════ TESTIMONIALS ═══════════════ */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            What our students say
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Real stories from real learners who transformed their careers
          </Typography>
          <Grid container spacing={3}>
            {TESTIMONIALS.map((t) => (
              <Grid size={{ xs: 12, md: 4 }} key={t.name}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    border: `1px solid ${designTokens.colors.border}`,
                    borderRadius: 3,
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    '&:hover': {
                      boxShadow: designTokens.shadows.cardHover,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  {/* Stars */}
                  <Stack direction="row" sx={{ mb: 1.5 }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} sx={{ fontSize: 16, color: designTokens.colors.accent }} />
                    ))}
                  </Stack>
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontStyle: 'italic', color: '#4a4a4a' }}>
                    "{t.text}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: designTokens.colors.primary, width: 36, height: 36, fontSize: '14px', fontWeight: 700 }}>
                      {t.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{t.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{t.role}</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ═══════════════ CTA STRIP ═══════════════ */}
        <Box
          sx={{
            bgcolor: designTokens.colors.dark,
            color: '#fff',
            borderRadius: 3,
            p: { xs: 4, md: 6 },
            textAlign: 'center',
            mb: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(164,53,240,0.2) 0%, transparent 60%)',
              pointerEvents: 'none',
            },
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', mb: 1.5 }}>
            Ready to start learning?
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', mb: 3, fontSize: 16 }}>
            Join thousands of students and take the first step toward your goals.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              bgcolor: designTokens.colors.primary,
              px: 5,
              py: 1.5,
              fontSize: 16,
              fontWeight: 700,
              '&:hover': { bgcolor: designTokens.colors.primaryDark },
            }}
          >
            Get Started — It's Free
          </Button>
        </Box>

      </Container>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <Box
        component="footer"
        sx={{
          bgcolor: designTokens.colors.dark,
          color: 'rgba(255,255,255,0.7)',
          pt: 6,
          pb: 3,
          mt: 4,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <MenuBook sx={{ color: designTokens.colors.primary, fontSize: 22 }} />
                <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>
                  Namm<span style={{ color: designTokens.colors.primary }}>Academy</span>
                </Typography>
              </Box>
              <Typography variant="caption">
                Empowering learners worldwide with quality education.
              </Typography>
            </Grid>
            {[
              { title: 'Platform', links: ['Browse Courses', 'Become Instructor', 'Enterprise', 'Blog'] },
              { title: 'Support', links: ['Help Centre', 'Contact Us', 'Terms of Use', 'Privacy Policy'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Affiliates'] },
            ].map((col) => (
              <Grid size={{ xs: 6, md: 3 }} key={col.title}>
                <Typography sx={{ color: '#fff', fontWeight: 700, mb: 1.5, fontSize: 14 }}>
                  {col.title}
                </Typography>
                {col.links.map((link) => (
                  <Typography
                    key={link}
                    variant="caption"
                    display="block"
                    sx={{
                      mb: 0.75,
                      cursor: 'pointer',
                      '&:hover': { color: '#fff' },
                      transition: 'color 0.15s',
                    }}
                  >
                    {link}
                  </Typography>
                ))}
              </Grid>
            ))}
          </Grid>
          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 3, textAlign: 'center' }}>
            <Typography variant="caption">
              © {new Date().getFullYear()} WinVinaya Infosystems India. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>

    </Box>
  );
};

export default Home;
