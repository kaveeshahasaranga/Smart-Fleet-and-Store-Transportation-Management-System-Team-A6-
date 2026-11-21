import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';

// Tests only write to a new database with a generated fleet_test_ name.
process.env.NODE_ENV = 'test';
process.env.DEV_MASTER_DATA_ACCESS = 'false';
process.env.JWT_SECRET = randomUUID() + randomUUID();
const { default: app } = await import('../src/app.js');
const { default: Vehicle } = await import('../src/modules/vehicles/vehicle.model.js');
const { default: Item } = await import('../src/modules/items/item.model.js');
let server;
let base;
const admin = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { subject: 'test-admin', expiresIn: '5m' });
const store = jwt.sign({ role: 'store' }, process.env.JWT_SECRET, { subject: 'test-store', expiresIn: '5m' });

before(async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27017', {
    dbName: `fleet_test_${randomUUID().replaceAll('-', '')}`, serverSelectionTimeoutMS: 5000,
  });
  await Promise.all([Vehicle.init(), Item.init()]);
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api`;
});
after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  if (mongoose.connection.name?.startsWith('fleet_test_')) await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
async function request(path, { method = 'GET', body, token = admin } = {}) {
  const response = await fetch(base + path, {
    method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, ...(response.status === 204 ? {} : await response.json()) };
}
const vehicle = { registration: 'WP TEST-1234', name: 'Test Truck', type: 'Truck', capacity: 100 };
const item = { name: 'Test Rice', category: 'Dry goods', unit: 'bag', weight: 25 };

test('API authenticates and enforces administrator writes', async () => {
  assert.equal((await request('/vehicles', { token: null })).status, 401);
  assert.equal((await request('/vehicles', { token: store })).status, 403);
  assert.equal((await request('/items', { method: 'POST', body: item, token: store })).status, 403);
  assert.equal((await request('/items', { token: store })).status, 200);
  const expired = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { subject: 'test', expiresIn: -1 });
  assert.equal((await request('/vehicles', { token: expired })).status, 401);
  assert.equal((await request('/vehicles', { token: jwt.sign({ role: 'admin' }, 'wrong', { subject: 'test', expiresIn: '5m' }) })).status, 401);
});

test('vehicle CRUD, uniqueness, filter, stale update and transit protection', async () => {
  const created = await request('/vehicles', { method: 'POST', body: vehicle });
  assert.equal(created.status, 201);
  const id = created.data.id;
  assert.equal((await request('/vehicles', { method: 'POST', body: { ...vehicle, registration: 'wp test-1234' } })).status, 409);
  assert.equal((await request('/vehicles?type=Truck&q=Test')).data.length, 1);
  assert.equal((await request('/vehicles?type=Van')).data.length, 0);
  const updated = await request(`/vehicles/${id}`, { method: 'PATCH', body: { capacity: 120, version: created.data.version } });
  assert.equal(updated.data.capacity, 120);
  assert.equal((await request(`/vehicles/${id}`, { method: 'PATCH', body: { capacity: 140, version: created.data.version } })).status, 409);
  assert.equal((await request(`/vehicles/${id}`, { method: 'PATCH', body: { status: 'In transit' } })).status, 200);
  assert.equal((await request(`/vehicles/${id}`, { method: 'DELETE' })).status, 409);
  await request(`/vehicles/${id}`, { method: 'PATCH', body: { status: 'Available' } });
  assert.equal((await request(`/vehicles/${id}`, { method: 'DELETE' })).status, 204);
  assert.equal((await request(`/vehicles/${id}`)).status, 404);
  assert.equal((await request('/vehicles')).data.length, 0);
});

test('catalog CRUD, case-insensitive uniqueness, invalid values and soft deletion', async () => {
  const created = await request('/items', { method: 'POST', body: item });
  assert.equal(created.status, 201);
  const id = created.data.id;
  assert.equal((await request('/items', { method: 'POST', body: { ...item, name: 'test rice' } })).status, 409);
  assert.equal((await request(`/items/${id}`, { method: 'PUT', body: { ...item, weight: 20, version: created.data.version } })).data.weight, 20);
  assert.equal((await request(`/items/${id}`, { method: 'PATCH', body: { weight: -2 } })).status, 400);
  assert.equal((await request(`/items/${id}`, { method: 'PATCH', body: { unit: 'kg' } })).status, 400);
  await request(`/items/${id}`, { method: 'PATCH', body: { status: 'Inactive' } });
  assert.equal((await request(`/items/${id}`, { token: store })).status, 404);
  assert.equal((await request('/items', { token: store })).data.length, 0);
  assert.equal((await request(`/items/${id}`, { method: 'DELETE' })).status, 204);
  assert.equal((await request(`/items/${id}`)).status, 404);
});

test('payload uses catalog weights, exact capacity, quantities, units and availability', async () => {
  const v = (await request('/vehicles', { method: 'POST', body: vehicle })).data;
  const i = (await request('/items', { method: 'POST', body: item })).data;
  const path = `/vehicles/${v.id}/validate-load`;
  const line = { itemId: i.id, quantity: 4, unit: 'bag' };
  const exact = await request(path, { method: 'POST', body: { lines: [line] } });
  assert.equal(exact.status, 200);
  assert.equal(exact.data.totalWeight, 100);
  assert.equal(exact.data.remainingCapacity, 0);
  for (const [change, status] of [[{ quantity: 5 }, 422], [{ quantity: -1 }, 400], [{ quantity: 0.5 }, 400], [{ unit: 'box' }, 400], [{ weight: 0 }, 400]]) {
    assert.equal((await request(path, { method: 'POST', body: { lines: [{ ...line, ...change }] } })).status, status);
  }
  assert.equal((await request(path, { method: 'POST', body: { lines: [line, line] } })).status, 400);
  const kg = (await request('/items', { method: 'POST', body: { ...item, name: 'Bulk Rice', unit: 'kg', weight: 1 } })).data;
  assert.equal((await request(path, { method: 'POST', body: { lines: [{ itemId: kg.id, quantity: 0.125, unit: 'kg' }] } })).data.totalWeight, 0.125);
  await request(`/items/${i.id}`, { method: 'PATCH', body: { status: 'Inactive' } });
  assert.equal((await request(path, { method: 'POST', body: { lines: [line] } })).status, 422);
  await request(`/vehicles/${v.id}`, { method: 'PATCH', body: { status: 'Maintenance' } });
  assert.equal((await request(path, { method: 'POST', body: { lines: [line] } })).status, 409);
});

test('malformed IDs, unknown fields and escaped search return client errors safely', async () => {
  assert.equal((await request('/vehicles/bad')).status, 400);
  assert.equal((await request('/items/000000000000000000000000')).status, 404);
  assert.equal((await request('/vehicles', { method: 'POST', body: { ...vehicle, extra: true } })).status, 400);
  assert.equal((await request('/vehicles?q=%5B')).status, 200);
  assert.equal((await request('/items?q=%5B')).status, 200);
  assert.equal((await request('/items?status=bad')).status, 400);
});


test('store booking lines are validated against current catalog data', async () => {
  const created = await request('/items', { method: 'POST', body: { ...item, name: 'Validation Test', weight: 0.125 } });
  const line = { itemId: created.data.id, quantity: 8, unit: 'bag' };
  const result = await request('/items/validate-lines', { method: 'POST', token: store, body: { lines: [line] } });
  assert.equal(result.status, 200);
  assert.equal(result.data.totalWeight, 1);
  await request(`/items/${created.data.id}`, { method: 'DELETE' });
  assert.equal((await request('/items/validate-lines', { method: 'POST', token: store, body: { lines: [line] } })).status, 422);
});

test('concurrent edits cannot overwrite the same version', async () => {
  const created = await request('/vehicles', { method: 'POST', body: { ...vehicle, registration: 'WP RACE-1234' } });
  const responses = await Promise.all([150, 200].map(capacity => request(`/vehicles/${created.data.id}`, {
    method: 'PATCH', body: { capacity, version: created.data.version },
  })));
  assert.deepEqual(responses.map(response => response.status).sort(), [200, 409]);
});

test('production never accepts localhost development access', async () => {
  const { env } = await import('../src/config/env.js');
  const original = { nodeEnv: env.nodeEnv, devMasterDataAccess: env.devMasterDataAccess };
  try {
    env.nodeEnv = 'production';
    env.devMasterDataAccess = true;
    assert.equal((await request('/vehicles', { token: null })).status, 401);
  } finally { Object.assign(env, original); }
});
