// src/routes/projectRoutes.ts
import express from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projectController';

const router = express.Router();

// POST /api/projects - Create a new project
router.post('/', createProject);

// GET /api/projects - Get all projects
router.get('/', getAllProjects);

// GET /api/projects/:id - Get a single project by ID
router.get('/:id', getProjectById);

// PUT /api/projects/:id - Update a project
router.put('/:id', updateProject);

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', deleteProject);

export default router;
