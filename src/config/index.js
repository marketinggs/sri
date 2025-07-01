import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

// Set up path for .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../../.env');

// Load environment variables
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Validate required environment variables
const requiredEnvVars = ['MAILMODO_API_KEY', 'NODE_ENV'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Configuration object
const config = {
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',

  server: {
    port: parseInt(process.env.PORT || '8008', 10),
    host: process.env.HOST || 'localhost',
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '10000', 10),
    corsOrigins:
      process.env.NODE_ENV === 'development'
        ? true
        : [/^https:\/\/([a-zA-Z-]+\.)*growthschool.io$/],
  },

  mailmodo: {
    apiKey: process.env.MAILMODO_API_KEY,
    baseUrl: process.env.MAILMODO_BASE_URL || 'https://api.mailmodo.com/api/v1',
    timeout: parseInt(process.env.MAILMODO_TIMEOUT || '5000', 10),
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    // Add any other logging configurations here
  },

  security: {
    // Add security related configurations
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes in milliseconds
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // maximum requests per window
  },
};

// Freeze the configuration object to prevent modifications
Object.freeze(config);

export default config;
