import React, { useState } from 'react';
import {
	Container,
	Paper,
	Stepper,
	Step,
	StepLabel,
	Button,
	Typography,
	Box,
	TextField,
	MenuItem,
	Grid,
	Card,
	CardContent,
	IconButton,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Divider,
	FormControlLabel,
	Switch,
	CircularProgress,
	Alert,
	LinearProgress
} from '@mui/material';
import {
	Add as AddIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	VideoLibrary as VideoIcon,
	Description as TextIcon,
	ArrowBack as BackIcon,
	ArrowForward as ForwardIcon,
	Save as SaveIcon,
	CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { courseService, type Course, type Module, type Lesson } from '../services/courseService';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

const steps = ['Course Details', 'Modules', 'Lessons & Topics'];

const AdminCourseCreate: React.FC = () => {
	const navigate = useNavigate();
	const user = useAppSelector((state) => state.auth.user);
	const [activeStep, setActiveStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Course State
	const [course, setCourse] = useState<Partial<Course>>({
		title: '',
		description: '',
		short_description: '',
		category: '',
		level: 'beginner',
		language: 'en',
		is_free: false,
		price: 0,
		modules: []
	});

	// UI State for Dialogs
	const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
	const [currentModule, setCurrentModule] = useState<Partial<Module>>({ title: '', order: 0, lessons: [] });
	const [editingModuleIndex, setEditingModuleIndex] = useState<number | null>(null);

	const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
	const [currentLesson, setCurrentLesson] = useState<Partial<Lesson>>({
		title: '',
		content_type: 'text',
		text_content: '',
		order: 0
	});
	const [editingLessonIndex, setEditingLessonIndex] = useState<{ moduleIndex: number; lessonIndex: number | null } | null>(null);

	// Video Upload State for Wizard
	const [selectedVideos, setSelectedVideos] = useState<{ [key: string]: File }>({}); 
	// key format: "moduleIndex-lessonIdOrTempIndex"

	// Handlers
	const handleNext = () => {
		if (activeStep === 0 && !course.title) {
			setError('Course title is required');
			return;
		}
		setError(null);
		setActiveStep((prev) => prev + 1);
	};

	const handleBack = () => setActiveStep((prev) => prev - 1);

	const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, checked, type } = e.target;
		setCourse((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));
	};

	// Module Handlers
	const handleOpenModuleDialog = (index: number | null = null) => {
		if (index !== null) {
			setCurrentModule(course.modules![index]);
			setEditingModuleIndex(index);
		} else {
			setCurrentModule({ title: '', order: (course.modules?.length || 0) + 1, lessons: [] });
			setEditingModuleIndex(null);
		}
		setModuleDialogOpen(true);
	};

	const handleSaveModule = () => {
		if (!currentModule.title) return;
		
		const updatedModules = [...(course.modules || [])];
		if (editingModuleIndex !== null) {
			updatedModules[editingModuleIndex] = { ...updatedModules[editingModuleIndex], ...currentModule };
		} else {
			updatedModules.push({ ...currentModule, lessons: [] } as Module);
		}
		
		setCourse((prev) => ({ ...prev, modules: updatedModules }));
		setModuleDialogOpen(false);
	};

	const handleDeleteModule = (index: number) => {
		const updatedModules = (course.modules || []).filter((_, i) => i !== index);
		setCourse((prev) => ({ ...prev, modules: updatedModules }));
	};

	// Lesson Handlers
	const handleOpenLessonDialog = (moduleIndex: number, lessonIndex: number | null = null) => {
		if (lessonIndex !== null) {
			setCurrentLesson(course.modules![moduleIndex].lessons[lessonIndex]);
			setEditingLessonIndex({ moduleIndex, lessonIndex });
		} else {
			setCurrentLesson({
				title: '',
				content_type: 'text',
				text_content: '',
				order: (course.modules![moduleIndex].lessons?.length || 0) + 1
			});
			setEditingLessonIndex({ moduleIndex, lessonIndex: null });
		}
		setLessonDialogOpen(true);
	};

	const handleSaveLesson = () => {
		if (!currentLesson.title || editingLessonIndex === null) return;
		
		const { moduleIndex, lessonIndex } = editingLessonIndex;
		const updatedModules = [...(course.modules || [])];
		const lessons = [...updatedModules[moduleIndex].lessons];
		
		if (lessonIndex !== null) {
			lessons[lessonIndex] = { ...lessons[lessonIndex], ...currentLesson } as Lesson;
		} else {
			lessons.push({ ...currentLesson } as Lesson);
		}
		
		updatedModules[moduleIndex].lessons = lessons;
		setCourse((prev) => ({ ...prev, modules: updatedModules }));
		setLessonDialogOpen(false);
	};

	const handleDeleteLesson = (moduleIndex: number, lessonIndex: number) => {
		const updatedModules = [...(course.modules || [])];
		updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
		setCourse((prev) => ({ ...prev, modules: updatedModules }));
	};

	const handleFinalSubmit = async () => {
		setLoading(true);
		setError(null);
		try {
			// 1. Create Course
			const newCourse = await courseService.createCourse({
				...course,
				instructor_id: user?.id
			});
			
			// 2. Add Modules and Lessons
			for (const mod of (course.modules || [])) {
				const savedModule = await courseService.addModule(newCourse.id!, {
					title: mod.title,
					order: mod.order
				});
				
				for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
					const lesson = mod.lessons[lIdx];
					const savedLesson = await courseService.addLesson(savedModule.id!, {
						...lesson,
						module_id: savedModule.id
					});

					// Check for video upload
					const mIdx = (course.modules || []).indexOf(mod);
					const videoKey = `${mIdx}-${lIdx}`;
					if (selectedVideos[videoKey]) {
						setError(`Uploading video for: ${lesson.title}...`);
						await courseService.uploadVideo(
							newCourse.id!,
							savedModule.id!,
							savedLesson.id!,
							selectedVideos[videoKey]
						);
					}
				}
			}
			
			navigate('/dashboard');
		} catch (err: any) {
			setError(err.response?.data?.detail || 'Failed to create course');
		} finally {
			setLoading(false);
		}
	};

	const renderStepContent = (step: number) => {
		switch (step) {
			case 0:
				return (
					<Box sx={{ mt: 3 }}>
						<Grid container spacing={3}>
							<Grid size={12}>
								<TextField
									fullWidth
									label="Course Title"
									name="title"
									value={course.title}
									onChange={handleCourseChange}
									variant="outlined"
									required
								/>
							</Grid>
							<Grid size={12}>
								<TextField
									fullWidth
									label="Short Description"
									name="short_description"
									value={course.short_description}
									onChange={handleCourseChange}
									variant="outlined"
									multiline
									rows={2}
								/>
							</Grid>
							<Grid size={12}>
								<TextField
									fullWidth
									label="Full Description"
									name="description"
									value={course.description}
									onChange={handleCourseChange}
									variant="outlined"
									multiline
									rows={4}
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField
									fullWidth
									select
									label="Level"
									name="level"
									value={course.level}
									onChange={handleCourseChange}
								>
									<MenuItem value="beginner">Beginner</MenuItem>
									<MenuItem value="intermediate">Intermediate</MenuItem>
									<MenuItem value="advanced">Advanced</MenuItem>
								</TextField>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField
									fullWidth
									label="Category"
									name="category"
									value={course.category}
									onChange={handleCourseChange}
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<FormControlLabel
									control={
										<Switch
											checked={course.is_free}
											onChange={handleCourseChange}
											name="is_free"
											color="primary"
										/>
									}
									label="Free Course"
								/>
							</Grid>
							{!course.is_free && (
								<Grid size={{ xs: 12, sm: 6 }}>
									<TextField
										fullWidth
										type="number"
										label="Price (in INR/cents)"
										name="price"
										value={course.price}
										onChange={handleCourseChange}
									/>
								</Grid>
							)}
						</Grid>
					</Box>
				);
			case 1:
				return (
					<Box sx={{ mt: 3 }}>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
							<Typography variant="h6">Modules</Typography>
							<Button startIcon={<AddIcon />} variant="contained" onClick={() => handleOpenModuleDialog()}>
								Add Module
							</Button>
						</Box>
						<List>
							{course.modules?.map((mod, index) => (
								<Paper key={index} sx={{ mb: 2, p: 1 }}>
									<ListItem>
										<ListItemText
											primary={`${index + 1}. ${mod.title}`}
											secondary={`${mod.lessons?.length || 0} Lessons`}
										/>
										<ListItemSecondaryAction>
											<IconButton onClick={() => handleOpenModuleDialog(index)}>
												<EditIcon />
											</IconButton>
											<IconButton onClick={() => handleDeleteModule(index)}>
												<DeleteIcon />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								</Paper>
							))}
							{(!course.modules || course.modules.length === 0) && (
								<Typography color="text.secondary" align="center">No modules added yet.</Typography>
							)}
						</List>
					</Box>
				);
			case 2:
				return (
					<Box sx={{ mt: 3 }}>
						{course.modules?.map((mod, mIndex) => (
							<Card key={mIndex} sx={{ mb: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
								<CardContent>
									<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
										<Typography variant="h6" color="primary">Module {mIndex + 1}: {mod.title}</Typography>
										<Button size="small" startIcon={<AddIcon />} onClick={() => handleOpenLessonDialog(mIndex)}>
											Add Lesson
										</Button>
									</Box>
									<Divider sx={{ mb: 2 }} />
									<List>
										{mod.lessons?.map((lesson, lIndex) => (
											<ListItem key={lIndex} sx={{ borderBottom: '1px solid #f5f5f5' }}>
												<Box sx={{ mr: 2 }}>
													{lesson.content_type === 'video' ? <VideoIcon color="action" /> : <TextIcon color="action" />}
												</Box>
												<ListItemText
													primary={lesson.title}
													secondary={lesson.content_type === 'video' ? 'Video Lesson' : 'Text Lesson'}
												/>
												<ListItemSecondaryAction>
													<IconButton size="small" onClick={() => handleOpenLessonDialog(mIndex, lIndex)}>
														<EditIcon fontSize="small" />
													</IconButton>
													<IconButton size="small" onClick={() => handleDeleteLesson(mIndex, lIndex)}>
														<DeleteIcon fontSize="small" />
													</IconButton>
												</ListItemSecondaryAction>
											</ListItem>
										))}
									</List>
								</CardContent>
							</Card>
						))}
					</Box>
				);
			default:
				return null;
		}
	};

	return (
		<Container maxWidth="md" sx={{ py: 4 }}>
			<Paper elevation={3} sx={{ p: 4, borderRadius: 2, background: 'linear-gradient(to bottom, #ffffff, #fcfcfc)' }}>
				<Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
					Create New Course
				</Typography>
				
				<Stepper activeStep={activeStep} sx={{ mt: 3, mb: 4 }}>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>

				{error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

				{loading && activeStep === steps.length - 1 && (
					<Box sx={{ mb: 3 }}>
						<LinearProgress />
						<Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
							Processing course creation and uploads...
						</Typography>
					</Box>
				)}

				{renderStepContent(activeStep)}

				<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
					<Button
						disabled={activeStep === 0 || loading}
						onClick={handleBack}
						startIcon={<BackIcon />}
					>
						Back
					</Button>
					<Box>
						{activeStep === steps.length - 1 ? (
							<Button
								variant="contained"
								color="primary"
								onClick={handleFinalSubmit}
								disabled={loading || (course.modules?.length || 0) === 0}
								startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
								sx={{ px: 4, py: 1, borderRadius: 2, fontWeight: 600 }}
							>
								{loading ? 'Creating...' : 'Create Course'}
							</Button>
						) : (
							<Button
								variant="contained"
								onClick={handleNext}
								endIcon={<ForwardIcon />}
								sx={{ px: 4, py: 1, borderRadius: 2 }}
							>
								Next
							</Button>
						)}
					</Box>
				</Box>
			</Paper>

			{/* Module Dialog */}
			<Dialog open={moduleDialogOpen} onClose={() => setModuleDialogOpen(false)} fullWidth maxWidth="xs">
				<DialogTitle>{editingModuleIndex !== null ? 'Edit Module' : 'Add Module'}</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						margin="normal"
						label="Module Title"
						value={currentModule.title}
						onChange={(e) => setCurrentModule({ ...currentModule, title: e.target.value })}
						autoFocus
					/>
					<TextField
						fullWidth
						margin="normal"
						type="number"
						label="Order"
						value={currentModule.order}
						onChange={(e) => setCurrentModule({ ...currentModule, order: parseInt(e.target.value) })}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setModuleDialogOpen(false)}>Cancel</Button>
					<Button onClick={handleSaveModule} variant="contained" color="primary">Save</Button>
				</DialogActions>
			</Dialog>

			{/* Lesson Dialog */}
			<Dialog open={lessonDialogOpen} onClose={() => setLessonDialogOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>{editingLessonIndex?.lessonIndex !== null ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						margin="normal"
						label="Lesson Title"
						value={currentLesson.title}
						onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value })}
						autoFocus
					/>
					<TextField
						fullWidth
						select
						margin="normal"
						label="Content Type"
						value={currentLesson.content_type}
						onChange={(e) => setCurrentLesson({ ...currentLesson, content_type: e.target.value as any })}
					>
						<MenuItem value="text">Text Content</MenuItem>
						<MenuItem value="video">Video Upload</MenuItem>
					</TextField>
					
					{currentLesson.content_type === 'text' ? (
						<TextField
							fullWidth
							margin="normal"
							label="Content (Markdown supported)"
							multiline
							rows={6}
							value={currentLesson.text_content}
							onChange={(e) => setCurrentLesson({ ...currentLesson, text_content: e.target.value })}
						/>
					) : (
						<Box sx={{ mt: 2, p: 3, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'center' }}>
							<VideoIcon sx={{ fontSize: 40, color: 'action.active', mb: 1 }} />
							<Typography variant="body2" color="text.secondary">
								Video upload will be supported during the final save step. Please select a file.
							</Typography>
							<input
								type="file"
								accept="video/*"
								style={{ display: 'none' }}
								id="video-wizard-upload"
								onChange={(e) => {
									if (e.target.files && e.target.files[0] && editingLessonIndex) {
										const { moduleIndex, lessonIndex } = editingLessonIndex;
										const key = `${moduleIndex}-${lessonIndex === null ? course.modules![moduleIndex].lessons.length : lessonIndex}`;
										setSelectedVideos({ ...selectedVideos, [key]: e.target.files[0] });
									}
								}}
							/>
							<label htmlFor="video-wizard-upload">
								<Button component="span" variant="outlined" sx={{ mt: 1 }} startIcon={<CloudUploadIcon />}>
									{editingLessonIndex && selectedVideos[`${editingLessonIndex.moduleIndex}-${editingLessonIndex.lessonIndex === null ? course.modules![editingLessonIndex.moduleIndex].lessons.length : editingLessonIndex.lessonIndex}`] 
										? selectedVideos[`${editingLessonIndex.moduleIndex}-${editingLessonIndex.lessonIndex === null ? course.modules![editingLessonIndex.moduleIndex].lessons.length : editingLessonIndex.lessonIndex}`].name 
										: 'Choose Video File'
									}
								</Button>
							</label>
						</Box>
					)}
					
					<TextField
						fullWidth
						margin="normal"
						type="number"
						label="Order"
						value={currentLesson.order}
						onChange={(e) => setCurrentLesson({ ...currentLesson, order: parseInt(e.target.value) })}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setLessonDialogOpen(false)}>Cancel</Button>
					<Button onClick={handleSaveLesson} variant="contained" color="primary">Save</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default AdminCourseCreate;
