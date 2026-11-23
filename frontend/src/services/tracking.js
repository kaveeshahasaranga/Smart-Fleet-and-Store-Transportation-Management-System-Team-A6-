import { apiRequest } from './api.js';
import { io } from 'socket.io-client';

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

export function subscribeVehicleLocationStream({ onLocation, onConnection } = {}) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const socket = io(new URL(apiUrl, window.location.origin).origin);
  const handleLocation = payload => {
    if (payload?.location) onLocation?.(payload.location);
  };
  socket.on('tracking:location', handleLocation);
  socket.on('connect', () => onConnection?.(true));
  socket.on('disconnect', () => onConnection?.(false));
  socket.on('connect_error', () => onConnection?.(false));
  return () => {
    socket.off('tracking:location', handleLocation);
    socket.disconnect();
  };
}
