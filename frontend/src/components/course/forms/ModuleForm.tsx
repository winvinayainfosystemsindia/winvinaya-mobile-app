import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import type { Module } from '../../../models/course';

interface ModuleFormProps {
  open: boolean;
  onClose: () => void;
  module: Module | null;
  onChange: (updates: Partial<Module>) => void;
  onSave: () => void;
  saving?: boolean;
}

const ModuleForm: React.FC<ModuleFormProps> = ({ open, onClose, module, onChange, onSave, saving }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{module?.id ? 'Edit Section' : 'New Section'}</DialogTitle>
      <DialogContent>
        <TextField 
          autoFocus 
          fullWidth 
          label="Section Title" 
          sx={{ mt: 2 }} 
          value={module?.title || ''} 
          onChange={e => onChange({ title: e.target.value })} 
          disabled={saving}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={onSave} 
          disabled={saving || !module?.title?.trim()}
          sx={{ bgcolor: '#a435f0', '&:hover': { bgcolor: '#8710d8' } }}
        >
          {saving ? 'Saving...' : 'Save Section'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModuleForm;
