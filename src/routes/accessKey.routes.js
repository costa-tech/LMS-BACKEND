import express from 'express';
import {
  createAccessKey,
  getAllAccessKeys,
  getAccessKeyById,
  updateAccessKey,
  deleteAccessKey,
  validateAccessKey,
} from '../controllers/accessKey.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route - validate access key
router.post('/validate', validateAccessKey);

// Protected routes - require authentication
router.use(verifyToken);

// Admin routes for managing access keys
router.post('/', createAccessKey);
router.get('/', getAllAccessKeys);
router.get('/:id', getAccessKeyById);
router.put('/:id', updateAccessKey);
router.delete('/:id', deleteAccessKey);

export default router;
