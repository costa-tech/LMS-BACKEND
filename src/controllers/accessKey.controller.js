import { getFirestore } from '../../config/firebase.js';
import logger from '../utils/logger.js';

const ACCESS_KEYS_COLLECTION = 'accessKeys';

/**
 * Create a new access key
 */
export const createAccessKey = async (req, res) => {
  try {
    const db = getFirestore();
    const { key, courseId, expiryDate, maxUses, isActive } = req.body;

    // Validate required fields
    if (!key || !courseId) {
      return res.status(400).json({
        status: 'error',
        message: 'Key and courseId are required',
      });
    }

    // Check if key already exists
    const existingKey = await db.collection(ACCESS_KEYS_COLLECTION)
      .where('key', '==', key)
      .get();

    if (!existingKey.empty) {
      return res.status(400).json({
        status: 'error',
        message: 'This access key already exists',
      });
    }

    const accessKeyData = {
      key,
      courseId,
      expiryDate: expiryDate || null,
      maxUses: maxUses || null,
      currentUses: 0,
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection(ACCESS_KEYS_COLLECTION).add(accessKeyData);

    logger.info(`Access key created: ${docRef.id}`);

    res.status(201).json({
      status: 'success',
      message: 'Access key created successfully',
      data: {
        id: docRef.id,
        ...accessKeyData,
      },
    });
  } catch (error) {
    logger.error('Error creating access key:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create access key',
      error: error.message,
    });
  }
};

/**
 * Get all access keys
 */
export const getAllAccessKeys = async (req, res) => {
  try {
    const db = getFirestore();
    const { courseId } = req.query;
    
    let query = db.collection(ACCESS_KEYS_COLLECTION);
    
    if (courseId) {
      query = query.where('courseId', '==', courseId);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();

    const accessKeys = [];
    snapshot.forEach((doc) => {
      accessKeys.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json({
      status: 'success',
      results: accessKeys.length,
      data: accessKeys,
    });
  } catch (error) {
    logger.error('Error fetching access keys:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch access keys',
      error: error.message,
    });
  }
};

/**
 * Get access key by ID
 */
export const getAccessKeyById = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;

    const doc = await db.collection(ACCESS_KEYS_COLLECTION).doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Access key not found',
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
    logger.error('Error fetching access key:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch access key',
      error: error.message,
    });
  }
};

/**
 * Update an access key
 */
export const updateAccessKey = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;
    const { key, courseId, expiryDate, maxUses, isActive } = req.body;

    const doc = await db.collection(ACCESS_KEYS_COLLECTION).doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Access key not found',
      });
    }

    const updateData = {
      updatedAt: new Date().toISOString(),
    };

    if (key !== undefined) updateData.key = key;
    if (courseId !== undefined) updateData.courseId = courseId;
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate;
    if (maxUses !== undefined) updateData.maxUses = maxUses;
    if (isActive !== undefined) updateData.isActive = isActive;

    await db.collection(ACCESS_KEYS_COLLECTION).doc(id).update(updateData);

    logger.info(`Access key updated: ${id}`);

    res.status(200).json({
      status: 'success',
      message: 'Access key updated successfully',
      data: {
        id,
        ...doc.data(),
        ...updateData,
      },
    });
  } catch (error) {
    logger.error('Error updating access key:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update access key',
      error: error.message,
    });
  }
};

/**
 * Delete an access key
 */
export const deleteAccessKey = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;

    const doc = await db.collection(ACCESS_KEYS_COLLECTION).doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Access key not found',
      });
    }

    await db.collection(ACCESS_KEYS_COLLECTION).doc(id).delete();

    logger.info(`Access key deleted: ${id}`);

    res.status(200).json({
      status: 'success',
      message: 'Access key deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting access key:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete access key',
      error: error.message,
    });
  }
};

/**
 * Validate an access key
 */
export const validateAccessKey = async (req, res) => {
  try {
    const db = getFirestore();
    const { key, courseId, userId } = req.body;

    if (!key || !courseId) {
      return res.status(400).json({
        status: 'error',
        message: 'Key and courseId are required',
      });
    }

    // Find the access key
    const snapshot = await db.collection(ACCESS_KEYS_COLLECTION)
      .where('key', '==', key)
      .where('courseId', '==', courseId)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        status: 'error',
        message: 'Invalid access key',
      });
    }

    const doc = snapshot.docs[0];
    const keyData = doc.data();

    // Check if key is active
    if (!keyData.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'This access key is no longer active',
      });
    }

    // Check expiry date
    if (keyData.expiryDate) {
      const expiryDate = new Date(keyData.expiryDate);
      if (expiryDate < new Date()) {
        return res.status(403).json({
          status: 'error',
          message: 'This access key has expired',
        });
      }
    }

    // Check max uses
    if (keyData.maxUses && keyData.currentUses >= keyData.maxUses) {
      return res.status(403).json({
        status: 'error',
        message: 'This access key has reached its maximum usage limit',
      });
    }

    // Increment usage count
    await db.collection(ACCESS_KEYS_COLLECTION).doc(doc.id).update({
      currentUses: (keyData.currentUses || 0) + 1,
      lastUsedAt: new Date().toISOString(),
      lastUsedBy: userId || 'anonymous',
    });

    // Store user's access in a separate collection for tracking
    if (userId) {
      await db.collection('userCourseAccess').add({
        userId,
        courseId,
        accessKeyId: doc.id,
        accessKey: key,
        grantedAt: new Date().toISOString(),
      });

      // Also update user's enrolledCourses array
      const userDoc = await db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const enrolledCourses = userData.enrolledCourses || [];
        
        // Add courseId if not already enrolled
        if (!enrolledCourses.includes(courseId)) {
          enrolledCourses.push(courseId);
          await db.collection('users').doc(userId).update({
            enrolledCourses,
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }

    logger.info(`Access key validated: ${key} for course: ${courseId}`);

    res.status(200).json({
      status: 'success',
      message: 'Access key is valid',
      data: {
        courseId: keyData.courseId,
        accessGranted: true,
      },
    });
  } catch (error) {
    logger.error('Error validating access key:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to validate access key',
      error: error.message,
    });
  }
};
