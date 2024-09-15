// src/components/Project/ProjectForm.tsx
import React, { useState } from 'react';
import { createProject } from '../../services/api';
import {
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';

interface ProjectFormProps {
  onProjectAdded: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onProjectAdded }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createProject({ name, description });
      setName('');
      setDescription('');
      onProjectAdded();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ marginBottom: '24px' }}>
      <Typography variant="h6" gutterBottom>
        Add New Project
      </Typography>
      <TextField
        label="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
      <Button type="submit" variant="contained" color="primary">
        Add Project
      </Button>
    </Box>
  );
};

export default ProjectForm;
