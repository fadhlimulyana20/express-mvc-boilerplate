import authRoutes from './authRoutes';
import roleRoutes from './roleRoutes';
import { Router } from 'express';

const router = Router();

router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);

export default router;
