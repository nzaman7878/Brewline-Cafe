/**
 * Brewline Cafe — Server Entry Point
 *
 * Connects to MongoDB and starts the Express server.
 */

import app from './app.js';
import { connectDB } from './config/db.js';
import { initSocket } from './config/socket.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('✅ MongoDB connected successfully');

    // Start Express server
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Brewline Cafe server running on port ${env.PORT}`);
      logger.info(`📍 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 API: http://localhost:${env.PORT}/api`);
    });

    // Handle port-in-use gracefully — exits so nodemon won't get stuck
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`❌ Port ${env.PORT} is already in use. Exiting so nodemon can retry...`);
        process.exit(1);
      } else {
        logger.error('Server error:', err);
        process.exit(1);
      }
    });

    // Initialize Socket.io
    initSocket(server);

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      logger.info(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info('💤 Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
