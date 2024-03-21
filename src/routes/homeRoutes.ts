import express from 'express';
import { getHomeHandler } from './routeHandlers/home';

const homeRouter = express.Router();

homeRouter.get('/', getHomeHandler);

export default homeRouter;
