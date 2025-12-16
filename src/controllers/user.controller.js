/**
 * User Controller
 * Handles user-related operations
 */

import { getFirestore } from '../../config/firebase.js';
import logger from '../utils/logger.js';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Firestore instance (lazily initialized)
const getDb = () => getFirestore();

// Configure multer for profile photo uploads
const profilePicsPath = path.join(__dirname, '../../..', 'nextgen-lms', 'public', 'images', 'Profile pics');

// Ensure directory exists
if (!fs.existsSync(profilePicsPath)) {
  fs.mkdirSync(profilePicsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilePicsPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

export const uploadProfilePhoto = upload.single('profilePhoto');

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
    const { firstName, lastName, name, email, password, role, bio, profileImage } = req.body;

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

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (profileImage !== undefined) updateData.profileImage = profileImage;
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
 * Get user's enrolled courses
 */
export const getEnrolledCourses = async (req, res, next) => {
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
    const enrolledCourses = userData.enrolledCourses || [];

    res.status(200).json({
      status: 'success',
      data: {
        enrolledCourses,
      },
    });
  } catch (error) {
    logger.error('Get enrolled courses error:', error);
    next(error);
  }
};

/**
 * Sync enrolled courses from frontend to database
 */
export const syncEnrolledCourses = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { enrolledCourses } = req.body;

    if (!Array.isArray(enrolledCourses)) {
      return res.status(400).json({
        status: 'error',
        message: 'enrolledCourses must be an array',
      });
    }

    const userDoc = await getDb().collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Update user's enrolled courses
    await getDb().collection('users').doc(userId).update({
      enrolledCourses,
      updatedAt: new Date().toISOString(),
    });

    logger.info(`Enrolled courses synced for user: ${userId}`);

    res.status(200).json({
      status: 'success',
      message: 'Enrolled courses synced successfully',
      data: {
        enrolledCourses,
      },
    });
  } catch (error) {
    logger.error('Sync enrolled courses error:', error);
    next(error);
  }
};

/**
 * Upload profile photo
 */
export const handleProfilePhotoUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded',
      });
    }

    const userId = req.user.uid;
    const filename = req.file.filename;
    const profileImagePath = `/images/Profile pics/${filename}`;

    // Update user's profileImage in database
    await getDb().collection('users').doc(userId).update({
      profileImage: profileImagePath,
      updatedAt: new Date().toISOString(),
    });

    logger.info(`Profile photo uploaded for user: ${userId}`);

    res.status(200).json({
      status: 'success',
      message: 'Profile photo uploaded successfully',
      data: {
        profileImage: profileImagePath,
      },
    });
  } catch (error) {
    logger.error('Upload profile photo error:', error);
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
  getEnrolledCourses,
  syncEnrolledCourses,
  uploadProfilePhoto,
  handleProfilePhotoUpload,
  deleteUser,
};
