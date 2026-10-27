/**
 * Environment variable validation and typed config
 * Feature: academic-potential-test
 */

import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

export const config = {
  nodeEnv: optionalEnv('NODE_ENV', 'development'),
  port: parseInt(optionalEnv('PORT', '3001'), 10),
  corsOrigin: optionalEnv('CORS_ORIGIN', 'http://localhost:5173'),

  database: {
    url: requireEnv('DATABASE_URL'),
  },

  redis: {
    url: requireEnv('REDIS_URL'),
  },

  jwt: {
    secret: requireEnv('JWT_SECRET'),
    accessExpiresIn: optionalEnv('JWT_ACCESS_EXPIRES_IN', '60m'),
    refreshExpiresIn: optionalEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  },

  smtp: {
    host: optionalEnv('SMTP_HOST', 'smtp.mailtrap.io'),
    port: parseInt(optionalEnv('SMTP_PORT', '587'), 10),
    secure: optionalEnv('SMTP_SECURE', 'false') === 'true',
    user: optionalEnv('SMTP_USER', ''),
    pass: optionalEnv('SMTP_PASS', ''),
    from: optionalEnv('SMTP_FROM', 'no-reply@apt.example.com'),
  },

  appUrl: optionalEnv('APP_URL', 'http://localhost:5173'),
  backendUrl: optionalEnv('BACKEND_URL', 'http://localhost:3001'),

  bcryptCost: parseInt(optionalEnv('BCRYPT_COST', '12'), 10),

  rateLimit: {
    windowMs: parseInt(optionalEnv('RATE_LIMIT_WINDOW_MS', '900000'), 10),
    max: parseInt(optionalEnv('RATE_LIMIT_MAX', '100'), 10),
  },
} as const;

export type Config = typeof config;
