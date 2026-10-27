/**
 * JWT authentication middleware
 * Feature: academic-potential-test
 */

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { isTokenBlacklisted } from '../config/redis';
import { UnauthorizedError } from '../utils/errors';
import type { UserRole } from '@apt/shared';

export interface JWTPayload {
  sub: string; // user ID
  role: UserRole;
  jti: string; // unique JWT ID for blacklisting
  iat: number;
  exp: number;
}

// Extend Express Request to carry authenticated user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export async function jwtMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or malformed authorization token', 'MISSING_TOKEN'));
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, config.jwt.secret, {
      algorithms: ['HS256'],
    }) as JWTPayload;

    // Check blacklist (logout / revocation)
    const revoked = await isTokenBlacklisted(payload.jti);
    if (revoked) {
      return next(new UnauthorizedError('Token has been revoked', 'TOKEN_REVOKED'));
    }

    req.user = payload;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token', 'INVALID_TOKEN'));
  }
}

/** RBAC middleware — only allows the specified role (admin can access everything) */
export function requireRole(role: UserRole) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }
    // admin can access all endpoints; user can only access user-level endpoints
    if (req.user.role !== role && req.user.role !== 'admin') {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
}

// Import here to avoid circular dep (errors -> middleware -> errors)
import { ForbiddenError } from '../utils/errors';
