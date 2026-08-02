import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from './env.js';
import { User } from '../models/User.js';
import { logger } from '../utils/logger.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  // Orders Namespace (Public/Customers)
  const ordersNs = io.of('/orders');
  ordersNs.on('connection', (socket) => {
    logger.info(`🔌 Client connected to /orders: ${socket.id}`);

    socket.on('join-order', (orderId) => {
      if (!orderId) return;
      const room = `order:${orderId}`;
      socket.join(room);
      logger.info(`Client ${socket.id} joined room: ${room}`);
    });

    socket.on('leave-order', (orderId) => {
      if (!orderId) return;
      const room = `order:${orderId}`;
      socket.leave(room);
      logger.info(`Client ${socket.id} left room: ${room}`);
    });

    socket.on('disconnect', () => {
      logger.info(`🔌 Client disconnected from /orders: ${socket.id}`);
    });
  });

  // Staff Namespace (Protected)
  const staffNs = io.of('/staff');
  
  // Authentication middleware for staff
  staffNs.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user || !['admin', 'staff'].includes(user.role)) {
        return next(new Error('Authentication error: Unauthorized access'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  staffNs.on('connection', (socket) => {
    logger.info(`👨‍🍳 Staff connected to /staff: ${socket.user.name} (${socket.id})`);
    
    // Auto-join the global queue room
    socket.join('staff:queue');

    socket.on('disconnect', () => {
      logger.info(`👨‍🍳 Staff disconnected from /staff: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
