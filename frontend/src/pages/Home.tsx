import React from 'react';
import {
	Container,
	Box,
	Typography,
	Button,
	Grid,
	Paper,
	Tabs,
	Tab,
	Stack
} from '@mui/material';
import CourseCard from '../components/common/CourseCard';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
	const navigate = useNavigate();
	const [tabValue, setTabValue] = React.useState(0);

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	// Mock course data for marketplace
	const courses = [
		{
			id: 1,
			title: 'The Complete 2024 Web Development Bootcamp',
			instructor: 'Dr. Angela Yu',
			thumbnail: 'https://img-c.udemycdn.com/course/240x135/1565838_e54e_18.jpg',
			rating: 4.7,
			reviewsCount: 320120,
			price: 3499,
			originalPrice: 12999,
			category: 'Web Development',
			bestSeller: true
		},
		{
			id: 2,
			title: 'Ultimate AWS Certified Solutions Architect Associate',
			instructor: 'Stephane Maarek',
			thumbnail: 'https://img-c.udemycdn.com/course/240x135/2196488_8fc7_10.jpg',
			rating: 4.7,
			reviewsCount: 185000,
			price: 499,
			originalPrice: 3499,
			category: 'IT & Software',
			bestSeller: true
		},
		{
			id: 3,
			title: '100 Days of Code: The Complete Python Pro Bootcamp',
			instructor: 'Dr. Angela Yu',
			thumbnail: 'https://img-c.udemycdn.com/course/240x135/2776760_f176_10.jpg',
			rating: 4.7,
			reviewsCount: 245000,
			price: 3499,
			originalPrice: 12999,
			category: 'Development'
		},
		{
			id: 4,
			title: 'React - The Complete Guide 2024 (incl. Next.js, Redux)',
			instructor: 'Maximilian Schwarzmüller',
			thumbnail: 'https://img-c.udemycdn.com/course/240x135/1362070_b9a1_2.jpg',
			rating: 4.6,
			reviewsCount: 195000,
			price: 449,
			originalPrice: 3899,
			category: 'Web Development'
		}
	];

	return (
		<Box sx={{ pb: 8 }}>
			{/* Hero Section */}
			<Box sx={{ position: 'relative', height: { xs: 300, md: 400 }, mb: 6 }}>
				<Box
					component="img"
					src="/assets/images/hero.jpg"
					sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
				/>
				<Container maxWidth="lg" sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', display: 'flex', alignItems: 'center' }}>
					<Paper
						sx={{
							p: 4,
							maxWidth: 440,
							borderRadius: 0,
							boxShadow: '0 2px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08)',
							display: { xs: 'none', sm: 'block' }
						}}
					>
						<Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontFamily: 'serif' }}>
							Learning that gets you
						</Typography>
						<Typography variant="body1" sx={{ mb: 0 }}>
							Skills for your present (and your future). Get started with us.
						</Typography>
					</Paper>
				</Container>
			</Box>

			<Container maxWidth="lg">
				{/* Broad selection section */}
				<Box sx={{ mb: 8 }}>
					<Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
						A broad selection of courses
					</Typography>
					<Typography variant="h6" sx={{ fontWeight: 400, color: 'text.secondary', mb: 3 }}>
						Choose from over 210,000 online video courses with new additions published every month
					</Typography>

					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						textColor="inherit"
						sx={{
							mb: 4,
							'& .MuiTab-root': {
								fontWeight: 700,
								minWidth: 0,
								mr: 4,
								px: 0,
								fontSize: '1rem',
								color: 'text.secondary',
								textTransform: 'none',
								'&.Mui-selected': { color: '#1c1d1f' }
							},
							'& .MuiTabs-indicator': { height: 2, bgcolor: '#1c1d1f' }
						}}
					>
						<Tab label="Python" />
						<Tab label="Excel" />
						<Tab label="Web Development" />
						<Tab label="JavaScript" />
						<Tab label="Data Science" />
						<Tab label="Amazon AWS" />
						<Tab label="Drawing" />
					</Tabs>

					<Paper sx={{ p: 4, borderRadius: 0, border: '1px solid #d1d7dc', boxShadow: 'none' }}>
						<Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
							Expand your career opportunities with Python
						</Typography>
						<Typography variant="body1" sx={{ mb: 3, maxWidth: 800 }}>
							Take one of Udemy’s range of Python courses and learn how to code using this incredibly useful language. Its simple syntax and readability makes Python perfect for Flask, Django, data science, and financial analysis. Python skills can be applied almost anywhere.
						</Typography>
						<Button
							variant="outlined"
							sx={{
								borderColor: '#1c1d1f',
								color: '#1c1d1f',
								fontWeight: 700,
								borderRadius: 0,
								mb: 4,
								height: 40,
								px: 2,
								'&:hover': { bgcolor: 'rgba(28,29,31,0.04)', borderColor: '#1c1d1f' }
							}}
						>
							Explore Python
						</Button>

						<Grid container spacing={2}>
							{courses.map((course) => (
								<Grid size={{ xs: 12, sm: 6, md: 3 }} key={course.id}>
									<CourseCard
										title={course.title}
										instructor={course.instructor}
										thumbnail={course.thumbnail}
										rating={course.rating}
										reviewsCount={course.reviewsCount}
										price={course.price}
										originalPrice={course.originalPrice}
										category={course.category}
										bestSeller={course.bestSeller}
									/>
								</Grid>
							))}
						</Grid>
					</Paper>
				</Box>

				{/* Categories */}
				<Box sx={{ mb: 8 }}>
					<Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
						Top categories
					</Typography>
					<Grid container spacing={3}>
						{['Design', 'Development', 'Marketing', 'IT and Software', 'Personal Development', 'Business', 'Photography', 'Music'].map((cat) => (
							<Grid size={{ xs: 12, sm: 6, md: 3 }} key={cat}>
								<Paper
									elevation={0}
									sx={{
										p: 0,
										cursor: 'pointer',
										'&:hover img': { transform: 'scale(1.05)' },
										overflow: 'hidden'
									}}
								>
									<Box sx={{ width: '100%', aspectRatio: '1/1', bgcolor: '#f7f9fa', mb: 1, overflow: 'hidden' }}>
										<Box
											component="img"
											src={`https://s.udemycdn.com/home/top-categories/lohp-category-${cat.toLowerCase().replace(/ /g, '-')}-v2.jpg`}
											sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
										/>
									</Box>
									<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{cat}</Typography>
								</Paper>
							</Grid>
						))}
					</Grid>
				</Box>

				{/* Bottom CTA */}
				<Box sx={{ py: 8, textAlign: 'center', bgcolor: '#f7f9fa', mx: -20, px: 20 }}>
					<Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
						Become an instructor
					</Typography>
					<Typography variant="body1" sx={{ mb: 3 }}>
						Instructors from around the world teach millions of students on WinVinaya. We provide the tools and skills to teach what you love.
					</Typography>
					<Button
						variant="contained"
						size="large"
						sx={{ height: 48, px: 4, fontWeight: 700 }}
						onClick={() => navigate('/register')}
					>
						Start teaching today
					</Button>
				</Box>
			</Container>

			{/* Footer Placeholder matching Udemy */}
			<Box sx={{ bgcolor: '#1c1d1f', color: '#ffffff', pt: 8, pb: 4, mt: 0 }}>
				<Container maxWidth="lg">
					<Grid container spacing={4} sx={{ mb: 8 }}>
						<Grid size={{ xs: 6, md: 3 }}>
							<Stack spacing={1}>
								<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>WinVinaya Business</Typography>
								<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Teach on WinVinaya</Typography>
								<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Get the app</Typography>
								<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>About us</Typography>
								<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Contact us</Typography>
							</Stack>
						</Grid>
						<Grid size={{ xs: 6, md: 3 }}>
							<Stack spacing={1}>
								<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Careers</Typography>
								<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Blog</Typography>
								<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Help and Support</Typography>
								<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Affiliate</Typography>
								<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Investors</Typography>
							</Stack>
						</Grid>
						<Grid size={{ xs: 6, md: 3 }}>
							<Stack spacing={1}>
								<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Terms</Typography>
								<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Privacy policy</Typography>
								<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Cookie settings</Typography>
								<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Sitemap</Typography>
								<Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Accessibility statement</Typography>
							</Stack>
						</Grid>
					</Grid>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -1 }}>
							WinVinaya
						</Typography>
						<Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
							© 2024 WinVinaya, Inc.
						</Typography>
					</Box>
				</Container>
			</Box>
		</Box>
	);
};

export default Home;
