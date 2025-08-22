import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/authService';
import logger from '../utils/logger';
import { jsonResponse } from '../utils/jsonResponse';
import { RegisterUserParams } from 'types/params/RegisterUserParams';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - username
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                    type: string
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Bad request
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh JWT access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */


export class AuthController {
  static async register(req: Request, res: Response) {
    const startTime = Date.now();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return jsonResponse({
        res,
        status: 'fail',
        message: 'Validation failed',
        errors: errors.array(),
        code: 400,
        startTime
      })
    }
    try {
      const { name, email, username, password, roles }: RegisterUserParams = req.body;
      const user = await AuthService.register({ name, email, username, password, roles });
      logger.info(`User registered: ${user.id} (${user.username})`);
      return jsonResponse({
        res,
        status: 'success',
        message: 'User registered successfully',
        data: { user },
        code: 201,
        startTime
      });
    } catch (err: any) {
      logger.error(`Failed to register user: ${err.message}`, { stack: err.stack });
      return jsonResponse({
        res,
        status: 'fail',
        message: err.message,
        code: 400,
        startTime
      });
    }
  }

  static async login(req: Request, res: Response) {
    const startTime = Date.now();
    try {
      const { identifier, password } = req.body;
      const result = await AuthService.login(identifier, password);
      logger.info(`User login: ${result.user.id} (${result.user.username})`);
      return jsonResponse({
        res,
        status: 'success',
        message: 'Login successful',
        data: result,
        startTime
      });
    } catch (err: any) {
      logger.warn(`Failed login attempt for identifier: ${req.body.identifier} - ${err.message}`);
      return jsonResponse({
        res,
        status: 'fail',
        message: err.message,
        code: 401,
        startTime
      });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    const startTime = Date.now();
    try {
      const { refreshToken } = req.body;
      const accessToken = await AuthService.refreshToken(refreshToken);
      logger.info('Access token refreshed');
      return jsonResponse({
        res,
        status: 'success',
        message: 'Token refreshed successfully',
        data: { accessToken },
        startTime
      });
    } catch (err: any) {
      logger.warn(`Failed to refresh token: ${err.message}`);
      return jsonResponse({
        res,
        status: 'fail',
        message: err.message,
        code: 401,
        startTime
      });
    }
  }

  static async getMe(req: Request, res: Response) {
    const startTime = Date.now();
    try {
      const userId = req.user?.id;
      if (!userId) {
        logger.warn('Unauthorized access to getMe');
        return jsonResponse({
          res,
          status: 'fail',
          message: 'Unauthorized',
          code: 401,
          startTime
        });
      }
      const user = await AuthService.getMe(userId);
      logger.info(`Fetched user profile: ${user.id} (${user.username})`);
      return jsonResponse({
        res,
        status: 'success',
        message: 'User profile fetched successfully',
        data: { user },
        startTime
      });
    } catch (err: any) {
      logger.error(`Failed to fetch user profile: ${err.message}`, { stack: err.stack });
      return jsonResponse({
        res,
        status: 'fail',
        message: err.message,
        code: 404,
        startTime
      });
    }
  }
}
