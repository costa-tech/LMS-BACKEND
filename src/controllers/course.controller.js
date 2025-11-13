/**
 * Course Controller
 * Handles all course-related operations
 */

import { getFirestore } from '../../config/firebase.js';
import logger from '../utils/logger.js';

// Get Firestore instance (lazily initialized)
const getDb = () => getFirestore();

/**
 * Get all courses
 */
export const getAllCourses = async (req, res, next) => {
  try {
    const { level, instructor, search } = req.query;

    let coursesRef = getDb().collection('courses');

    // Apply filters
    if (level) {
      coursesRef = coursesRef.where('level', '==', level);
    }

    if (instructor) {
      coursesRef = coursesRef.where('instructor', '==', instructor);
    }

    const snapshot = await coursesRef.get();
    let courses = [];

    snapshot.forEach(doc => {
      courses.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Search filter (client-side for now)
    if (search) {
      const searchLower = search.toLowerCase();
      courses = courses.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.instructor.toLowerCase().includes(searchLower)
      );
    }

    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: { courses },
    });
  } catch (error) {
    logger.error('Get all courses error:', error);
    next(error);
  }
};

/**
 * Get single course by ID
 */
export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const courseDoc = await getDb().collection('courses').doc(id).get();

    if (!courseDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        course: {
          id: courseDoc.id,
          ...courseDoc.data(),
        },
      },
    });
  } catch (error) {
    logger.error('Get course by ID error:', error);
    next(error);
  }
};

/**
 * Create new course (Admin/Instructor only)
 */
export const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      description,
      instructor,
      duration,
      level,
      price,
      students = 0,
      rating = 5.0,
    } = req.body;

    const courseData = {
      title,
      description,
      instructor,
      duration,
      level,
      price,
      students: parseInt(students) || 0,
      rating: parseFloat(rating) || 5.0,
      createdBy: req.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add image path if file was uploaded
    if (req.file) {
      courseData.image = `/images/Courses/${req.file.filename}`;
    }

    const courseRef = await getDb().collection('courses').add(courseData);

    logger.success(`Course created: ${title} (ID: ${courseRef.id})`);

    res.status(201).json({
      status: 'success',
      message: 'Course created successfully',
      data: {
        course: {
          id: courseRef.id,
          ...courseData,
        },
      },
    });
  } catch (error) {
    logger.error('Create course error:', error);
    next(error);
  }
};

/**
 * Update course (Admin/Instructor only)
 */
export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    // Parse numbers if they exist
    if (updateData.students) {
      updateData.students = parseInt(updateData.students) || 0;
    }
    if (updateData.rating) {
      updateData.rating = parseFloat(updateData.rating) || 5.0;
    }

    // Add image path if new file was uploaded
    if (req.file) {
      updateData.image = `/images/Courses/${req.file.filename}`;
    }

    // Check if course exists
    const courseDoc = await getDb().collection('courses').doc(id).get();
    
    if (!courseDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found',
      });
    }

    // Update course
    await getDb().collection('courses').doc(id).update(updateData);

    // Get updated course
    const updatedCourse = await getDb().collection('courses').doc(id).get();

    logger.success(`Course updated: ${id}`);

    res.status(200).json({
      status: 'success',
      message: 'Course updated successfully',
      data: {
        course: {
          id: updatedCourse.id,
          ...updatedCourse.data(),
        },
      },
    });
  } catch (error) {
    logger.error('Update course error:', error);
    next(error);
  }
};

/**
 * Delete course (Admin only)
 */
export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if course exists
    const courseDoc = await getDb().collection('courses').doc(id).get();
    
    if (!courseDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found',
      });
    }

    // Delete course
    await getDb().collection('courses').doc(id).delete();

    logger.success(`Course deleted: ${id}`);

    res.status(200).json({
      status: 'success',
      message: 'Course deleted successfully',
    });
  } catch (error) {
    logger.error('Delete course error:', error);
    next(error);
  }
};

export default {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
