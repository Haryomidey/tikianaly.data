import { Router } from 'express';
import { CricketSseHandler } from './CricketSseHandler.js';

export const cricketSseRouter = (handler: CricketSseHandler): Router => {
  const router = Router();
  router.get('/cricket/stream', (req, res) => handler.connect(req, res));
  return router;
};
