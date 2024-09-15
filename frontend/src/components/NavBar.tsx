// src/components/NavBar.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Project & Task Manager
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/add-project">
            Add Project
          </Button>
          <Button color="inherit" component={RouterLink} to="/projects">
            Project List
          </Button>
          <Button color="inherit" component={RouterLink} to="/add-task">
            Add Task
          </Button>
          <Button color="inherit" component={RouterLink} to="/tasks">
            Task List
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
