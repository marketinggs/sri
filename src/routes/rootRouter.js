import { Router } from 'express';
import templatesRouter from './templates.js';
import campaignRouter from './campaign.js';
import listRouter from './list.js';

const rootRouter = Router();

rootRouter.get('/', async (req, res) => {
  res.json({ message: 'Email Service is Up!', status: 200 });
});

rootRouter.use('/templates', templatesRouter);
rootRouter.use('/campaigns', campaignRouter);
rootRouter.use('/lists', listRouter);

export default rootRouter;
