import { Router } from 'express';
import { createCampaign } from '../services/mailmodoService.js';
import mailmodoApi from '../services/mailmodoService.js';
import { campaignValidation } from '../middleware/validation.js';
import { APIError } from '../middleware/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';

const campaignRouter = Router();


campaignRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.json({
      status: 200,
      data: 'Campaigns are Up!',
    });
  })
);

/**
 * @route POST /campaigns
 * @description Create a new email campaign
 * @access Private
 */
campaignRouter.post(
  '/',
  campaignValidation,
  asyncHandler(async (req, res) => {
    const campaignData = req.body;
    const result = await createCampaign(campaignData);

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: result,
    });
  })
);

/**
 * @route GET /campaigns/:id
 * @description Get campaign details by ID
 * @access Private
 */
campaignRouter.get(
  '/:id',
  asyncHandler(async (req) => {
    const { id } = req.params;
    throw new APIError(501, `Get campaign details for ID ${id} not implemented`);
  })
);

/**
 * @route PUT /campaigns/:id
 * @description Update campaign details
 * @access Private
 */
campaignRouter.put(
  '/:id',
  campaignValidation,
  asyncHandler(async (req) => {
    const { id } = req.params;
    const updateData = req.body;
    throw new APIError(
      501,
      `Update campaign ${id} with data ${JSON.stringify(updateData)} not implemented`
    );
  })
);

/**
 * @route DELETE /campaigns/:id
 * @description Delete a campaign
 * @access Private
 */
campaignRouter.delete(
  '/:id',
  asyncHandler(async (req) => {
    const { id } = req.params;
    throw new APIError(501, `Delete campaign ${id} not implemented`);
  })
);

// Trigger a campaign
campaignRouter.post(
  '/trigger/:campaignId',
  asyncHandler(async (req, res) => {
    const { campaignId } = req.params;
    const { email, subject, replyTo, fromName, campaign_data, data, addToList } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Make API request to trigger campaign
    const response = await mailmodoApi.post(`/triggerCampaign/${campaignId}`, {
      email,
      subject,
      replyTo,
      fromName,
      campaign_data,
      data,
      addToList,
    });

    return res.status(200).json({
      success: true,
      message: 'Campaign triggered successfully',
      data: response.data,
    });
  })
);

export default campaignRouter;
