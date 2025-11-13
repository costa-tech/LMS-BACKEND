/**
 * Authentication Controller
 * Handles user registration, login, and authentication
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getFirestore } from '../../config/firebase.js';
import logger from '../utils/logger.js';

// Get Firestore instance (lazily initialized)
const getDb = () => getFirestore();

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      uid: user.uid,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Register new user
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    // Check if user already exists
    const usersRef = getDb().collection('users');
    const existingUser = await usersRef.where('email', '==', email).get();

    if (!existingUser.empty) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user document
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'student' : role, // Prevent admin creation via API
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userDoc = await usersRef.add(userData);
    const user = {
      uid: userDoc.id,
      name,
      email,
      role: userData.role,
    };

    // Generate token
    const token = generateToken(user);

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          uid: user.uid,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

/**
 * Login user
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const usersRef = getDb().collection('users');
    const userSnapshot = await usersRef.where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    const user = {
      uid: userDoc.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    // Generate token
    const token = generateToken(user);

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res, next) => {
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
    delete userData.password; // Remove password from response

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
    logger.error('Get profile error:', error);
    next(error);
  }
};

export default { register, login, getProfile };
