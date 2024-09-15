// src/pages/AddProject.tsx
import React from 'react';
import ProjectForm from '../components/Project/ProjectForm';
import { Typography, Box } from '@mui/material';

const AddProject: React.FC = () => {
  const handleProjectAdded = () => {
    // Optionally, you can add additional actions here after a project is added
    // For example, show a success message or redirect to another page
    alert('Project added successfully!');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Project
      </Typography>
      <ProjectForm onProjectAdded={handleProjectAdded} />
    </Box>
  );
};

export default AddProject;
