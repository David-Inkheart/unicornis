import express from 'express';
import authRouter from './authRoutes';
import homeRouter from './homeRoutes';

const router = express.Router();

router.use('/', homeRouter);

// Authentication routes
router.use('/auth', authRouter);

// Additional routes here...

export default router;
