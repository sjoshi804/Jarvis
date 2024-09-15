// src/routes/testRoutes.ts
import express from 'express';
import { testEndpoint } from '../controllers/testController';

const router = express.Router();

// GET /api/test - Test endpoint
router.get('/', testEndpoint);

export default router;
