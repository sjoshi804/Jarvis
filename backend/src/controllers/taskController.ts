// src/controllers/taskController.ts
import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';
import Project from '../models/Project';

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, estimatedTime, priority, dueDate, project } = req.body;
    
    // Validate project existence
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const task: ITask = new Task({
      title,
      description,
      estimatedTime,
      priority,
      dueDate,
      project,
    });
    const savedTask = await task.save();

    // Add task to the project's task list
    existingProject.tasks.push(savedTask._id);
    await existingProject.save();

    res.status(201).json(savedTask);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get all tasks
export const getAllTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await Task.find().populate('project');
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get tasks by project ID
export const getTasksByProject = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate('project');
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single task by ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('project');
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    res.json(updatedTask);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Remove task from the project's task list
    await Project.findByIdAndUpdate(task.project, { $pull: { tasks: task._id } });

    res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
