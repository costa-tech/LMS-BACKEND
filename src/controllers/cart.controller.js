/**
 * Cart Controller
 * Handles user shopping cart operations
 */

import { getFirestore } from '../../config/firebase.js';
import logger from '../utils/logger.js';

// Get Firestore instance (lazily initialized)
const getDb = () => getFirestore();

/**
 * Get user's cart
 */
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.uid;

    const userDoc = await getDb().collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const userData = userDoc.data();
    const cart = userData.cart || [];

    res.status(200).json({
      status: 'success',
      data: {
        cart,
      },
    });
  } catch (error) {
    logger.error('Get cart error:', error);
    next(error);
  }
};

/**
 * Add item to cart
 */
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { courseId, title, instructor, price, image, duration, level } = req.body;

    // Validate required fields
    if (!courseId || !title || !price) {
      return res.status(400).json({
        status: 'error',
        message: 'Course ID, title, and price are required',
      });
    }

    const userDoc = await getDb().collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const userData = userDoc.data();
    let cart = userData.cart || [];

    // Check if course already in cart
    const existingItemIndex = cart.findIndex(item => item.id === courseId);

    if (existingItemIndex !== -1) {
      return res.status(400).json({
        status: 'error',
        message: 'Course already in cart',
      });
    }

    // Add new item to cart
    const cartItem = {
      id: courseId,
      title,
      instructor: instructor || 'Course Instructor',
      price,
      image: image || '',
      duration: duration || 'N/A',
      level: level || 'All levels',
      addedAt: new Date().toISOString(),
    };

    cart.push(cartItem);

    // Update user document with new cart
    await getDb().collection('users').doc(userId).update({
      cart,
      updatedAt: new Date().toISOString(),
    });

    logger.info(`Course ${courseId} added to cart for user ${userId}`);

    res.status(200).json({
      status: 'success',
      message: 'Course added to cart',
      data: {
        cart,
      },
    });
  } catch (error) {
    logger.error('Add to cart error:', error);
    next(error);
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { courseId } = req.params;

    const userDoc = await getDb().collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const userData = userDoc.data();
    let cart = userData.cart || [];

    // Remove item from cart
    cart = cart.filter(item => item.id !== courseId);

    // Update user document
    await getDb().collection('users').doc(userId).update({
      cart,
      updatedAt: new Date().toISOString(),
    });

    logger.info(`Course ${courseId} removed from cart for user ${userId}`);

    res.status(200).json({
      status: 'success',
      message: 'Course removed from cart',
      data: {
        cart,
      },
    });
  } catch (error) {
    logger.error('Remove from cart error:', error);
    next(error);
  }
};

/**
 * Clear cart
 */
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.uid;

    const userDoc = await getDb().collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Clear cart
    await getDb().collection('users').doc(userId).update({
      cart: [],
      updatedAt: new Date().toISOString(),
    });

    logger.info(`Cart cleared for user ${userId}`);

    res.status(200).json({
      status: 'success',
      message: 'Cart cleared successfully',
      data: {
        cart: [],
      },
    });
  } catch (error) {
    logger.error('Clear cart error:', error);
    next(error);
  }
};

export default {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};
