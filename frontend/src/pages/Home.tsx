import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useAppDispatch } from '../store/hooks';
import { fetchCourses } from '../store/slices/courseSlice';

// Modular Sections
import Hero from '../components/home/Hero';
import ExploreDisciplines from '../components/home/ExploreDisciplines';
import TrendingKnowledge from '../components/home/TrendingKnowledge';
import PersonalizedPath from '../components/home/PersonalizedPath';
import Faculty from '../components/home/Faculty';
import HomeCTA from '../components/home/HomeCTA';
import HomeFooter from '../components/home/HomeFooter';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  return (
    <Box>
      <Hero />
      <ExploreDisciplines />
      <TrendingKnowledge />
      <PersonalizedPath />
      <Faculty />
      <HomeCTA />
      <HomeFooter />
    </Box>
  );
};

export default Home;
