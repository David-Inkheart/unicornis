import express from 'express';
import { getTransactionLogsHandler } from './routeHandlers/transaction';
import authMiddleware from '../middleWares/authMiddleware';

const transactionRouter = express.Router();

// use auth middleware to protect the routes below
transactionRouter.use(authMiddleware);
transactionRouter.get('/logs', getTransactionLogsHandler);

export default transactionRouter;
