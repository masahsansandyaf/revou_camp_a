/**
 * Standardized API response helpers
 * Feature: academic-potential-test
 */

import type { Response } from 'express';
import type { ApiSuccessResponse, ApiErrorResponse } from '@apt/shared';

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): Response {
  const body: ApiSuccessResponse<T> = { status: 'success', data };
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, string[]>
): Response {
  const body: ApiErrorResponse = { status: 'error', code, message, ...(details ? { details } : {}) };
  return res.status(statusCode).json(body);
}
