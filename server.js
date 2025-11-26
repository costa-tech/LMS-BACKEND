/**
 * Server.js - Main Entry Point
 * This is the heart of the application - it starts everything up!
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import configuration and routes
import { initializeFirebase } from './config/firebase.js';
import logger from './src/utils/logger.js';
import errorHandler from './src/middleware/errorHandler.js';
import rateLimiter from './src/middleware/rateLimiter.js';

// Import routes
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import courseRoutes from './src/routes/course.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import cartRoutes from './src/routes/cart.routes.js';
import noticeRoutes from './src/routes/notice.routes.js';
import accessKeyRoutes from './src/routes/accessKey.routes.js';
import courseContentRoutes from './src/routes/courseContent.routes.js';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase
initializeFirebase();

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Security middleware
app.use(helmet()); // Adds security headers

// CORS configuration - Allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Body parsing middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Rate limiting
app.use(rateLimiter);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'LMS Backend is running!',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/access-keys', accessKeyRoutes);
app.use('/api/course-content', courseContentRoutes);

// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📚 LMS Backend initialized successfully`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n✅ Server ready at http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err);
  process.exit(1);
});

export default app;
