/**
 * User Controller
 * Handles user-related operations
 */

import { getFirestore } from '../../config/firebase.js';
import logger from '../utils/logger.js';
import bcrypt from 'bcryptjs';

// Get Firestore instance (lazily initialized)
const getDb = () => getFirestore();

/**
 * Get all users (Admin only)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;

    let usersRef = getDb().collection('users');

    // Filter by role if provided
    if (role) {
      usersRef = usersRef.where('role', '==', role);
    }

    const snapshot = await usersRef.get();
    const users = [];

    snapshot.forEach(doc => {
      const userData = doc.data();
      delete userData.password; // Remove password from response
      users.push({
        uid: doc.id,
        ...userData,
      });
    });

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    next(error);
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userDoc = await getDb().collection('users').doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const userData = userDoc.data();
    delete userData.password;

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          uid: userDoc.id,
          ...userData,
        },
      },
    });
  } catch (error) {
    logger.error('Get user by ID error:', error);
    next(error);
  }
};

/**
 * Update user
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userDoc = await getDb().collection('users').doc(id).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Prepare update data
    const updateData = {
      updatedAt: new Date().toISOString(),
    };

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role && req.user.role === 'admin') updateData.role = role;

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Update user
    await getDb().collection('users').doc(id).update(updateData);

    // Get updated user
    const updatedUser = await getDb().collection('users').doc(id).get();
    const userData = updatedUser.data();
    delete userData.password;

    logger.success(`User updated: ${id}`);

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: {
        user: {
          uid: updatedUser.id,
          ...userData,
        },
      },
    });
  } catch (error) {
    logger.error('Update user error:', error);
    next(error);
  }
};

/**
 * Delete user (Admin only)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.uid) {
      return res.status(400).json({
        status: 'error',
        message: 'You cannot delete your own account',
      });
    }

    // Check if user exists
    const userDoc = await getDb().collection('users').doc(id).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Delete user
    await getDb().collection('users').doc(id).delete();

    logger.success(`User deleted: ${id}`);

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    next(error);
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
