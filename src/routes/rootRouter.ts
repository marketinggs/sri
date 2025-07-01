import { Router } from 'express';
import templatesRouter from './templates.js';
import campaignRouter from './campaign.js';
import listRouter from './list.js';
import asyncHandler from '../utils/asyncHandler.js';

const rootRouter = Router();

rootRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.json({ message: 'Email Service is Up!', status: 200 });
  })
);

rootRouter.use('/templates', templatesRouter);
rootRouter.use('/campaigns', campaignRouter);
rootRouter.use('/lists', listRouter);

export default rootRouter;
