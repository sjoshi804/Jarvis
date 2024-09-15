// src/components/Task/TaskList.tsx
import React, { useEffect, useState } from 'react';
import { getTasksByProject, deleteTask, updateTask } from '../../services/api';
import { Task, Project } from '../../types/types';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Typography,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface TaskListProps {
  project: Project;
  refreshTrigger: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ project, refreshTrigger }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasksByProject(project._id);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [project, refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Tasks for {project.name}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : tasks.length === 0 ? (
        <Typography variant="body1">No tasks available. Add a new task.</Typography>
      ) : (
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task._id}
              sx={{ border: '1px solid #ccc', borderRadius: '4px', marginBottom: '8px' }}
            >
              <Checkbox
                checked={task.completed}
                onChange={() => handleToggleComplete(task)}
              />
              <ListItemText
                primary={task.title}
                secondary={`Estimated: ${task.estimatedTime}h | Priority: ${task.priority} | Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              />
              <IconButton edge="end" onClick={() => handleDelete(task._id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default TaskList;
