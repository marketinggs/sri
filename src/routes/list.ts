import { Router } from 'express';
import { getAllContactLists, addToList } from '../services/mailmodoService.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

// Get all contact lists
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const data = await getAllContactLists();

    return res.status(200).json({
      success: true,
      data,
      message: 'Contact lists retrieved successfully',
    });
  })
);

// Add contact to list (creates list if it doesn't exist)
router.post(
  '/add',
  asyncHandler(async (req, res) => {
    const {
      email,
      listName,
      data = {},
      timezone = 'UTC',
      created_at = null,
      last_click = null,
      last_open = null,
    } = req.body;

    // Validate required fields
    if (!email || !listName) {
      return res.status(400).json({
        success: false,
        message: 'Email and listName are required fields',
        error: { message: 'Missing required fields' },
      });
    }

    // Prepare contact data with all possible fields from the API spec
    const contactData = {
      email,
      listName,
      data: {
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        name: data.name || '',
        gender: data.gender || '',
        age: data.age || null,
        birthday: data.birthday || null,
        phone: data.phone || '',
        address1: data.address1 || '',
        address2: data.address2 || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        postal_code: data.postal_code || '',
        designation: data.designation || '',
        company: data.company || '',
        industry: data.industry || '',
        description: data.description || '',
        anniversary_date: data.anniversary_date || null,
      },
      created_at,
      last_click,
      last_open,
      timezone,
    };

    const result = await addToList(contactData);

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Contact added to list successfully',
    });
  })
);

export default router;
