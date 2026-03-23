import React from 'react';
import { Paper, Grid, TextField, MenuItem, Button } from '@mui/material';
import { Save } from '@mui/icons-material';
import type { Course } from '../../../models/course';

interface CourseInfoFormProps {
  course: Partial<Course>;
  onChange: (updates: Partial<Course>) => void;
  onSave: () => void;
  saving?: boolean;
}

const CourseInfoForm: React.FC<CourseInfoFormProps> = ({ course, onChange, onSave, saving }) => {
  return (
    <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
      <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField 
              fullWidth 
              label="Course Title" 
              value={course.title || ''} 
              onChange={e => onChange({ title: e.target.value })} 
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField 
              fullWidth 
              multiline 
              rows={4} 
              label="Description" 
              value={course.description || ''} 
              onChange={e => onChange({ description: e.target.value })} 
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField 
              fullWidth 
              label="Category" 
              value={course.category || ''} 
              onChange={e => onChange({ category: e.target.value })} 
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField 
              select 
              fullWidth 
              label="Level" 
              value={course.level || 'beginner'} 
              onChange={e => onChange({ level: e.target.value })}
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button 
              type="submit"
              variant="contained" 
              size="large" 
              startIcon={<Save />} 
              disabled={saving}
              sx={{ bgcolor: '#a435f0', '&:hover': { bgcolor: '#8710d8' } }}
            >
              {saving ? 'Saving...' : 'Save Course Info'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CourseInfoForm;
