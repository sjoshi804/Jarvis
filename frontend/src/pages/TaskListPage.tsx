// src/pages/TaskListPage.tsx

import React, { useState, useEffect } from 'react';
import TaskList from '../components/Task/TaskList';
import { Project } from '../types/types';
import { getProjects } from '../services/api';
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';

const TaskListPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await getProjects();
        setProjects(data);
        if (data.length > 0) {
          setSelectedProjectId(data[0]._id); // Automatically select the first project
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to fetch projects. Please try again later.');
      }
      setLoading(false);
    };

    fetchProjects();
  }, [refreshTrigger]);

  const handleProjectChange = (event: SelectChangeEvent<string>) => {
    setSelectedProjectId(event.target.value as string);
  };

  const handleTaskAdded = () => {
    // Refresh the TaskList by toggling refreshTrigger
    setRefreshTrigger(!refreshTrigger);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Task List
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : projects.length === 0 ? (
        <Typography variant="body1">No projects available. Please add a project first.</Typography>
      ) : (
        <>
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-project-label">Select Project</InputLabel>
            <Select
              labelId="select-project-label"
              value={selectedProjectId}
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
          {selectedProjectId && (
            <TaskList
              project={projects.find((p) => p._id === selectedProjectId)!}
              refreshTrigger={refreshTrigger}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default TaskListPage;
