import express from 'express';
import {
  createCourseContent,
  getCourseContent,
  updateCourseContent,
  deleteCourseContent,
  getCourseContentByCourseId,
} from '../controllers/courseContent.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected routes
router.use(verifyToken);

// Get content for a specific course
router.get('/course/:courseId', getCourseContentByCourseId);

// CRUD operations for course content
router.post('/', createCourseContent);
router.get('/:id', getCourseContent);
router.put('/:id', updateCourseContent);
router.delete('/:id', deleteCourseContent);

export default router;
