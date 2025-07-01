import { Router } from 'express';
import { getAllTemplates } from '../services/mailmodoService.js';

const templatesRouter = Router();

templatesRouter.get('/', async (req, res) => {
  try {
    const templates = await getAllTemplates();
    res.json({
      success: true,
      status: 200,
      data: templates,
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to fetch templates',
      error: error.response?.data || error.message,
    });
  }
});

export default templatesRouter;
