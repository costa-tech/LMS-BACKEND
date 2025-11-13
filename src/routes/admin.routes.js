/**
 * Admin Routes
 * Routes for admin panel operations
 */

import express from 'express';
import {
  getDashboardStats,
  getRecentActivities,
} from '../controllers/admin.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(verifyToken, isAdmin);

/**
 * @route   GET /api/admin/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private (Admin)
 */
router.get('/dashboard/stats', getDashboardStats);

/**
 * @route   GET /api/admin/dashboard/activities
 * @desc    Get recent activities
 * @access  Private (Admin)
 */
router.get('/dashboard/activities', getRecentActivities);

export default router;
