import { apiRequest } from './api.js';

const jsonRequest = (method, value) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(value),
});

export async function listTrips() {
  return apiRequest('/trips');
}

export async function getTrip(tripCode) {
  return apiRequest(`/trips/${encodeURIComponent(tripCode)}`);
}

export async function createTrip(trip) {
  return apiRequest('/trips', jsonRequest('POST', trip));
}

export async function updateTrip(tripCode, changes) {
  return apiRequest(`/trips/${encodeURIComponent(tripCode)}`, jsonRequest('PATCH', changes));
}
