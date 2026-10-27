/**
 * Global error handling middleware
 * Feature: academic-potential-test
 */

import type { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import { sendError } from '../utils/response';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ValidationError) {
    sendError(res, err.statusCode, err.code, err.message, err.details);
    return;
  }

  if (err instanceof AppError && err.isOperational) {
    sendError(res, err.statusCode, err.code, err.message);
    return;
  }

  // Unexpected / programming errors — don't leak details
  console.error('[ErrorHandler] Unexpected error:', err);
  sendError(res, 500, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred');
}

export function notFoundHandler(_req: Request, res: Response): void {
  sendError(res, 404, 'NOT_FOUND', 'The requested resource was not found');
}
