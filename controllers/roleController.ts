import { Request, Response } from 'express';
import { RoleService } from '../services/roleService';
import { jsonResponse } from '../utils/jsonResponse';
import logger from '../utils/logger';

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management endpoints
 */
  /**
   * @swagger
   * /api/roles:
   *   get:
   *     summary: List roles
   *     tags: [Roles]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: q
   *         schema:
   *           type: string
   *         description: Search query
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *         description: Page size
   *     responses:
   *       200:
   *         description: List of roles
   */
  /**
   * @swagger
   * /api/roles:
   *   post:
   *     summary: Create a new role
   *     tags: [Roles]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       201:
   *         description: Role created
   *       400:
   *         description: Bad request
   */
  /**
   * @swagger
   * /api/roles/{id}:
   *   get:
   *     summary: Get role by ID
   *     tags: [Roles]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Role found
   *       404:
   *         description: Not found
   */
  /**
   * @swagger
   * /api/roles/{id}:
   *   put:
   *     summary: Update role by ID
   *     tags: [Roles]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       200:
   *         description: Role updated
   *       400:
   *         description: Bad request
   */
  /**
   * @swagger
   * /api/roles/{id}:
   *   delete:
   *     summary: Delete role by ID
   *     tags: [Roles]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       204:
   *         description: Role deleted
   *       400:
   *         description: Bad request
   */

export class RoleController {
  static async create(req: Request, res: Response) {
    const startTime = Date.now();
    try {
      const { name, description } = req.body;
      const role = await RoleService.createRole(name, description);
      logger.info(`Role created: ${role.id} (${role.name}) by user ${req.user?.id || 'unknown'}`);
      return jsonResponse({
        res,
        status: 'success',
        message: 'Role created successfully',
        data: { role },
        code: 201,
        startTime
      });
    } catch (err: any) {
      logger.error(`Failed to create role: ${err.message}`, { stack: err.stack });
      return jsonResponse({
        res,
        status: 'fail',
        message: err.message,
        code: 400,
        startTime
      });
    }
  }

  static async findAll(req: Request, res: Response) {
    const startTime = Date.now();
    try {
      const { q, page, offset } = req.query;
      const pageNum = page ? Number(page) : 1;
      const limit = offset ? Number(offset) : 10;
      const result = await RoleService.getAllRoles({
        q: typeof q === 'string' ? q : undefined,
        page: pageNum,
        offset: limit,
      });
      const total_page = Math.ceil(result.total / limit);
      logger.info(`Roles fetched (page ${pageNum}, limit ${limit}) by user ${req.user?.id || 'unknown'}`);
      return jsonResponse({
        res,
        status: 'success',
        message: 'Roles fetched successfully',
        data: result.data,
        meta: {
          page: pageNum,
          limit,
          total_page,
          count: result.total
        },
        startTime
      });
    } catch (err: any) {
      logger.error(`Failed to fetch roles: ${err.message}`, { stack: err.stack });
      return jsonResponse({
        res,
        status: 'fail',
        message: err.message,
        code: 400,
        startTime
      });
    }
  }

  static async findOne(req: Request, res: Response) {
    const startTime = Date.now();
    try {
      const id = Number(req.params.id);
      const role = await RoleService.getRoleById(id);
      if (!role) {
        logger.warn(`Role not found: id=${id}`);
        return jsonResponse({
          res,
          status: 'fail',
          message: 'Role not found',
          code: 404,
          startTime
        });
      }
      logger.info(`Role fetched: ${role.id} (${role.name}) by user ${req.user?.id || 'unknown'}`);
      return jsonResponse({
        res,
        status: 'success',
        message: 'Role fetched successfully',
        data: { role },
        startTime
      });
    } catch (err: any) {
      logger.error(`Failed to fetch role: ${err.message}`, { stack: err.stack });
      return jsonResponse({
        res,
        status: 'fail',
        message: err.message,
        code: 400,
        startTime
      });
    }
  }

  static async update(req: Request, res: Response) {
    const startTime = Date.now();
    try {
      const id = Number(req.params.id);
      const { name, description } = req.body;
      const role = await RoleService.updateRole(id, name, description);
      logger.info(`Role updated: ${role.id} (${role.name}) by user ${req.user?.id || 'unknown'}`);
      return jsonResponse({
        res,
        status: 'success',
        message: 'Role updated successfully',
        data: { role },
        startTime
      });
    } catch (err: any) {
      logger.error(`Failed to update role: ${err.message}`, { stack: err.stack });
      return jsonResponse({
        res,
        status: 'fail',
        message: err.message,
        code: 400,
        startTime
      });
    }
  }

  static async delete(req: Request, res: Response) {
    const startTime = Date.now();
    try {
      const id = Number(req.params.id);
      await RoleService.deleteRole(id);
      logger.info(`Role deleted: id=${id} by user ${req.user?.id || 'unknown'}`);
      return jsonResponse({
        res,
        status: 'success',
        message: 'Role deleted successfully',
        data: {},
        code: 204,
        startTime
      });
    } catch (err: any) {
      logger.error(`Failed to delete role: ${err.message}`, { stack: err.stack });
      return jsonResponse({
        res,
        status: 'fail',
        message: err.message,
        code: 400,
        startTime
      });
    }
  }
}
