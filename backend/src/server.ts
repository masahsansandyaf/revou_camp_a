/**
 * Server entry point
 * Feature: academic-potential-test
 */

import app from './app';
import { config } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { connectRedis, disconnectRedis } from './config/redis';

async function start(): Promise<void> {
  try {
    await connectDatabase();
    await connectRedis();

    const server = app.listen(config.port, () => {
      console.info(`[Server] Running on port ${config.port} (${config.nodeEnv})`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.info(`[Server] Received ${signal}, shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        await disconnectRedis();
        console.info('[Server] Shutdown complete');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => void shutdown('SIGTERM'));
    process.on('SIGINT', () => void shutdown('SIGINT'));
  } catch (err) {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
  }
}

void start();
