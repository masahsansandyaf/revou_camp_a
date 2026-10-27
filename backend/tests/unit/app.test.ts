/**
 * Basic smoke test — verifies the Express app boots and health check responds
 * Feature: academic-potential-test
 */

import request from 'supertest';
import app from '../../src/app';

describe('App', () => {
  it('GET /health returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok' });
  });

  it('GET /unknown-route returns 404', async () => {
    const res = await request(app).get('/api/unknown-route-that-does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ status: 'error', code: 'NOT_FOUND' });
  });
});
