/**
 * Redis client singleton (ioredis)
 * Feature: academic-potential-test
 */

import Redis from 'ioredis';
import { config } from './env';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis(config.redis.url, {
      // Retry strategy: exponential backoff capped at 30s
      retryStrategy(times: number) {
        const delay = Math.min(times * 200, 30000);
        return delay;
      },
      // Don't crash if Redis is unavailable at startup
      lazyConnect: true,
      enableOfflineQueue: true,
      maxRetriesPerRequest: 3,
    });

    redisClient.on('connect', () => {
      console.info('[Redis] Connected');
    });

    redisClient.on('error', (err: Error) => {
      console.error('[Redis] Connection error:', err.message);
    });

    redisClient.on('reconnecting', () => {
      console.warn('[Redis] Reconnecting...');
    });
  }

  return redisClient;
}

export async function connectRedis(): Promise<void> {
  const client = getRedisClient();
  await client.connect();
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.info('[Redis] Disconnected');
  }
}

// ─── Helper utilities ─────────────────────────────────────────────────────────

/** Add a JWT jti to the blacklist with a TTL equal to its remaining lifetime */
export async function blacklistToken(jti: string, remainingTtlSeconds: number): Promise<void> {
  const client = getRedisClient();
  await client.set(`blacklist:${jti}`, '1', 'EX', remainingTtlSeconds);
}

/** Check if a JWT jti is blacklisted */
export async function isTokenBlacklisted(jti: string): Promise<boolean> {
  const client = getRedisClient();
  const value = await client.get(`blacklist:${jti}`);
  return value !== null;
}

/** Store a refresh token hash */
export async function setRefreshToken(
  userId: string,
  tokenId: string,
  hashedToken: string,
  ttlSeconds: number
): Promise<void> {
  const client = getRedisClient();
  await client.set(`refresh:${userId}:${tokenId}`, hashedToken, 'EX', ttlSeconds);
}

/** Get a refresh token hash */
export async function getRefreshToken(userId: string, tokenId: string): Promise<string | null> {
  const client = getRedisClient();
  return client.get(`refresh:${userId}:${tokenId}`);
}

/** Delete a refresh token */
export async function deleteRefreshToken(userId: string, tokenId: string): Promise<void> {
  const client = getRedisClient();
  await client.del(`refresh:${userId}:${tokenId}`);
}

/** Delete all refresh tokens for a user (token family revocation) */
export async function deleteAllRefreshTokens(userId: string): Promise<void> {
  const client = getRedisClient();
  const keys = await client.keys(`refresh:${userId}:*`);
  if (keys.length > 0) {
    await client.del(...keys);
  }
}
