import { Router } from 'express';
import { queryTrackingReport, queryTripReport } from '../models/Dashboard.js';

const router = Router();
const asyncRoute = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const tripStatuses = ['Draft', 'Ready to Stage', 'Scheduled', 'In Transit', 'Completed', 'Cancelled'];

function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function validDate(value) {
  if (!datePattern.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function parseRange(query) {
  const from = query.from ? String(query.from) : '';
  const to = query.to ? String(query.to) : '';
  for (const [name, value] of [['from', from], ['to', to]]) {
    if (value && !validDate(value)) throw badRequest(`${name} must use a valid YYYY-MM-DD date.`);
  }
  if (from && to && from > to) throw badRequest('from must be on or before to.');
  return { from: from || undefined, to: to || undefined };
}

function pagination(query) {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? 50 : Number(query.limit);
  if (!Number.isInteger(page) || page < 1) throw badRequest('page must be a positive integer.');
  if (!Number.isInteger(limit) || limit < 1 || limit > 200) throw badRequest('limit must be an integer between 1 and 200.');
  return { page, limit };
}

router.get('/trips', asyncRoute(async (req, res) => {
  const range = parseRange(req.query);
  const { page, limit } = pagination(req.query);
  const status = req.query.status ? String(req.query.status) : '';
  if (status && !tripStatuses.includes(status)) throw badRequest(`status must be one of: ${tripStatuses.join(', ')}.`);
  const vehicleId = String(req.query.vehicleId || '').trim();
  const tripCode = String(req.query.tripCode || '').trim();
  const driver = String(req.query.driver || '').trim();
  if (vehicleId.length > 100 || tripCode.length > 64 || driver.length > 100) throw badRequest('One or more report filters exceed the allowed length.');

  const report = await queryTripReport({ ...range, status, vehicleId, tripCode, driver, page, limit });
  res.json(report);
}));

router.get('/tracking', asyncRoute(async (req, res) => {
  const range = parseRange(req.query);
  const { page, limit } = pagination(req.query);
  const vehicleId = String(req.query.vehicleId || '').trim();
  const tripCode = String(req.query.tripCode || '').trim();
  if (vehicleId.length > 100 || tripCode.length > 64) throw badRequest('One or more report filters exceed the allowed length.');

  const report = await queryTrackingReport({ ...range, vehicleId, tripCode, page, limit });
  res.json(report);
}));

export default router;
