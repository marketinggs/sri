// Base API URL - change this for different environments
const BASE_URL = 'http://localhost:8008';

// API Endpoints
export const API_ENDPOINTS = {
  // Campaign endpoints
  SEND_CAMPAIGN: `${BASE_URL}/campaigns/custom-campaign/broadcast`,
  SCHEDULE_CAMPAIGN: `${BASE_URL}/campaigns/schedule`,
  SEND_TEST_EMAIL: `${BASE_URL}/campaigns/custom-campaign`,
  
  // Customer list endpoints
  GET_LISTS: `${BASE_URL}/contacts`,
  CREATE_LIST: `${BASE_URL}/contacts`,
  UPDATE_LIST: (id) => `${BASE_URL}/contacts/${id}`,
  DELETE_LIST: (id) => `${BASE_URL}/contacts/${id}`,
  
  // Customer endpoints
  UPLOAD_CUSTOMERS: `${BASE_URL}/customers/upload`,
  BULK_ADD_TO_LIST: `${BASE_URL}/contacts/bulk-add-to-list`,
  GET_CUSTOMERS: (listId) => `${BASE_URL}/customers/${listId}`,
  
  // Analytics endpoints (if you have them)
  GET_CAMPAIGN_STATS: `${BASE_URL}/analytics/campaigns`,
  GET_LIST_STATS: (id) => `${BASE_URL}/analytics/lists/${id}`,
};

// Environment-specific configuration
export const API_CONFIG = {
  BASE_URL,
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

// Helper function to build endpoints with query parameters
export const buildEndpoint = (endpoint, params = {}) => {
  const url = new URL(endpoint);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, value);
    }
  });
  return url.toString();
}; 