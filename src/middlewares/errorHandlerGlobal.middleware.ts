import { NextFunction, Request, Response } from 'express';
import { AppError } from '../helpers/app-errors.helper';

export const errorHandlerMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const status = err.statusCode || 500
  const msg = err.message || 'Something went wrong!'
  res.status(status).json(msg)
} 