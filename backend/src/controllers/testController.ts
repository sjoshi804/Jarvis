// src/controllers/testController.ts
import { Request, Response } from 'express';

export const testEndpoint = (req: Request, res: Response) => {
  res.json({ message: 'Backend is working!' });
};
