/**
 * Prisma client singleton
 * Feature: academic-potential-test
 */

import { PrismaClient } from '@prisma/client';

// Use a singleton to avoid too many DB connections in development (hot reload)
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
  console.info('[DB] Connected to PostgreSQL via Prisma');
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  console.info('[DB] Disconnected from PostgreSQL');
}
