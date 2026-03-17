import React from 'react';
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


const Dashboard: React.FC = () => {
	const [tabValue, setTabValue] = React.useState(0);

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	// Mock enrolled courses
	const enrolledCourses = [
		{
			id: 1,
			title: 'Complete Web Design: from Figma to Webflow to Freelancing',
			instructor: 'Vako Shvili',
			thumbnail: 'https://img-c.udemycdn.com/course/240x135/2461502_6891_10.jpg',
			rating: 4.8,
			reviewsCount: 12450,
			progress: 35,
			category: 'Web Development'
		},
		{
			id: 2,
			title: 'The Full Stack Web Development Bootcamp 2024',
			instructor: 'Angela Yu',
			thumbnail: 'https://img-c.udemycdn.com/course/240x135/1565838_e54e_18.jpg',
			rating: 4.7,
			reviewsCount: 320120,
			progress: 15,
			category: 'Development'
		},
		{
			id: 3,
			title: 'Advanced React Design Patterns and Performance',
			instructor: 'Maximilian Schwarzmüller',
			thumbnail: 'https://img-c.udemycdn.com/course/240x135/1362070_b9a1_2.jpg',
			rating: 4.6,
			reviewsCount: 8400,
			progress: 78,
			category: 'React'
		},
		{
			id: 4,
			title: 'User Experience Design Essentials - Adobe XD UI UX Design',
			instructor: 'Daniel Walter Scott',
			thumbnail: 'https://img-c.udemycdn.com/course/240x135/1109026_555f_5.jpg',
			rating: 4.8,
			reviewsCount: 45600,
			progress: 100,
			category: 'Design'
		}
	];

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
							{enrolledCourses.map((course) => (
								<Grid size={{ xs: 12, sm: 6, md: 3 }} key={course.id}>
									<CourseCard
										title={course.title}
										instructor={course.instructor}
										thumbnail={course.thumbnail}
										rating={course.rating}
										reviewsCount={course.reviewsCount}
										progress={course.progress}
										category={course.category}
									/>
								</Grid>
							))}
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
