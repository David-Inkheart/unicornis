import express from 'express';
import {
  createProductHandler,
  editProductHandler,
  getProductByIdHandler,
  getProductListHandler,
  outOfStockHandler,
  removeProductHandler,
  restockProductHandler,
} from './routeHandlers/product';
import authMiddleware from '../middleWares/authMiddleware';

const productRouter = express.Router();

// use auth middleware to protect the routes below
productRouter.use(authMiddleware);
productRouter.post('/:categoryId/create', createProductHandler);
productRouter.get('/list', getProductListHandler);
productRouter.get('/out-of-stock', outOfStockHandler);
productRouter.get('/:id', getProductByIdHandler);
productRouter.delete('/:id', removeProductHandler);
productRouter.patch('/:id/update', editProductHandler);
productRouter.patch('/:id/restock', restockProductHandler);

export default productRouter;
