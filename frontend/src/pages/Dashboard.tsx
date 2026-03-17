import React from 'react';
import {
	Grid,
	Paper,
	Typography,
	Box,
	Card,
	CardContent,
	Divider,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Button
} from '@mui/material';
import {
	People as PeopleIcon,
	School as SchoolIcon,
	Assignment as AssignmentIcon,
	TrendingUp as TrendingUpIcon,
	Event as EventIcon,
	ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import StatCard from '../components/common/StatCard';
import { useAppSelector } from '../store/hooks';

const Dashboard: React.FC = () => {
	const { user } = useAppSelector((state) => state.auth);

	// Mock data for the dashboard
	const stats = [
		{ title: 'Total Candidates', value: '1,284', icon: <PeopleIcon />, color: '#007eb9' },
		{ title: 'Active Batches', value: '12', icon: <SchoolIcon />, color: '#ec7211' },
		{ title: 'Open Allocations', value: '45', icon: <AssignmentIcon />, color: '#1d8102' },
		{ title: 'Placement Rate', value: '82%', icon: <TrendingUpIcon />, color: '#6fb327' },
	];

	const recentActivities = [
		{ id: 1, text: 'New candidate registration: John Doe', time: '2 hours ago' },
		{ id: 2, text: 'Batch "Web Development A" started', time: '5 hours ago' },
		{ id: 3, text: 'Interview scheduled for Jane Smith', time: '1 day ago' },
		{ id: 4, text: 'New assessment report generated', time: '2 days ago' },
	];

	return (
		<Box sx={{ flexGrow: 1 }}>
			<Box sx={{ mb: 4 }}>
				<Typography variant="h4" gutterBottom sx={{ fontWeight: 300 }}>
					Welcome back, {user?.email?.split('@')[0]}
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Here's what's happening in WinVinaya today.
				</Typography>
			</Box>

			<Grid container spacing={3}>
				{/* Stats Cards */}
				{stats.map((stat, index) => (
					<Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
						<StatCard
							title={stat.title}
							value={stat.value}
							icon={stat.icon}
							color={stat.color}
						/>
					</Grid>
				))}

				{/* Recent Activity */}
				<Grid size={{ xs: 12, sm: 8, md: 3 }}>
					<Paper sx={{ p: 0, borderRadius: 1, border: '1px solid #d5dbdb' }} elevation={0}>
						<Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<Typography variant="h6">Recent Activity</Typography>
							<Button size="small" endIcon={<ArrowForwardIcon />}>View All</Button>
						</Box>
						<Divider />
						<List sx={{ pt: 0 }}>
							{recentActivities.map((activity, index) => (
								<React.Fragment key={activity.id}>
									<ListItem sx={{ py: 1.5 }}>
										<ListItemIcon sx={{ minWidth: 40 }}>
											<Box sx={{
												width: 8,
												height: 8,
												borderRadius: '50%',
												bgcolor: index === 0 ? 'primary.main' : 'divider'
											}} />
										</ListItemIcon>
										<ListItemText
											primary={activity.text}
											secondary={activity.time}
											primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
											secondaryTypographyProps={{ variant: 'caption' }}
										/>
									</ListItem>
									{index < recentActivities.length - 1 && <Divider component="li" sx={{ ml: 5 }} />}
								</React.Fragment>
							))}
						</List>
					</Paper>
				</Grid>

				{/* Quick Actions / Info */}
				<Grid size={{ xs: 12, sm: 4, md: 3 }}>
					<Card sx={{ height: '100%', borderRadius: 1, border: '1px solid #d5dbdb' }} elevation={0}>
						<CardContent>
							<Typography variant="h6" gutterBottom>Upcoming Events</Typography>
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
								<Box sx={{ display: 'flex', gap: 2 }}>
									<Box sx={{
										p: 1,
										bgcolor: 'rgba(236, 114, 17, 0.1)',
										color: 'primary.main',
										borderRadius: 1,
										textAlign: 'center',
										minWidth: 50
									}}>
										<Typography variant="caption" display="block">MAR</Typography>
										<Typography variant="h6" lineHeight={1}>20</Typography>
									</Box>
									<Box>
										<Typography variant="body2" fontWeight={700}>Trainer Meeting</Typography>
										<Typography variant="caption" color="text.secondary">10:00 AM - 11:30 AM</Typography>
									</Box>
								</Box>
								<Box sx={{ display: 'flex', gap: 2 }}>
									<Box sx={{
										p: 1,
										bgcolor: 'rgba(0, 126, 185, 0.1)',
										color: '#007eb9',
										borderRadius: 1,
										textAlign: 'center',
										minWidth: 50
									}}>
										<Typography variant="caption" display="block">MAR</Typography>
										<Typography variant="h6" lineHeight={1}>22</Typography>
									</Box>
									<Box>
										<Typography variant="body2" fontWeight={700}>Candidate Enrollment</Typography>
										<Typography variant="caption" color="text.secondary">09:00 AM - 05:00 PM</Typography>
									</Box>
								</Box>
							</Box>
							<Button
								fullWidth
								variant="outlined"
								startIcon={<EventIcon />}
								sx={{ mt: 3 }}
							>
								View Calendar
							</Button>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Dashboard;
