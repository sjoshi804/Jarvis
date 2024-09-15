// src/components/Task/TaskForm.tsx

import React, { useState } from 'react';
import { createTask } from '../../services/api';
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/lab'; // Ensure you're using @mui/lab or @mui/x-date-pickers
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Project } from '../../types/types';
import { TextFieldProps } from '@mui/material/TextField'; // Import TextFieldProps for typing

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

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
    } catch (error) {
      console.error('Error creating task:', error);
    }
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
        onChange={(e) => setEstimatedTime(parseInt(e.target.value, 10))}
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
          onChange={(newValue: Date | null) => setDueDate(newValue)} // Added type annotation
          renderInput={(params: TextFieldProps) => ( // Added type annotation
            <TextField {...params} required fullWidth margin="normal" />
          )}
        />
      </LocalizationProvider>
      <Button type="submit" variant="contained" color="primary">
        Add Task
      </Button>
    </Box>
  );
};

export default TaskForm;
