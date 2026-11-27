import Item from '../modules/items/item.model.js';
import Vehicle from '../modules/vehicles/vehicle.model.js';
import { httpError } from '../utils/http.js';
import { objectBody, positiveNumber, validateId } from './masterData.js';

export function validateLineQuantities(lines) {
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > 100) throw httpError(400, 'Provide between 1 and 100 item lines.');
  const seen = new Set();
  return lines.map(line => {
    objectBody(line, ['itemId', 'quantity', 'unit']);
    validateId(line.itemId);
    const itemId = line.itemId.toLowerCase();
    if (seen.has(itemId)) throw httpError(400, 'Each item may appear only once.');
    seen.add(itemId);
    positiveNumber(line.quantity, 'quantity');
    if (typeof line.unit !== 'string') throw httpError(400, 'Each line requires its catalog unit.');
    return { itemId, quantity: line.quantity, unit: line.unit };
  });
}

// Shared by the validation endpoint and future booking/trip write handlers.
export async function calculateLoad(lines) {
  const normalized = validateLineQuantities(lines);
  const items = await Item.find({ _id: { $in: normalized.map(line => line.itemId) }, deletedAt: null, status: 'Active' });
  const catalog = new Map(items.map(item => [String(item._id), item]));
  let totalGrams = 0;
  const resolvedLines = normalized.map(line => {
    const item = catalog.get(line.itemId);
    if (!item) throw httpError(422, 'An item is missing, inactive or deleted.', { itemId: line.itemId });
    if (item.unit !== line.unit) throw httpError(400, `Unit for ${item.name} must be ${item.unit}.`);
    if (item.unit !== 'kg' && !Number.isSafeInteger(line.quantity)) throw httpError(400, `Quantity for ${item.name} must be a whole number of ${item.unit}s.`);
    // Catalog weights and kg quantities have 3 decimal places. Work in integer grams.
    const grams = Math.round(item.weight * 1000) * line.quantity;
    if (!Number.isSafeInteger(grams)) throw httpError(400, 'The calculated load is too large or has unsupported precision.');
    totalGrams += grams;
    if (!Number.isSafeInteger(totalGrams)) throw httpError(400, 'The calculated load is too large.');
    return { ...line, itemName: item.name, unitWeight: item.weight, weight: grams / 1000 };
  });
  return { lines: resolvedLines, totalWeight: totalGrams / 1000 };
}

export async function validateVehicleLoad(vehicleId, lines) {
  validateId(vehicleId);
  const vehicle = await Vehicle.findOne({ _id: vehicleId, deletedAt: null });
  if (!vehicle) throw httpError(404, 'Vehicle not found.');
  if (vehicle.status !== 'Available') throw httpError(409, 'Vehicle is not available for allocation.');
  const load = await calculateLoad(lines);
  if (Math.round(load.totalWeight * 1000) > Math.round(vehicle.capacity * 1000)) {
    throw httpError(422, 'Load exceeds vehicle payload capacity.', { totalWeight: load.totalWeight, capacity: vehicle.capacity });
  }
  return { ...load, vehicleId, capacity: vehicle.capacity, remainingCapacity: (Math.round(vehicle.capacity * 1000) - Math.round(load.totalWeight * 1000)) / 1000 };
}

export async function validatePayloadCapacity(req, _res, next) {
  try {
    req.validatedLoad = await validateVehicleLoad(req.params.vehicleId ?? req.body?.vehicleId, req.body?.lines);
    next();
  } catch (error) { next(error); }
}
