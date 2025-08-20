import { Router } from 'express';
import { RoleController } from '../controllers/roleController';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// Public or protected routes, adjust middleware as needed
router.get('/', authenticateJWT, RoleController.findAll);
router.get('/:id', authenticateJWT, RoleController.findOne);
router.post('/', authenticateJWT, authorizeRoles(['admin']), RoleController.create);
router.put('/:id', authenticateJWT, authorizeRoles(['admin']), RoleController.update);
router.delete('/:id', authenticateJWT, authorizeRoles(['admin']), RoleController.delete);

export default router;
