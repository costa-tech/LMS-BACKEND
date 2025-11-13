/**
 * Notice Controller
 * Handles notice board operations (admin announcements)
 */

import { getFirestore } from '../../config/firebase.js';
import logger from '../utils/logger.js';

// Get Firestore instance (lazily initialized)
const getDb = () => getFirestore();

/**
 * Get all active notices (public access)
 */
export const getAllNotices = async (req, res, next) => {
  try {
    const noticesRef = getDb().collection('notices');
    
    // Get only active notices
    const snapshot = await noticesRef
      .where('isActive', '==', true)
      .get();

    const notices = [];
    snapshot.forEach(doc => {
      notices.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Sort in memory by priority (desc) then createdAt (desc)
    notices.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.status(200).json({
      status: 'success',
      results: notices.length,
      data: { notices },
    });
  } catch (error) {
    logger.error('Get all notices error:', error);
    next(error);
  }
};

/**
 * Get all notices including inactive (Admin only)
 */
export const getAllNoticesAdmin = async (req, res, next) => {
  try {
    const noticesRef = getDb().collection('notices');
    const snapshot = await noticesRef.get();

    const notices = [];
    snapshot.forEach(doc => {
      notices.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Sort in memory by createdAt (desc)
    notices.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.status(200).json({
      status: 'success',
      results: notices.length,
      data: { notices },
    });
  } catch (error) {
    logger.error('Get all notices (admin) error:', error);
    next(error);
  }
};

/**
 * Get notice by ID
 */
export const getNoticeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const noticeDoc = await getDb().collection('notices').doc(id).get();

    if (!noticeDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Notice not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        notice: {
          id: noticeDoc.id,
          ...noticeDoc.data(),
        },
      },
    });
  } catch (error) {
    logger.error('Get notice by ID error:', error);
    next(error);
  }
};

/**
 * Create new notice (Admin only)
 */
export const createNotice = async (req, res, next) => {
  try {
    const { title, content, type, priority, isActive } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        status: 'error',
        message: 'Title and content are required',
      });
    }

    // Create notice document
    const noticeData = {
      title,
      content,
      type: type || 'info', // info, warning, success, error
      priority: priority || 0, // Higher number = higher priority
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user.uid,
      createdByName: req.user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const noticeDoc = await getDb().collection('notices').add(noticeData);

    logger.info(`Notice created: ${noticeDoc.id}`);

    res.status(201).json({
      status: 'success',
      message: 'Notice created successfully',
      data: {
        notice: {
          id: noticeDoc.id,
          ...noticeData,
        },
      },
    });
  } catch (error) {
    logger.error('Create notice error:', error);
    next(error);
  }
};

/**
 * Update notice (Admin only)
 */
export const updateNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, type, priority, isActive } = req.body;

    // Check if notice exists
    const noticeDoc = await getDb().collection('notices').doc(id).get();
    
    if (!noticeDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Notice not found',
      });
    }

    // Prepare update data
    const updateData = {
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.uid,
      updatedByName: req.user.name,
    };

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (type !== undefined) updateData.type = type;
    if (priority !== undefined) updateData.priority = priority;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update notice
    await getDb().collection('notices').doc(id).update(updateData);

    // Get updated notice
    const updatedNotice = await getDb().collection('notices').doc(id).get();

    logger.info(`Notice updated: ${id}`);

    res.status(200).json({
      status: 'success',
      message: 'Notice updated successfully',
      data: {
        notice: {
          id: updatedNotice.id,
          ...updatedNotice.data(),
        },
      },
    });
  } catch (error) {
    logger.error('Update notice error:', error);
    next(error);
  }
};

/**
 * Delete notice (Admin only)
 */
export const deleteNotice = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if notice exists
    const noticeDoc = await getDb().collection('notices').doc(id).get();
    
    if (!noticeDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Notice not found',
      });
    }

    // Delete notice
    await getDb().collection('notices').doc(id).delete();

    logger.info(`Notice deleted: ${id}`);

    res.status(200).json({
      status: 'success',
      message: 'Notice deleted successfully',
    });
  } catch (error) {
    logger.error('Delete notice error:', error);
    next(error);
  }
};

export default {
  getAllNotices,
  getAllNoticesAdmin,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
};
