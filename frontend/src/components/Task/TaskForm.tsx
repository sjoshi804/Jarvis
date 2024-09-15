// src/components/Task/TaskForm.tsx

import React, { useState } from 'react';
import { createTask } from '../../services/api';
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Project } from '../../types/types';

interface TaskFormProps {
  project: Project;
  onTaskAdded: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ project, onTaskAdded }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [estimatedTime, setEstimatedTime] = useState<number>(1);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      setSnackbar({
        open: true,
        message: 'Please provide all required fields.',
        severity: 'error',
      });
      return;
    }

    try {
      await createTask({
        title,
        description,
        estimatedTime,
        priority,
        dueDate: dueDate.toISOString(),
        project: project._id,
      });
      setTitle('');
      setDescription('');
      setEstimatedTime(1);
      setPriority('medium');
      setDueDate(null);
      onTaskAdded();
      setSnackbar({
        open: true,
        message: 'Task added successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error creating task:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add task. Please try again later.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ marginBottom: '24px' }}>
      <Typography variant="h6" gutterBottom>
        Add New Task
      </Typography>
      <TextField
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={3}
      />
      <TextField
        label="Estimated Time (hours)"
        type="number"
        value={estimatedTime}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          if (!isNaN(value)) {
            setEstimatedTime(value);
          }
        }}
        required
        fullWidth
        margin="normal"
        inputProps={{ min: 1 }}
      />
      <TextField
        label="Priority"
        select
        value={priority}
        onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
        required
        fullWidth
        margin="normal"
      >
        <MenuItem value="high">High</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="low">Low</MenuItem>
      </TextField>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Due Date"
          value={dueDate}
          onChange={(newValue: Date | null) => setDueDate(newValue)}
          // The renderInput prop has been removed
        />
      </LocalizationProvider>
      <Button type="submit" variant="contained" color="primary">
        Add Task
      </Button>

      {/* Snackbar for User Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskForm;
