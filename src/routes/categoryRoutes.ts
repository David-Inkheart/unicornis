import express from 'express';
import {
  createCategoryHandler,
  editCategoryHandler,
  getCategoryByIdHandler,
  listCategoryHandler,
  removeCategoryHandler,
} from './routeHandlers/category';
import authMiddleware from '../middleWares/authMiddleware';

const categoryRouter = express.Router();

// use auth middleware to protect the routes below
categoryRouter.use(authMiddleware);
categoryRouter.post('/create', createCategoryHandler);
categoryRouter.get('/list', listCategoryHandler);
categoryRouter.get('/list/:id', getCategoryByIdHandler);
categoryRouter.patch('/update/:id', editCategoryHandler);
categoryRouter.delete('/delete/:id', removeCategoryHandler);

export default categoryRouter;
