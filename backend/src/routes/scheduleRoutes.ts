// backend/routes/scheduleRoutes.ts

import express from 'express';
import { generateSchedule, getCurrentSchedule } from '../controllers/scheduleController';

const router = express.Router();

// Route to generate schedule
router.post('/generate', generateSchedule);

// Route to get the current schedule
router.get('/current', getCurrentSchedule);

export default router;
