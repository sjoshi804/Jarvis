// src/controllers/projectController.ts
import { Request, Response } from 'express';
import Project, { IProject } from '../models/Project';

// Create a new project
export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const project: IProject = new Project({ name, description, tasks: [] });
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get all projects
export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find().populate('tasks');
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single project by ID
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id).populate('tasks');
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update a project
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    ).populate('tasks');
    if (!updatedProject) return res.status(404).json({ error: 'Project not found' });
    res.json(updatedProject);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
