import express from 'express';
import { changePasswordHandler, confirmResetPasswordHandler, loginHandler, registerHandler, resetPasswordHandler } from './routeHandlers/auth';
import authMiddleware from '../middleWares/authMiddleware';

const authRouter = express.Router();

authRouter.post('/register', registerHandler);
authRouter.post('/login', loginHandler);
authRouter.post('/reset-password', resetPasswordHandler);
authRouter.post('/reset-password/confirm', confirmResetPasswordHandler);

// use auth middleware to protect the routes below
authRouter.use(authMiddleware);
authRouter.post('/change-password', changePasswordHandler);

export default authRouter;
