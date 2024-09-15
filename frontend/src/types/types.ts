// src/types/types.ts

// If tasks are ObjectIds (strings)
export interface Project {
    _id: string;
    name: string;
    description?: string;
    tasks: string[]; // Array of Task IDs
  }
  
  
  export interface Task {
    _id: string;
    title: string;
    description?: string;
    estimatedTime: number; // in hours
    priority: 'high' | 'medium' | 'low';
    dueDate: string; // ISO string
    completed: boolean;
    project: string; // Project ID
  }
  
  export interface Schedule {
    dailyPlans: {
      [date: string]: Task[];
    };
    events: GoogleCalendarEvent[];
  }
  
  export interface GoogleCalendarEvent {
    summary: string;
    description: string;
    start: {
      dateTime: string; // ISO string
    };
    end: {
      dateTime: string; // ISO string
    };
  }
  