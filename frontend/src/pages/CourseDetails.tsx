import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

// Modular Components
import {
    CourseHeroBanner,
    WhatYouLearn,
    CourseContentAccordion,
    CourseDescription,
    InstructorCard,
    StudentReviews,
    CourseSidebarCard
} from '../components/courseDetails';

const CourseDetails: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    console.log('Viewing course:', courseId);

    // Mock Data (To be replaced with real API data)
    const mockCourse = {
        title: 'Advanced Quantum Computing: Algorithms and Architecture',
        subtitle: 'Master the principles of quantum mechanics applied to computing. Build complex algorithms from scratch and understand the future of processing.',
        breadcrumbs: [
            { label: 'Computer Science', path: '/catalog' },
            { label: 'Web Development', path: '/catalog' }
        ],
        rating: 4.9,
        ratingCount: 12650,
        studentsEnrolled: 45892,
        instructor: {
            name: 'Dr. Aris Thorne',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
            title: 'PhD in Theoretical Physics, MIT • Senior Quantum Architect',
            rating: 4.9,
            totalStudents: '125,400',
            totalCourses: 12,
            bio: 'Dr. Thorne has spent two decades at the intersection of quantum hardware and software. She has published over 50 papers on quantum error correction and currently consults for leading tech firms.'
        },
        previewThumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
        price: '$89.99',
        originalPrice: '$199.99',
        learningOutcomes: [
            'Master the core principles of Qubits and Superposition.',
            'Understand Quantum Error Correction and Hardware Architectures.',
            'Build a full-stack Quantum Portfolio ready for the industry.',
            'Design and simulate Shor\'s and Grover\'s algorithms.',
            'Integrate quantum circuits with classical API layers.'
        ],
        modules: [
            {
                title: 'Module 1: Foundations of Quantum Information',
                lectureCount: 8,
                duration: '45m',
                lessons: [
                    { id: '1', title: 'Introduction to Quantum Mechanics', type: 'video' as const, meta: '12:45' },
                    { id: '2', title: 'Mathematical Preliminaries', type: 'reading' as const, meta: '10 pages' },
                    { id: '3', title: 'The Concept of a Qubit', type: 'video' as const, meta: '15:20' }
                ]
            },
            {
                title: 'Module 2: Quantum Logic Gates and Circuits',
                lectureCount: 12,
                duration: '1h 20m',
                lessons: [
                    { id: '4', title: 'Single Qubit Gates', type: 'video' as const, meta: '18:10' },
                    { id: '5', title: 'Multi-Qubit Entanglement', type: 'video' as const, meta: '22:30' }
                ]
            },
            {
                title: 'Module 3: Universal Quantum Algorithms',
                lectureCount: 15,
                duration: '3h 15m',
                lessons: [
                    { id: '6', title: "Understanding Grover's Search Algorithm", type: 'video' as const, meta: '15:30' },
                    { id: '7', title: 'Handout: Algorithm Worksheets', type: 'attachment' as const, meta: '4 pages' }
                ]
            }
        ],
        description: `Quantum computing is no longer a theoretical abstraction; it is a burgeoning field of engineering and computer science. This course is designed to take you from a curious enthusiast to a practitioner capable of designing complex quantum circuits.

        We begin by dismantling the classical bit and rebuilding your understanding of information through qubits. You will not only learn the math but also how to implement these concepts using modern SDKs like Qiskit and Cirq.
        
        The course covers both high-level algorithmic design and the low-level physical constraints of NISQ (Noisy Intermediate-Scale Quantum) devices. By the end, you'll have a portfolio of projects demonstrating your ability to tackle real-world problems.`,
        ratingBreakdown: [
            { stars: 5, percent: 85 },
            { stars: 4, percent: 10 },
            { stars: 3, percent: 3 },
            { stars: 2, percent: 1 },
            { stars: 1, percent: 1 }
        ]
    };

    return (
        <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh' }}>
            <CourseHeroBanner 
                title={mockCourse.title}
                subtitle={mockCourse.subtitle}
                breadcrumbs={mockCourse.breadcrumbs}
                rating={mockCourse.rating}
                ratingCount={mockCourse.ratingCount}
                studentsEnrolled={mockCourse.studentsEnrolled}
                instructor={mockCourse.instructor}
                previewThumbnail={mockCourse.previewThumbnail}
            />

            <Container maxWidth="lg" sx={{ mt: { xs: 4, md: -10 }, position: 'relative', zIndex: 1, mb: 10 }}>
                <Grid container spacing={4}>
                    {/* Left Column - Content */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <WhatYouLearn learningOutcomes={mockCourse.learningOutcomes} />
                        <CourseContentAccordion modules={mockCourse.modules} />
                        <CourseDescription description={mockCourse.description} />
                        <InstructorCard 
                            name={mockCourse.instructor.name}
                            title={mockCourse.instructor.title}
                            avatar={mockCourse.instructor.avatar}
                            rating={mockCourse.instructor.rating}
                            totalStudents={mockCourse.instructor.totalStudents}
                            totalCourses={mockCourse.instructor.totalCourses}
                            bio={mockCourse.instructor.bio}
                        />
                        <StudentReviews 
                            averageRating={mockCourse.rating}
                            ratingBreakdown={mockCourse.ratingBreakdown}
                        />
                    </Grid>

                    {/* Right Column - Sidebar */}
                    <Grid size={{ xs: 12, md: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                        <CourseSidebarCard 
                            price={mockCourse.price}
                            originalPrice={mockCourse.originalPrice}
                            onEnroll={() => navigate(`/courses/${courseId}/learn`)}
                            onAddToCart={() => console.log('Add to cart')}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default CourseDetails;
