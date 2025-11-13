/**
 * Cart Routes
 * Routes for shopping cart management
 */

import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from '../controllers/cart.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 * @access  Private
 */
router.get('/', verifyToken, getCart);

/**
 * @route   POST /api/cart
 * @desc    Add item to cart
 * @access  Private
 */
router.post('/', verifyToken, addToCart);

/**
 * @route   DELETE /api/cart/:courseId
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete('/:courseId', verifyToken, removeFromCart);

/**
 * @route   DELETE /api/cart
 * @desc    Clear cart
 * @access  Private
 */
router.delete('/', verifyToken, clearCart);

export default router;
