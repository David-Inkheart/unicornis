import { Request, Response, NextFunction } from 'express';

class CustomError extends Error {
  statusCode: number;

  data: any;

  constructor(message: string, statusCode: number, data: any) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

const jwtErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed: Invalid token',
    });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed: Token expired',
    });
  }
  return next(err);
};

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, message, data } = err;
  res.status(statusCode).json({
    success: false,
    message,
    data,
  });
  return next();
};

export { CustomError, errorHandler, jwtErrorHandler };
