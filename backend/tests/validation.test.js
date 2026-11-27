import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateVehicle, validateItem } from '../src/validators/masterData.js';
import { validateLineQuantities } from '../src/validators/load.js';

const vehicle = { registration: ' wp  lk-1234 ', name: 'Delivery Truck', type: 'Truck', capacity: 1000 };
const item = { name: 'Rice', category: 'Dry goods', unit: 'bag', weight: 25 };
const id = 'abcdefabcdefabcdefabcdef';

test('normalizes vehicle registrations and defaults optional fields', () => {
  assert.deepEqual(validateVehicle(vehicle), { registration: 'WP LK-1234', name: 'Delivery Truck', type: 'Truck', capacity: 1000, driver: '', status: 'Available' });
});
test('rejects invalid capacity, unit, category and unexpected write fields', () => {
  for (const capacity of [0, -1, Infinity, NaN, '1000', 0.0001, 1000001]) assert.throws(() => validateVehicle({ ...vehicle, capacity }));
  assert.throws(() => validateVehicle({ ...vehicle, deletedAt: null }));
  assert.throws(() => validateItem({ ...item, unit: 'ton' }));
  assert.throws(() => validateItem({ ...item, category: 'unknown' }));
  assert.throws(() => validateItem({ ...item, unit: 'kg', weight: 25 }));
  assert.equal(validateItem({ ...item, unit: 'kg', weight: 1 }).weight, 1);
});
test('partial updates validate supplied fields and version', () => {
  assert.deepEqual(validateVehicle({ status: 'Maintenance' }, true), { status: 'Maintenance' });
  assert.throws(() => validateItem({}, true));
  assert.throws(() => validateVehicle({ capacity: 10, version: -1 }, true));
});
test('rejects empty, duplicate, malformed and client-weight item lines', () => {
  for (const lines of [[], null, [{ itemId: 'bad', quantity: 1, unit: 'bag' }], [{ itemId: id, quantity: 0, unit: 'bag' }], [{ itemId: id, quantity: '1', unit: 'bag' }], [{ itemId: id, quantity: 1 }], [{ itemId: id, quantity: 1, unit: 'bag', weight: 0 }], [{ itemId: id, quantity: 1, unit: 'bag' }, { itemId: id.toUpperCase(), quantity: 1, unit: 'bag' }]]) {
    assert.throws(() => validateLineQuantities(lines));
  }
});
