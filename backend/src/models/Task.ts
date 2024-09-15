// src/models/Task.ts
import { Schema, model, Document } from 'mongoose';
import { IProject } from './Project';

export interface ITask extends Document {
  title: string;
  description?: string;
  estimatedTime: number; // in hours
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  completed: boolean;
  project: IProject['_id'];
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String },
  estimatedTime: { type: Number, required: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  dueDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
});

export default model<ITask>('Task', TaskSchema);
