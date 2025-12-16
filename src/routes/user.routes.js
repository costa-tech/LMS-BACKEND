/**
 * User Routes
 * Routes for user management
 */

import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  getEnrolledCourses,
  syncEnrolledCourses,
  uploadProfilePhoto,
  handleProfilePhotoUpload,
  deleteUser,
} from '../controllers/user.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/users/upload-profile-photo
 * @desc    Upload profile photo
 * @access  Private
 */
router.post('/upload-profile-photo', verifyToken, uploadProfilePhoto, handleProfilePhotoUpload);

/**
 * @route   GET /api/users/enrolled-courses
 * @desc    Get user's enrolled courses
 * @access  Private
 */
router.get('/enrolled-courses', verifyToken, getEnrolledCourses);

/**
 * @route   POST /api/users/sync-enrolled-courses
 * @desc    Sync enrolled courses from frontend to database
 * @access  Private
 */
router.post('/sync-enrolled-courses', verifyToken, syncEnrolledCourses);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin)
 */
router.get('/', verifyToken, isAdmin, getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', verifyToken, getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private
 */
router.put('/:id', verifyToken, updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (Admin)
 */
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router;
