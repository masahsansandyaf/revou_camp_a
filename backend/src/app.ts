/**
 * Express application setup
 * Feature: academic-potential-test
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { config } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// ─── Route imports (stubs for now; filled in later tasks) ─────────────────────
// import authRoutes from './routes/auth';
// import packageRoutes from './routes/packages';
// import sessionRoutes from './routes/sessions';
// import resultRoutes from './routes/results';
// import leaderboardRoutes from './routes/leaderboard';
// import adminRoutes from './routes/admin';

const app = express();

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Rate limiting (global) ───────────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', code: 'TOO_MANY_REQUESTS', message: 'Too many requests' },
  })
);

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());

// ─── Logging ──────────────────────────────────────────────────────────────────
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
}

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API routes ───────────────────────────────────────────────────────────────
// app.use('/api/auth', authRoutes);
// app.use('/api/packages', packageRoutes);
// app.use('/api/sessions', sessionRoutes);
// app.use('/api/results', resultRoutes);
// app.use('/api/leaderboard', leaderboardRoutes);
// app.use('/api/admin', adminRoutes);

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
