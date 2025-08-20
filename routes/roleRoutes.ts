import { Router } from 'express';
import { RoleController } from '../controllers/roleController';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// Example: router.post('/', authenticateJWT, authorizeRoles(['admin']), RoleController.createRole);

export default router;
