import { Router } from 'express';
import { getAllTemplates } from '../services/mailmodoService.js';
import asyncHandler from '../utils/asyncHandler.js';

const templatesRouter = Router();

templatesRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const templates = await getAllTemplates();
    res.json({
      success: true,
      status: 200,
      data: templates,
    });
  })
);

export default templatesRouter;
