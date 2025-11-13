/**
 * Admin Controller
 * Handles admin-specific operations and analytics
 */

import { getFirestore } from '../../config/firebase.js';
import logger from '../utils/logger.js';

// Get Firestore instance (lazily initialized)
const getDb = () => getFirestore();

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    // Get total users
    const usersSnapshot = await getDb().collection('users').get();
    const totalUsers = usersSnapshot.size;

    // Count by role
    let students = 0;
    let instructors = 0;
    let admins = 0;

    usersSnapshot.forEach(doc => {
      const role = doc.data().role;
      if (role === 'student') students++;
      else if (role === 'instructor') instructors++;
      else if (role === 'admin') admins++;
    });

    // Get total courses
    const coursesSnapshot = await getDb().collection('courses').get();
    const totalCourses = coursesSnapshot.size;

    // Calculate total students enrolled
    let totalEnrollments = 0;
    coursesSnapshot.forEach(doc => {
      totalEnrollments += doc.data().students || 0;
    });

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalUsers,
          students,
          instructors,
          admins,
          totalCourses,
          totalEnrollments,
        },
      },
    });
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    next(error);
  }
};

/**
 * Get recent activities
 */
export const getRecentActivities = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent users
    const recentUsers = await getDb().collection('users')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const users = [];
    recentUsers.forEach(doc => {
      const userData = doc.data();
      delete userData.password;
      users.push({
        uid: doc.id,
        ...userData,
      });
    });

    // Get recent courses
    const recentCourses = await getDb().collection('courses')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const courses = [];
    recentCourses.forEach(doc => {
      courses.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json({
      status: 'success',
      data: {
        recentUsers: users,
        recentCourses: courses,
      },
    });
  } catch (error) {
    logger.error('Get recent activities error:', error);
    next(error);
  }
};

export default {
  getDashboardStats,
  getRecentActivities,
};
