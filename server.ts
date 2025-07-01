import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import config from './src/config/index.js';
import envCheck from './env-check.js';
import logger from './src/utils/logger.js';
import { Server } from 'http';

envCheck();

let server: Server;

const startServer = () => {
  // Create HTTP server
  server = app.listen(config.server.port, config.server.host, () => {
    logger.info(`
🚀 Server is running!
📭 Email Service listening on http://${config.server.host}:${config.server.port}
🌍 Environment: ${config.env}
        `);
  });

  // Set server timeouts
  server.timeout = config.server.requestTimeout;
  server.keepAliveTimeout = 65000; // Slightly higher than ALB's idle timeout
  server.headersTimeout = 66000; // Slightly higher than keepAliveTimeout

  // Handle server-specific errors
  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind =
      typeof config.server.port === 'string'
        ? 'Pipe ' + config.server.port
        : 'Port ' + config.server.port;

    // Handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        throw new Error(`${bind} requires elevated privileges`);
      case 'EADDRINUSE':
        throw new Error(`${bind} is already in use`);
      default:
        throw error;
    }
  });
};

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  logger.info(`\n🛑 Received ${signal} signal. Starting graceful shutdown...`);

  let forceExit = false;

  // Set a timeout for the graceful shutdown
  const shutdownTimeout = setTimeout(() => {
    logger.error('⚠️ Could not close connections in time, forcing shutdown');
    forceExit = true;
    process.kill(process.pid, signal);
  }, 10000);

  try {
    // Stop accepting new connections
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });

    // Add any cleanup tasks here (e.g., closing database connections)

    if (!forceExit) {
      clearTimeout(shutdownTimeout);
      logger.info('👋 Gracefully shut down. Goodbye!');
    }
  } catch (error) {
    logger.error('❌ Error during shutdown:', error);
    if (!forceExit) {
      process.kill(process.pid, signal);
    }
  }
};

// Handle different shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught Exception:', error);
  gracefulShutdown('SIGTERM');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('SIGTERM');
});

// Start the server
startServer();
