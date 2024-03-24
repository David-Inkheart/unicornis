import express from 'express';
import authRouter from './authRoutes';
import homeRouter from './homeRoutes';
import categoryRouter from './categoryRoutes';
import productRouter from './productRoutes';

const router = express.Router();

router.use('/', homeRouter);

// Authentication routes
router.use('/auth', authRouter);

// Category routes
router.use('/category', categoryRouter);

// Product routes
router.use('/product', productRouter);

export default router;
