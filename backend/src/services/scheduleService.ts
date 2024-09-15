// src/services/scheduleService.ts
import Task, { ITask } from '../models/Task';
import { addDays, isBefore, startOfToday, parseISO } from 'date-fns';

interface Schedule {
  events: GoogleCalendarEvent[];
  dailyPlans: { [date: string]: ITask[] };
}

interface GoogleCalendarEvent {
  summary: string;
  description: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

export const generateSchedule = async (availableHoursPerDay: number): Promise<Schedule> => {
  const twoWeeksAhead = addDays(startOfToday(), 14);
  const tasks = await Task.find({
    completed: false,
    dueDate: { $lte: twoWeeksAhead },
  }).sort({ priority: -1, dueDate: 1 });

  const dailyPlans: { [date: string]: ITask[] } = {};
  const events: GoogleCalendarEvent[] = [];

  // Initialize dailyPlans for the next 14 days
  for (let i = 0; i < 14; i++) {
    const date = addDays(startOfToday(), i);
    const dateStr = date.toISOString().split('T')[0];
    dailyPlans[dateStr] = [];
  }

  for (const task of tasks) {
    let remainingTime = task.estimatedTime;
    for (let i = 0; i < 14; i++) {
      const date = addDays(startOfToday(), i);
      const dateStr = date.toISOString().split('T')[0];

      // Skip if the due date has passed
      if (isBefore(task.dueDate, date)) continue;

      const plannedTime = dailyPlans[dateStr].reduce((acc, t) => acc + t.estimatedTime, 0);
      if (plannedTime < availableHoursPerDay) {
        const availableTime = availableHoursPerDay - plannedTime;
        const timeToAllocate = Math.min(availableTime, remainingTime);
        if (timeToAllocate > 0) {
          // Clone the task with allocated time
          const taskClone = { ...task.toObject(), estimatedTime: timeToAllocate };
          delete taskClone._id; // Remove _id to prevent duplication
          dailyPlans[dateStr].push(taskClone as ITask);

          remainingTime -= timeToAllocate;

          // Create Google Calendar event
          const startTime = new Date(date);
          startTime.setHours(9); // Start at 9 AM
          const endTime = new Date(startTime);
          endTime.setHours(startTime.getHours() + timeToAllocate);

          events.push({
            summary: task.title,
            description: task.description || '',
            start: { dateTime: startTime.toISOString() },
            end: { dateTime: endTime.toISOString() },
          });

          if (remainingTime <= 0) break;
        }
      }
    }
  }

  return { dailyPlans, events };
};
