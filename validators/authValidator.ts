import { body } from 'express-validator';

export const loginValidation = [
    body('identifier')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Username or email is required'),
    body('password')
        .isString()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
];

export const registerValidation = [
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('email').isString().isEmail().trim().notEmpty().withMessage('Email is required'),
    body('username').isString().trim().notEmpty().withMessage('Username is required'),
    body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('roles').optional().isArray().withMessage('Roles must be an array of strings'),
    body('roles.*').optional().isString().trim(),
];
