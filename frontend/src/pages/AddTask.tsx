// src/pages/AddTask.tsx

import React, { useState, useEffect } from 'react';
import TaskForm from '../components/Task/TaskForm';
import { Project } from '../types/types';
import { getProjects } from '../services/api';
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent, // Import SelectChangeEvent
} from '@mui/material';

const AddTask: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        if (data.length > 0) {
          setSelectedProject(data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleTaskAdded = () => {
    alert('Task added successfully!');
  };

  const handleProjectChange = (event: SelectChangeEvent<string>) => {
    setSelectedProject(event.target.value as string);
  };
  

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Task
      </Typography>
      {projects.length > 0 ? (
        <>
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-project-label">Select Project</InputLabel>
            <Select
              labelId="select-project-label"
              value={selectedProject}
              label="Select Project"
              onChange={handleProjectChange}
            >
              {projects.map((project) => (
                <MenuItem key={project._id} value={project._id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TaskForm project={projects.find((p) => p._id === selectedProject)!} onTaskAdded={handleTaskAdded} />
        </>
      ) : (
        <Typography variant="body1">No projects available. Please add a project first.</Typography>
      )}
    </Box>
  );
};

export default AddTask;
