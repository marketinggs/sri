import request from 'supertest';
import app from '../../app.js';

describe('App', () => {
  describe('GET /health', () => {
    it('should return health check status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Email Service is healthy');
    });
  });
});
