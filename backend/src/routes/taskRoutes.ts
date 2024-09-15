// src/routes/taskRoutes.ts
import express from 'express';
import {
  createTask,
  getAllTasks,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController';

const router = express.Router();

// POST /api/tasks - Create a new task
router.post('/', createTask);

// GET /api/tasks - Get all tasks
router.get('/', getAllTasks);

// GET /api/tasks/project/:projectId - Get tasks by project ID
router.get('/project/:projectId', getTasksByProject);

// GET /api/tasks/:id - Get a single task by ID
router.get('/:id', getTaskById);

// PUT /api/tasks/:id - Update a task
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', deleteTask);

export default router;
