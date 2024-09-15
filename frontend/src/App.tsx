// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import AddProject from './pages/AddProject';
import ProjectListPage from './pages/ProjectListPage';
import AddTask from './pages/AddTask';
import TaskListPage from './pages/TaskListPage';
import { Container, Box } from '@mui/material';

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <Container maxWidth="lg" sx={{ paddingTop: '24px', paddingBottom: '24px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-project" element={<AddProject />} />
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/tasks" element={<TaskListPage />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
