// main router for the app
import express from 'express';

import authMiddleware from '../middleWares/authMiddleware';
import { changePasswordHandler, loginHandler, registerHandler } from './routeHandlers/auth';
import { getHomeHandler } from './routeHandlers/home';

const router = express.Router();

router.get('/', getHomeHandler);
router.post('/auth/register', registerHandler);
router.post('/auth/login', loginHandler);

// use auth middleware to protect the routes below
router.use(authMiddleware);
router.post('/auth/change-password', changePasswordHandler);

export default router;
