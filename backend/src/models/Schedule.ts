// backend/models/Schedule.ts

import mongoose, { Document, Schema } from 'mongoose';
import { ITask } from './Task'; // Ensure Task model is defined

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

export interface ScheduleDocument extends Document {
  dailyPlans: {
    [date: string]: ITask[]; // Array of tasks for each date
  };
  events: GoogleCalendarEvent[];
  createdAt: Date;
}

const ScheduleSchema: Schema = new Schema(
  {
    dailyPlans: {
      type: Map,
      of: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
      required: true,
    },
    events: [
      {
        summary: { type: String, required: true },
        description: { type: String },
        start: {
          dateTime: { type: String, required: true },
        },
        end: {
          dateTime: { type: String, required: true },
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ScheduleDocument>('Schedule', ScheduleSchema);
