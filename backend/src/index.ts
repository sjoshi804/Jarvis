// backend/index.ts

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import scheduleRoutes from './routes/scheduleRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
// Import other routes as needed

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Adjust as needed
  credentials: true,
}));
app.use(bodyParser.json());

// Routes
app.use('/api/schedule', scheduleRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

mongoose.connect('mongodb://localhost:27017/project_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions)
  .then(() => {
    console.log('Connected to MongoDB.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
