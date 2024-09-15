// src/pages/ProjectListPage.tsx
import React, { useState } from 'react';
import ProjectList from '../components/Project/ProjectList';
import { Project } from '../types/types';
import { Typography, Box } from '@mui/material';

const ProjectListPage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

  const handleProjectAdded = () => {
    setRefreshTrigger(!refreshTrigger);
  };

  const handleProjectSelected = (project: Project) => {
    // Optionally, navigate to a project detail page or perform other actions
    alert(`Selected Project: ${project.name}`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Project List
      </Typography>
      <ProjectList onSelect={handleProjectSelected} refreshTrigger={refreshTrigger} />
    </Box>
  );
};

export default ProjectListPage;
