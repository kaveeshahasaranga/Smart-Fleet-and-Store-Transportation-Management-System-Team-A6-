import { Router } from 'express';
import { getDashboardKpis } from '../models/Dashboard.js';

const router = Router();
const asyncRoute = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function validDate(value) {
  if (!datePattern.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function dateRange(query) {
  const from = query.from ? String(query.from) : '';
  const to = query.to ? String(query.to) : '';
  for (const [name, value] of [['from', from], ['to', to]]) {
    if (value && !validDate(value)) {
      const error = new Error(`${name} must use YYYY-MM-DD format.`);
      error.status = 400;
      throw error;
    }
  }
  if (from && to && from > to) {
    const error = new Error('from must be on or before to.');
    error.status = 400;
    throw error;
  }
  return { from: from || undefined, to: to || undefined };
}

router.get('/kpis', asyncRoute(async (req, res) => {
  const kpis = await getDashboardKpis(dateRange(req.query));
  res.json({ kpis });
}));

export default router;
