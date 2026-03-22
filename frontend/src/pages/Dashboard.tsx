import React, { useState, useEffect } from 'react';
import {
	Grid,
	Typography,
	Box,
	Container,
	Tabs,
	Tab,
	Button,
	Paper
} from '@mui/material';
import CourseCard from '../components/common/CourseCard';
import { courseService, type Course } from '../services/courseService';


const Dashboard: React.FC = () => {
	const [tabValue, setTabValue] = useState(0);
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState(true);

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const data = await courseService.getCourses();
				setCourses(data);
			} catch (error) {
				console.error('Failed to fetch courses:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchCourses();
	}, []);


	return (
		<Box sx={{ pb: 8 }}>
			{/* Hero / Header Section */}
			<Box sx={{ bgcolor: '#1c1d1f', color: '#ffffff', py: 6, mb: 4 }}>
				<Container maxWidth="lg">
					<Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#ffffff' }}>
						My learning
					</Typography>
					<Tabs 
						value={tabValue} 
						onChange={handleTabChange} 
						textColor="inherit"
						indicatorColor="primary"
						sx={{ 
							'& .MuiTab-root': { 
								fontWeight: 700, 
								minWidth: 0, 
								mr: 4, 
								px: 0,
								fontSize: '1rem',
								color: '#ffffff',
								opacity: 0.7,
								'&.Mui-selected': { opacity: 1 }
							},
							'& .MuiTabs-indicator': { height: 2, bgcolor: '#ffffff' }
						}}
					>
						<Tab label="All courses" />
						<Tab label="My Lists" />
						<Tab label="Wishlist" />
						<Tab label="Archived" />
						<Tab label="Learning tools" />
					</Tabs>
				</Container>
			</Box>

			<Container maxWidth="lg">
				{tabValue === 0 ? (
					<>
						{/* Progress tracking banner */}
						<Paper 
							sx={{ 
								p: 3, 
								mb: 4, 
								borderRadius: 0, 
								border: '1px solid #d1d7dc',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								bgcolor: 'rgba(164, 53, 240, 0.04)'
							}}
							elevation={0}
						>
							<Box>
								<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
									Schedule learning time
								</Typography>
								<Typography variant="body2">
									Learning a little each day adds up. Research shows that students who make time for their studies are 80% more likely to finish their courses.
								</Typography>
							</Box>
							<Button variant="contained" color="secondary" sx={{ ml: 2, whiteSpace: 'nowrap' }}>
								Get started
							</Button>
						</Paper>

						<Grid container spacing={3}>
							{loading ? (
								<Typography sx={{ p: 3 }}>Loading courses...</Typography>
							) : courses.length === 0 ? (
								<Typography sx={{ p: 3 }}>No courses available.</Typography>
							) : (
								courses.map((course) => (
									<Grid size={{ xs: 12, sm: 6, md: 3 }} key={course.id}>
										<CourseCard
											title={course.title}
											instructor={course.instructor_id ? `Instructor ${course.instructor_id}` : 'Unknown Instructor'}
											thumbnail={course.thumbnail_url || 'https://via.placeholder.com/240x135'}
											rating={4.5} // Mock default 
											reviewsCount={0}
											progress={0}
											category={course.category || 'Uncategorized'}
										/>
									</Grid>
								))
							)}
						</Grid>
					</>
				) : (
					<Box sx={{ py: 10, textAlign: 'center' }}>
						<Typography variant="h6">No courses found in this section.</Typography>
						<Button 
							variant="contained" 
							sx={{ mt: 2 }}
							onClick={() => setTabValue(0)}
						>
							Go to All courses
						</Button>
					</Box>
				)}
			</Container>
		</Box>
	);
};

export default Dashboard;
