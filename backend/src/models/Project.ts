// src/models/Project.ts
import { Schema, model, Document } from 'mongoose';
import { ITask } from './Task';

export interface IProject extends Document {
  name: string;
  description?: string;
  tasks: ITask['_id'][];
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
});

export default model<IProject>('Project', ProjectSchema);
