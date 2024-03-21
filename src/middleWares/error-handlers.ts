import { Request, Response, NextFunction } from 'express';
import { NOT_FOUND_ERROR } from '../utils/constants/error';
import logger from '../utils/winston';

const jwtErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'JsonWebTokenError') {
    logger.error(`Authentication failed: ${err.message}`);
    return res.status(401).json({
      success: false,
      error: 'Authentication failed: Invalid token',
    });
  }
  if (err.name === 'TokenExpiredError') {
    logger.error(`Authentication failed: ${err.message}`);
    return res.status(401).json({
      success: false,
      error: 'Authentication failed: Token expired',
    });
  }
  return next(err);
};

const NotFoundErrorHandler = (req: Request, res: Response) => {
  logger.error(`Resource not found: ${req.url}`);
  logger.info(`Method: ${req.method}`);
  res.status(NOT_FOUND_ERROR.code).json({
    success: false,
    message: NOT_FOUND_ERROR.message,
  });
};

const unhandledErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return jwtErrorHandler(err, req, res, next);
  }

  logger.error(err.stack);
  return res.status(500).json({
    success: false,
    message: 'There was a problem processing your request, please try again later',
  });
};

export { jwtErrorHandler, NotFoundErrorHandler, unhandledErrorHandler };
