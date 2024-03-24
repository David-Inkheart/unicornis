import express from 'express';
import { createProductHandler, getProductListHandler } from './routeHandlers/product';
import authMiddleware from '../middleWares/authMiddleware';

const productRouter = express.Router();

// use auth middleware to protect the routes below
productRouter.use(authMiddleware);
productRouter.post('/:categoryId/create', createProductHandler);
productRouter.get('/list', getProductListHandler);

export default productRouter;
