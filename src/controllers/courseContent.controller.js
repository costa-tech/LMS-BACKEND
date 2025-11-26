import { getFirestore } from '../../config/firebase.js';
import logger from '../utils/logger.js';

const COURSE_CONTENT_COLLECTION = 'courseContent';

/**
 * Create course content
 */
export const createCourseContent = async (req, res) => {
  try {
    const db = getFirestore();
    const { courseId, title, sections } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({
        status: 'error',
        message: 'CourseId and title are required',
      });
    }

    const contentData = {
      courseId,
      title,
      sections: sections || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection(COURSE_CONTENT_COLLECTION).add(contentData);

    logger.info(`Course content created: ${docRef.id}`);

    res.status(201).json({
      status: 'success',
      message: 'Course content created successfully',
      data: {
        id: docRef.id,
        ...contentData,
      },
    });
  } catch (error) {
    logger.error('Error creating course content:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create course content',
      error: error.message,
    });
  }
};

/**
 * Get course content by ID
 */
export const getCourseContent = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;

    const doc = await db.collection(COURSE_CONTENT_COLLECTION).doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Course content not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        id: doc.id,
        ...doc.data(),
      },
    });
  } catch (error) {
    logger.error('Error fetching course content:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch course content',
      error: error.message,
    });
  }
};

/**
 * Get course content by course ID
 */
export const getCourseContentByCourseId = async (req, res) => {
  try {
    const db = getFirestore();
    const { courseId } = req.params;

    const snapshot = await db.collection(COURSE_CONTENT_COLLECTION)
      .where('courseId', '==', courseId)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        status: 'error',
        message: 'No content found for this course',
      });
    }

    const doc = snapshot.docs[0];

    res.status(200).json({
      status: 'success',
      data: {
        id: doc.id,
        ...doc.data(),
      },
    });
  } catch (error) {
    logger.error('Error fetching course content by course ID:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch course content',
      error: error.message,
    });
  }
};

/**
 * Update course content
 */
export const updateCourseContent = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;
    const { title, sections } = req.body;

    const doc = await db.collection(COURSE_CONTENT_COLLECTION).doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Course content not found',
      });
    }

    const updateData = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title;
    if (sections !== undefined) updateData.sections = sections;

    await db.collection(COURSE_CONTENT_COLLECTION).doc(id).update(updateData);

    logger.info(`Course content updated: ${id}`);

    res.status(200).json({
      status: 'success',
      message: 'Course content updated successfully',
      data: {
        id,
        ...doc.data(),
        ...updateData,
      },
    });
  } catch (error) {
    logger.error('Error updating course content:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update course content',
      error: error.message,
    });
  }
};

/**
 * Delete course content
 */
export const deleteCourseContent = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;

    const doc = await db.collection(COURSE_CONTENT_COLLECTION).doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Course content not found',
      });
    }

    await db.collection(COURSE_CONTENT_COLLECTION).doc(id).delete();

    logger.info(`Course content deleted: ${id}`);

    res.status(200).json({
      status: 'success',
      message: 'Course content deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting course content:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete course content',
      error: error.message,
    });
  }
};
