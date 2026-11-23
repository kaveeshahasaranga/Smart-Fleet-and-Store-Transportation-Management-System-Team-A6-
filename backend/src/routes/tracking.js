import { Router } from 'express';
import {
  getLatestVehicleLocation,
  ingestVehicleLocation,
  listLatestVehicleLocations,
  listVehicleLocationHistory,
} from '../models/VehicleLocation.js';

const router = Router();
const asyncRoute = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const optionalNumber = (value, name, min, max) => {
  if (value === undefined || value === null || value === '') return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) {
    const error = new Error(`${name} must be between ${min} and ${max}.`);
    error.status = 400;
    throw error;
  }
  return number;
};

router.post('/locations', asyncRoute(async (req, res) => {
  const body = req.body;
  if (!isRecord(body)) return res.status(400).json({ message: 'GPS data must be sent as a JSON object.' });
  const vehicleId = String(body.vehicleId || '').trim();
  if (!vehicleId || vehicleId.length > 100) return res.status(400).json({ message: 'A vehicle ID of 1 to 100 characters is required.' });

  const latitude = optionalNumber(body.latitude ?? body.lat, 'Latitude', -90, 90);
  const longitude = optionalNumber(body.longitude ?? body.lng ?? body.lon, 'Longitude', -180, 180);
  if (latitude === null || longitude === null) return res.status(400).json({ message: 'Latitude and longitude are required.' });

  const registration = String(body.registration || '').trim();
  const tripCode = String(body.tripCode || '').trim();
  if (registration.length > 40) return res.status(400).json({ message: 'Vehicle registration cannot exceed 40 characters.' });
  if (tripCode.length > 64) return res.status(400).json({ message: 'Trip code cannot exceed 64 characters.' });

  let recordedAt = new Date();
  if (body.recordedAt !== undefined) {
    recordedAt = new Date(body.recordedAt);
    if (Number.isNaN(recordedAt.getTime())) return res.status(400).json({ message: 'recordedAt must be a valid date/time.' });
    if (recordedAt.getTime() > Date.now() + 5 * 60 * 1000) {
      return res.status(400).json({ message: 'recordedAt cannot be more than five minutes in the future.' });
    }
  }

  const speedKph = optionalNumber(body.speedKph ?? body.speed, 'Speed', 0, 400);
  const heading = optionalNumber(body.heading ?? body.headingDeg, 'Heading', 0, 360);
  const result = await ingestVehicleLocation({
    vehicleId,
    tripCode: tripCode || null,
    registration,
    latitude,
    longitude,
    speedKph,
    heading,
    recordedAt,
  });
  res.status(202).json(result);
}));

router.get('/locations', asyncRoute(async (req, res) => {
  const locations = await listLatestVehicleLocations({ tripCode: String(req.query.tripCode || '').trim() || undefined });
  res.json({ locations });
}));

router.get('/locations/:vehicleId/history', asyncRoute(async (req, res) => {
  const history = await listVehicleLocationHistory(req.params.vehicleId, req.query.limit);
  res.json({ history });
}));

router.get('/locations/:vehicleId', asyncRoute(async (req, res) => {
  const location = await getLatestVehicleLocation(req.params.vehicleId);
  if (!location) return res.status(404).json({ message: 'No GPS location found for this vehicle.' });
  res.json({ location });
}));

export default router;
