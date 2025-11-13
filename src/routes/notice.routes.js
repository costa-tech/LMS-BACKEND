/**
 * Notice Routes
 * Routes for notice board management
 */

import express from 'express';
import {
  getAllNotices,
  getAllNoticesAdmin,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} from '../controllers/notice.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/notices
 * @desc    Get all active notices
 * @access  Public
 */
router.get('/', getAllNotices);

/**
 * @route   GET /api/notices/admin/all
 * @desc    Get all notices including inactive (for admin panel)
 * @access  Private (Admin)
 */
router.get('/admin/all', verifyToken, isAdmin, getAllNoticesAdmin);

/**
 * @route   GET /api/notices/:id
 * @desc    Get notice by ID
 * @access  Public
 */
router.get('/:id', getNoticeById);

/**
 * @route   POST /api/notices
 * @desc    Create new notice
 * @access  Private (Admin)
 */
router.post('/', verifyToken, isAdmin, createNotice);

/**
 * @route   PUT /api/notices/:id
 * @desc    Update notice
 * @access  Private (Admin)
 */
router.put('/:id', verifyToken, isAdmin, updateNotice);

/**
 * @route   DELETE /api/notices/:id
 * @desc    Delete notice
 * @access  Private (Admin)
 */
router.delete('/:id', verifyToken, isAdmin, deleteNotice);

export default router;
