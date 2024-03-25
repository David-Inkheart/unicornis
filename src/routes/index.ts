import express from 'express';
import authRouter from './authRoutes';
import homeRouter from './homeRoutes';
import categoryRouter from './categoryRoutes';
import productRouter from './productRoutes';
import transactionRouter from './transactionRoutes';

const router = express.Router();

router.use('/', homeRouter);
router.use('/auth', authRouter);
router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/transaction', transactionRouter);

export default router;
