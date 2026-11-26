import { apiRequest } from './api.js';

function withQuery(path, filters = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
  }
  const suffix = query.toString();
  return apiRequest(suffix ? `${path}?${suffix}` : path);
}

export function getDashboardKpis(filters = {}) {
  return withQuery('/dashboard/kpis', filters);
}

export function getTripReport(filters = {}) {
  return withQuery('/reports/trips', filters);
}

export function getTrackingReport(filters = {}) {
  return withQuery('/reports/tracking', filters);
}
