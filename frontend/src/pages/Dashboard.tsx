import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import { useAppSelector } from '../store/hooks';
import { designTokens } from '../theme/designTokens';

// Modular Components
import {
    DashboardHeader,
    MyCourses,
    RecentActivity,
    CertificatesSidebar,
    RecommendedCourses
} from '../components/dashboard';

const Dashboard: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);

    // Mock Data (To be replaced with real API data)
    const mockCourses = [
        {
            id: '1',
            thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
            category: 'COMPUTER SCIENCE',
            title: 'Advanced Systems Architecture & Design',
            progress: 74
        },
        {
            id: '2',
            thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?q=80&w=600&auto=format&fit=crop',
            category: 'DESIGN',
            title: 'Human-Centered Interface Paradigms',
            progress: 32
        }
    ];

    const mockActivities = [
        {
            id: '1',
            type: 'quiz' as const,
            title: 'Completed Quiz: Distributed Systems Fundamentals',
            meta: 'Score: 98/100 • 2 hours ago'
        },
        {
            id: '2',
            type: 'download' as const,
            title: 'New Resource Downloaded: UI Design Pattern Library',
            meta: 'Format: PDF (12.4 MB) • Yesterday'
        },
        {
            id: '3',
            type: 'discussion' as const,
            title: 'Replied to Discussion in "Advanced Calculus"',
            meta: 'Topic: Integral Transforms • 2 days ago'
        }
    ];

    const mockCertificates = [
        {
            id: '1',
            name: 'Data Structures Specialist',
            verifiedDate: 'July 2024'
        },
        {
            id: '2',
            name: 'Ethical Hacking Foundations',
            verifiedDate: 'June 2024'
        }
    ];

    const mockRecommendations = [
        {
            id: '1',
            thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop',
            tag: 'NEW COURSE',
            title: 'Quantum Computing & Cryptography',
            duration: '18h',
            level: 'Advanced'
        },
        {
            id: '2',
            thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=400&auto=format&fit=crop',
            tag: 'BASED ON ACTIVITY',
            title: 'Algorithmic Trading Strategies',
            duration: '24h',
            level: 'Intermediate'
        }
    ];

    return (
        <Box sx={{ bgcolor: designTokens.colors.bg, minHeight: 'calc(100vh - 64px)', py: { xs: 4, md: 8 } }}>
            <Container maxWidth="lg">
                <DashboardHeader 
                    userName={user?.full_name || 'Scholar'} 
                    weeklyGoalPercent={85}
                    onViewSchedule={() => console.log('View Schedule')}
                    onResumeLast={() => console.log('Resume Last Lesson')}
                />

                <Grid container spacing={4}>
                    {/* Main Content Area */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <MyCourses courses={mockCourses} />
                        <RecentActivity activities={mockActivities} />
                    </Grid>

                    {/* Sidebar Area */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <CertificatesSidebar certificates={mockCertificates} />
                        <RecommendedCourses courses={mockRecommendations} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Dashboard;
