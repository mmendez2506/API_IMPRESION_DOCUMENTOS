import { Router } from 'express';
import printRoutes from './documents/print.routes.js';

const router = Router();
router.use('/documents', printRoutes);
export default router;
