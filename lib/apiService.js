import { API_ENDPOINTS, API_CONFIG } from './endpoints';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = API_CONFIG.HEADERS;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const url = new URL(endpoint);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, value);
      }
    });

    return this.request(url.toString(), {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Campaign API methods
  async sendCampaign(listId, subject, content, scheduleOptions = null) {
    const payload = {
      listId,
      subject,
      campaign_data: content,
    };
    
    // Determine endpoint and add scheduling information if provided
    let endpoint = API_ENDPOINTS.SEND_CAMPAIGN;
    
    if (scheduleOptions) {
      endpoint = API_ENDPOINTS.SCHEDULE_CAMPAIGN;
      payload.scheduledAt = scheduleOptions.scheduledAt;
      payload.idempotencyKey = scheduleOptions.idempotencyKey;
    }
    
    return this.post(endpoint, payload);
  }

  // Separate method for scheduling campaigns
  async scheduleCampaign(listId, subject, content, scheduleDate, scheduleTime) {
    const scheduledAt = this.convertISTToAPIFormat(scheduleDate, scheduleTime);
    
    return this.post(API_ENDPOINTS.SCHEDULE_CAMPAIGN, {
      listId,
      subject,
      campaign_data: content,
      scheduledAt,
      idempotencyKey: scheduledAt,
    });
  }

  // Helper method to convert IST to API format
  convertISTToAPIFormat(date, time) {
    // Return in the format: "2025-07-04T16:28:00+05:30"
    return `${date}T${time}:00+05:30`;
  }

  async sendTestEmail(email, subject, content) {
    return this.post(API_ENDPOINTS.SEND_TEST_EMAIL, {
      email,
      subject: `[TEST] ${subject}`,
      content,
    });
  }

  // List API methods
  async getLists() {
    return this.get(API_ENDPOINTS.GET_LISTS);
  }

  async createList(listData) {
    return this.post(API_ENDPOINTS.CREATE_LIST, listData);
  }

  async updateList(id, listData) {
    return this.put(API_ENDPOINTS.UPDATE_LIST(id), listData);
  }

  async deleteList(id) {
    return this.delete(API_ENDPOINTS.DELETE_LIST(id));
  }

  // Customer API methods
  async bulkAddToList(listName, contacts) {
    return this.post(API_ENDPOINTS.BULK_ADD_TO_LIST, {
      listName,
      values: contacts,
    });
  }

  async getCustomers(listId) {
    return this.get(API_ENDPOINTS.GET_CUSTOMERS(listId));
  }

  // Analytics API methods
  async getCampaignStats() {
    return this.get(API_ENDPOINTS.GET_CAMPAIGN_STATS);
  }

  async getListStats(id) {
    return this.get(API_ENDPOINTS.GET_LIST_STATS(id));
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export class for testing or custom instances
export default ApiService; 