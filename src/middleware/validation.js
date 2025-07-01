import { body, param, query, validationResult } from 'express-validator';
import { ValidationError } from './errorHandler.js';

// Middleware to check validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Invalid request parameters', errors.array());
  }
  next();
};

// Campaign validation rules
export const campaignValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Campaign name is required')
    .isLength({ max: 100 })
    .withMessage('Campaign name must be less than 100 characters'),

  body('templateId').trim().notEmpty().withMessage('Template ID is required'),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 150 })
    .withMessage('Subject must be less than 150 characters'),

  validate,
];

// Contact list validation rules
export const contactListValidation = [
  body('listId').trim().notEmpty().withMessage('List ID is required'),

  body('contacts')
    .isArray()
    .withMessage('Contacts must be an array')
    .notEmpty()
    .withMessage('Contacts array cannot be empty'),

  body('contacts.*.email')
    .trim()
    .notEmpty()
    .withMessage('Email is required for each contact')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('contacts.*.firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name must be less than 50 characters'),

  body('contacts.*.lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name must be less than 50 characters'),

  validate,
];

// Template validation rules
export const templateValidation = [
  param('templateId').trim().notEmpty().withMessage('Template ID is required'),

  validate,
];

// Pagination validation rules
export const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  validate,
];
