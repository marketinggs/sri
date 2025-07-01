import axios from 'axios';
import config from '../config/index.js';
import { APIError, ValidationError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

// Create axios instance with default config
const mailmodoApi = axios.create({
  baseURL: config.mailmodo.baseUrl,
  timeout: config.mailmodo.timeout,
  headers: {
    Accept: 'application/json',
    mmApiKey: config.mailmodo.apiKey,
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging and validation
mailmodoApi.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      logger.info('API Request:', {
        method: config.method,
        url: config.url,
        data: config.data,
        timestamp: new Date().toISOString(),
      });
    }
    return config;
  },
  (error) => {
    logger.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
mailmodoApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response;

    if (response) {
      // Handle different error status codes
      switch (response.status) {
        case 400:
          throw new ValidationError('Invalid request data', response.data);
        case 401:
          throw new APIError(401, 'Authentication failed. Please check your API key.');
        case 403:
          throw new APIError(403, 'Access forbidden. Please check your permissions.');
        case 404:
          throw new APIError(404, 'Resource not found');
        case 429:
          throw new APIError(429, 'Rate limit exceeded. Please try again later.');
        default:
          throw new APIError(
            response.status,
            response.data?.message || 'An error occurred with the Mailmodo API'
          );
      }
    }

    throw new APIError(500, 'Network error or service unavailable');
  }
);

// Validation functions
const validateCampaignData = (campaignData) => {
  if (!campaignData || typeof campaignData !== 'object') {
    throw new ValidationError('Campaign data must be an object');
  }

  const requiredFields = ['name', 'templateId', 'subject'];
  const missingFields = requiredFields.filter((field) => !campaignData[field]);

  if (missingFields.length > 0) {
    throw new ValidationError(`Missing required campaign fields: ${missingFields.join(', ')}`);
  }
};

const validateContactData = (contactData) => {
  if (!contactData || typeof contactData !== 'object') {
    throw new ValidationError('Contact data must be an object');
  }

  if (!contactData.listId) {
    throw new ValidationError('List ID is required');
  }

  if (!contactData.contacts || !Array.isArray(contactData.contacts)) {
    throw new ValidationError('Contacts must be an array');
  }

  if (!contactData.contacts.every((contact) => contact.email)) {
    throw new ValidationError('Each contact must have an email address');
  }
};

// Service functions
export const getAllTemplates = async () => {
  const response = await mailmodoApi.get('/getAllTemplates');
  return response.data;
};

export const createCampaign = async (campaignData) => {
  validateCampaignData(campaignData);
  const response = await mailmodoApi.post('/createTriggerCampaign', campaignData);
  return response.data;
};

export const getAllContactLists = async () => {
  const response = await mailmodoApi.get('/getAllContactLists');
  return response.data;
};

export const addToList = async (contactData) => {
  validateContactData(contactData);
  const response = await mailmodoApi.post('/addToList', contactData);
  return response.data;
};

export default mailmodoApi;
