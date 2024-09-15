// src/components/Project/ProjectList.tsx
import React, { useEffect, useState } from 'react';
import { getProjects, deleteProject } from '../../services/api';
import { Project } from '../../types/types';
import {
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ProjectListProps {
  onSelect: (project: Project) => void;
  refreshTrigger: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({ onSelect, refreshTrigger }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Projects
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : projects.length === 0 ? (
        <Typography variant="body1">No projects available. Add a new project.</Typography>
      ) : (
        <List>
          {projects.map((project) => (
            <ListItemButton
              key={project._id}
              onClick={() => onSelect(project)}
              sx={{ border: '1px solid #ccc', borderRadius: '4px', marginBottom: '8px' }}
            >
              <ListItemText primary={project.name} secondary={project.description} />
              <IconButton
                edge="end"
                onClick={(e) => { e.stopPropagation(); handleDelete(project._id); }}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </ListItemButton>
          ))}
        </List>
      )}
    </div>
  );
};

export default ProjectList;
