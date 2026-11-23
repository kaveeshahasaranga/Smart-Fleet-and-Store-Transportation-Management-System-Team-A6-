import { apiRequest } from './api.js';

export async function listVehicleLocations(options = {}) {
  const query = options.tripCode ? `?tripCode=${encodeURIComponent(options.tripCode)}` : '';
  return apiRequest(`/tracking/locations${query}`);
}

export async function getVehicleLocation(vehicleId) {
  return apiRequest(`/tracking/locations/${encodeURIComponent(vehicleId)}`);
}

export async function getVehicleLocationHistory(vehicleId, limit = 100) {
  return apiRequest(`/tracking/locations/${encodeURIComponent(vehicleId)}/history?limit=${encodeURIComponent(limit)}`);
}

export async function ingestVehicleLocation(location) {
  return apiRequest('/tracking/locations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(location),
  });
}
