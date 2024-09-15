// backend/controllers/scheduleController.ts

import { Request, Response } from 'express';
import Schedule from '../models/Schedule';
import Task from '../models/Task';
import { GoogleCalendarEvent } from '../models/Schedule';
import mongoose from 'mongoose';

// Function to generate schedule
export const generateSchedule = async (req: Request, res: Response) => {
  try {
    const availableHoursPerDay = Number(req.query.availableHoursPerDay);
    if (isNaN(availableHoursPerDay) || availableHoursPerDay <= 0) {
      return res.status(400).json({ error: 'Invalid availableHoursPerDay parameter.' });
    }

    // Fetch all incomplete tasks, sorted by priority and due date
    const tasks = await Task.find({ completed: false })
      .populate('project')
      .sort({ priority: -1, dueDate: 1 });

    // Define priority weights
    const priorityWeight: { [key: string]: number } = {
      high: 3,
      medium: 2,
      low: 1,
    };

    // Sort tasks based on priority and due date
    tasks.sort((a, b) => {
      if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    // Initialize schedule
    const dailyPlans: { [date: string]: mongoose.Types.ObjectId[] } = {};

    // Get today's date
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize to midnight

    // Define a horizon (e.g., 30 days)
    const horizonDays = 30;

    // Function to add days
    const addDays = (date: Date, days: number): Date => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    // Create a list of dates
    const dates: string[] = [];
    for (let i = 0; i < horizonDays; i++) {
      const date = addDays(currentDate, i);
      const dateStr = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
      dates.push(dateStr);
      dailyPlans[dateStr] = [];
    }

    // Allocate tasks to dates
    tasks.forEach((task) => {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const daysUntilDue = Math.ceil((dueDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
      const latestDay = Math.min(daysUntilDue, horizonDays - 1);
      const dueDateStr = dueDate.toISOString().split('T')[0];

      for (let i = 0; i <= latestDay; i++) {
        const dateStr = dates[i];
        const assignedHours = dailyPlans[dateStr].reduce((acc, taskId) => acc + task.estimatedTime, 0);
        if (assignedHours + task.estimatedTime <= availableHoursPerDay) {
          dailyPlans[dateStr].push(task._id);
          break;
        }
      }
    });

    // Prepare events for Google Calendar (optional)
    const events: GoogleCalendarEvent[] = [];
    dates.forEach((dateStr) => {
      const dayTasks = dailyPlans[dateStr];
      if (dayTasks.length === 0) return;

      dayTasks.forEach((taskId, index) => {
        // Example: Assign each task 1 hour slots starting at 9 AM
        const taskStart = new Date(`${dateStr}T09:00:00`);
        taskStart.setHours(taskStart.getHours() + index); // 9 AM + index hours
        const taskEnd = new Date(taskStart);
        taskEnd.setHours(taskEnd.getHours() + 1); // 1-hour duration

        events.push({
          summary: `Task: ${taskId}`,
          description: `Task ID: ${taskId}`,
          start: {
            dateTime: taskStart.toISOString(),
          },
          end: {
            dateTime: taskEnd.toISOString(),
          },
        });
      });
    });

    // Save the schedule to the database
    const schedule = new Schedule({
      dailyPlans,
      events, // Even if adding to Google Calendar fails, save the schedule
    });

    await schedule.save();

    // Optionally, integrate with Google Calendar here
    // If integration fails, catch the error but don't prevent saving the schedule

    res.status(201).json({ message: 'Schedule generated successfully.', schedule });
  } catch (error: any) {
    console.error('Error generating schedule:', error);
    res.status(500).json({ error: 'Failed to generate schedule.' });
  }
};

// Function to get the current schedule
export const getCurrentSchedule = async (req: Request, res: Response) => {
    try {
      const schedule = await Schedule.findOne()
        .sort({ createdAt: -1 })
        .populate({
          path: 'dailyPlans',
          populate: { path: 'tasks', model: 'Task' },
        });
  
      if (!schedule) {
        return res.status(404).json({ error: 'No schedule found.' });
      }
  
      res.status(200).json(schedule);
    } catch (error: any) {
      console.error('Error fetching schedule:', error);
      res.status(500).json({ error: 'Failed to fetch schedule.' });
    }
  };
  