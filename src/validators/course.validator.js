/**
 * Course Validators
 * Validates course data inputs
 */

import { body, validationResult } from 'express-validator';

/**
 * Validation rules for creating/updating courses
 */
export const courseValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Course title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Course description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  
  body('instructor')
    .trim()
    .notEmpty()
    .withMessage('Instructor name is required'),
  
  body('duration')
    .trim()
    .notEmpty()
    .withMessage('Duration is required'),
  
  body('level')
    .notEmpty()
    .withMessage('Course level is required')
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced'])
    .withMessage('Invalid course level'),
  
  body('price')
    .trim()
    .notEmpty()
    .withMessage('Price is required'),
  
  body('students')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Students must be a positive number'),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
];

/**
 * Check validation results
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  
  next();
};

export default { courseValidator, validate };
