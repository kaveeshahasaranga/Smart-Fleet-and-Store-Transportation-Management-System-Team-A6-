import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import Trip from '../models/Trip.js';

const router = Router();
const asyncRoute = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const mutableFields = ['vehicle', 'driver', 'driverPhone', 'departure', 'returnTime', 'origin', 'notes', 'bookingIds', 'stops', 'totalLoad', 'totalDistance', 'status'];
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const finiteNonNegative = value => Number.isFinite(Number(value)) && Number(value) >= 0;

router.get('/', asyncRoute(async (_req, res) => {
  const trips = await Trip.find().sort({ createdAt: -1 }).lean();
  res.json({ trips });
}));

router.post('/', asyncRoute(async (req, res) => {
  const body = req.body;
  if (!isRecord(body)) return res.status(400).json({ message: 'Trip details must be sent as a JSON object.' });

  const { vehicle, driver, departure } = body;
  if (!isRecord(vehicle) || !String(vehicle.id || '').trim() || !String(vehicle.registration || '').trim() || !finiteNonNegative(vehicle.capacity)) {
    return res.status(400).json({ message: 'Choose a vehicle with a recorded payload capacity.' });
  }
  if (!String(driver || '').trim() || !String(departure || '').trim()) {
    return res.status(400).json({ message: 'Lead driver and departure time are required.' });
  }

  if (body.stops !== undefined && !Array.isArray(body.stops)) {
    return res.status(400).json({ message: 'Stops must be provided as an ordered list.' });
  }
  const stops = body.stops || [];
  for (const [index, stop] of stops.entries()) {
    if (!isRecord(stop) || !String(stop.stopId || '').trim() || !String(stop.name || '').trim()) {
      return res.status(400).json({ message: `Stop ${index + 1} requires a stop ID and destination name.` });
    }
    if (!finiteNonNegative(stop.load ?? 0) || !finiteNonNegative(stop.cartons ?? 0) || !Number.isInteger(Number(stop.cartons ?? 0)) || !finiteNonNegative(stop.distance ?? 0)) {
      return res.status(400).json({ message: `Stop ${index + 1} has an invalid load, carton count, or distance.` });
    }
  }
  if (body.totalLoad !== undefined && !finiteNonNegative(body.totalLoad)) {
    return res.status(400).json({ message: 'Trip load must be a non-negative number.' });
  }
  if (body.totalDistance !== undefined && !finiteNonNegative(body.totalDistance)) {
    return res.status(400).json({ message: 'Trip distance must be a non-negative number.' });
  }
  const totalLoad = Number(body.totalLoad ?? stops.reduce((sum, stop) => sum + Number(stop.load || 0), 0));
  if (totalLoad > Number(vehicle.capacity)) {
    return res.status(400).json({ message: 'Trip load exceeds the selected vehicle capacity.' });
  }

  const trip = await Trip.create({
    ...Object.fromEntries(mutableFields.filter(field => field in body).map(field => [field, body[field]])),
    tripCode: String(body.tripCode || `TRP-${randomUUID().slice(0, 8).toUpperCase()}`).trim(),
    totalLoad,
    stops: stops.map((stop, sequence) => ({ ...stop, sequence: sequence + 1 })),
  });
  res.location(`/api/trips/${encodeURIComponent(trip.tripCode)}`).status(201).json({ trip });
}));

router.get('/:tripCode', asyncRoute(async (req, res) => {
  const trip = await Trip.findOne({ tripCode: req.params.tripCode }).lean();
  if (!trip) return res.status(404).json({ message: 'Trip not found.' });
  res.json({ trip });
}));

router.patch('/:tripCode', asyncRoute(async (req, res) => {
  const updates = Object.fromEntries(mutableFields.filter(field => field in (req.body || {})).map(field => [field, req.body[field]]));
  if (Array.isArray(updates.stops)) updates.stops = updates.stops.map((stop, sequence) => ({ ...stop, sequence: sequence + 1 }));
  const existing = await Trip.findOne({ tripCode: req.params.tripCode });
  if (!existing) return res.status(404).json({ message: 'Trip not found.' });
  const nextLoad = updates.totalLoad ?? (updates.stops ? updates.stops.reduce((sum, stop) => sum + Number(stop.load || 0), 0) : existing.totalLoad);
  const nextCapacity = Number(updates.vehicle?.capacity ?? existing.vehicle.capacity);
  if (nextLoad > nextCapacity) return res.status(400).json({ message: 'Trip load exceeds the selected vehicle capacity.' });
  if (updates.stops && !('totalLoad' in updates)) updates.totalLoad = nextLoad;
  existing.set(updates);
  const trip = await existing.save();
  res.json({ trip });
}));

export default router;
