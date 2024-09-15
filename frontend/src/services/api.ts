// src/services/api.ts
import axios from 'axios';
import { Project, Task, Schedule } from '../types/types';

// Set the base URL based on your backend's port.
// Assuming backend is running on http://localhost:3000
const API_BASE = 'http://localhost:3001/api';

// Project APIs
export const getProjects = async (): Promise<Project[]> => {
  const response = await axios.get<Project[]>(`${API_BASE}/projects`);
  return response.data;
};

export const createProject = async (project: { name: string; description?: string }): Promise<Project> => {
  const response = await axios.post<Project>(`${API_BASE}/projects`, project);
  return response.data;
};

export const updateProject = async (id: string, project: { name?: string; description?: string }): Promise<Project> => {
  const response = await axios.put<Project>(`${API_BASE}/projects/${id}`, project);
  return response.data;
};

export const deleteProject = async (id: string): Promise<{ message: string }> => {
  const response = await axios.delete<{ message: string }>(`${API_BASE}/projects/${id}`);
  return response.data;
};

// Task APIs
export const getTasks = async (): Promise<Task[]> => {
  const response = await axios.get<Task[]>(`${API_BASE}/tasks`);
  return response.data;
};

export const getTasksByProject = async (projectId: string): Promise<Task[]> => {
  const response = await axios.get<Task[]>(`${API_BASE}/tasks/project/${projectId}`);
  return response.data;
};

export const createTask = async (task: {
  title: string;
  description?: string;
  estimatedTime: number;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  project: string;
}): Promise<Task> => {
  const response = await axios.post<Task>(`${API_BASE}/tasks`, task);
  return response.data;
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
  const response = await axios.put<Task>(`${API_BASE}/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: string): Promise<{ message: string }> => {
  const response = await axios.delete<{ message: string }>(`${API_BASE}/tasks/${id}`);
  return response.data;
};

// Schedule APIs
export const generateSchedule = async (availableHoursPerDay: number): Promise<Schedule> => {
    const response = await axios.post<Schedule>(`${API_BASE}/schedule/generate`, null, {
      params: { availableHoursPerDay },
    });
    return response.data;
  };
  
  export const getCurrentSchedule = async (): Promise<Schedule> => {
    const response = await axios.get<Schedule>(`${API_BASE}/schedule/current`);
    return response.data;
  };
  