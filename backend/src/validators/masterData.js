import { httpError } from '../utils/http.js';

export const vehicleTypes = ['Truck', 'Van', 'Lorry'];
export const vehicleStatuses = ['Available', 'In transit', 'Maintenance', 'Inactive'];
export const itemCategories = ['Dry goods', 'Dairy', 'Produce', 'Beverages', 'Household', 'Other'];
export const itemUnits = ['bag', 'carton', 'crate', 'box', 'bottle', 'piece', 'kg'];
export const itemStatuses = ['Active', 'Inactive'];

export function objectBody(body, allowed) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw httpError(400, 'Send a JSON object.');
  }
  const unknown = Object.keys(body).filter(key => !allowed.includes(key));
  if (unknown.length) throw httpError(400, `Unknown fields: ${unknown.join(', ')}.`);
}

export function text(value, field, optional = false) {
  if (optional && value === undefined) return '';
  if (typeof value !== 'string' || value.trim().length > 100 || (!optional && !value.trim())) {
    throw httpError(400, `${field} must contain between 1 and 100 characters.`);
  }
  return value.trim();
}

export function positiveNumber(value, field) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value > 1000000) {
    throw httpError(400, `${field} must be a number greater than zero and at most 1,000,000.`);
  }
  if (Math.abs(value * 1000 - Math.round(value * 1000)) > 0.000001) {
    throw httpError(400, `${field} supports up to three decimal places.`);
  }
  return value;
}

export function enumValue(value, choices, field) {
  if (!choices.includes(value)) throw httpError(400, `${field} must be one of: ${choices.join(', ')}.`);
  return value;
}

export function validateId(id) {
  if (typeof id !== 'string' || !/^[a-f\d]{24}$/i.test(id)) throw httpError(400, 'Invalid record ID.');
}

export function validateVersion(body) {
  if (body.version !== undefined && (!Number.isSafeInteger(body.version) || body.version < 0)) {
    throw httpError(400, 'version must be a non-negative integer.');
  }
}

export function validateVehicle(body, partial = false) {
  const fields = ['registration', 'name', 'type', 'capacity', 'driver', 'status'];
  objectBody(body, [...fields, 'version']);
  validateVersion(body);
  const result = {};
  for (const field of fields) {
    if (partial && body[field] === undefined) continue;
    if (field === 'capacity') result[field] = positiveNumber(body[field], field);
    else if (field === 'type') result[field] = enumValue(body[field], vehicleTypes, field);
    else if (field === 'status') result[field] = enumValue(body[field] ?? 'Available', vehicleStatuses, field);
    else result[field] = text(body[field], field, field === 'driver');
  }
  if (!Object.keys(result).length) throw httpError(400, 'Provide at least one field to update.');
  if (result.registration) result.registration = result.registration.replace(/\s+/g, ' ').toUpperCase();
  return result;
}

export function validateItem(body, partial = false) {
  const fields = ['name', 'category', 'unit', 'weight', 'status'];
  objectBody(body, [...fields, 'version']);
  validateVersion(body);
  const result = {};
  for (const field of fields) {
    if (partial && body[field] === undefined) continue;
    if (field === 'weight') result[field] = positiveNumber(body[field], field);
    else if (field === 'category') result[field] = enumValue(body[field], itemCategories, field);
    else if (field === 'unit') result[field] = enumValue(body[field], itemUnits, field);
    else if (field === 'status') result[field] = enumValue(body[field] ?? 'Active', itemStatuses, field);
    else result[field] = text(body[field], field);
  }
  if (!Object.keys(result).length) throw httpError(400, 'Provide at least one field to update.');
  if (result.unit === 'kg' && result.weight !== undefined && result.weight !== 1) {
    throw httpError(400, 'An item measured in kg must have a weight per unit of 1 kg.');
  }
  return result;
}
