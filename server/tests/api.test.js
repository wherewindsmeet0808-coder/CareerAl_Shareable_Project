import test from 'node:test';
import assert from 'node:assert';
import app from '../src/index.js';

test('GET /api/health returns healthy system status', async () => {
  // Use Node 20 native fetch
  const res = await fetch('http://localhost:5000/api/health');
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'healthy');
  assert.ok(data.databaseMode, 'Should declare database mode');
  assert.ok(data.aiEngine, 'Should declare AI engine status');
});

test('POST /api/auth/register validates empty input', async () => {
  const res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.strictEqual(data.success, false);
});
