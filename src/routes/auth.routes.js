/**
 * Authentication Routes
 * Routes for user authentication (register, login, profile)
 */

import express from 'express';
import { register, login, getProfile } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator, validate } from '../validators/auth.validator.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidator, validate, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', loginValidator, validate, login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', verifyToken, getProfile);

export default router;
