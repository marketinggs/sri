import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import config from './src/config/index.js';
import rootRouter from './src/routes/rootRouter.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: config.isProduction,
    crossOriginEmbedderPolicy: config.isProduction,
    crossOriginOpenerPolicy: config.isProduction,
    crossOriginResourcePolicy: config.isProduction,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.security.rateLimitWindow,
  max: config.security.rateLimitMax,
  message: {
    success: false,
    status: 429,
    message: 'Too many requests, please try again later.',
  },
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: config.server.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 hours
    preflightContinue: false,
  })
);

// Request parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Compression and logging
app.use(compression());
app.use(morgan(config.isDevelopment ? 'dev' : 'combined'));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 200,
    message: 'Email Service is healthy',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// API routes
app.use('/api/v1', rootRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
