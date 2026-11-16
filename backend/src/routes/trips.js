import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import Trip from '../models/Trip.js';

const router = Router();
const asyncRoute = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const mutableFields = ['vehicle', 'driver', 'driverPhone', 'departure', 'returnTime', 'origin', 'notes', 'bookingIds', 'stops', 'totalLoad', 'totalDistance', 'status'];

router.get('/', asyncRoute(async (_req, res) => {
  const trips = await Trip.find().sort({ createdAt: -1 }).lean();
  res.json({ trips });
}));

router.post('/', asyncRoute(async (req, res) => {
  const { vehicle, driver, departure } = req.body || {};
  if (!vehicle?.id || !vehicle?.registration || !Number.isFinite(Number(vehicle.capacity))) {
    return res.status(400).json({ message: 'Choose a vehicle with a recorded payload capacity.' });
  }
  if (!String(driver || '').trim() || !String(departure || '').trim()) {
    return res.status(400).json({ message: 'Lead driver and departure time are required.' });
  }

  const stops = Array.isArray(req.body.stops) ? req.body.stops : [];
  const totalLoad = Number(req.body.totalLoad ?? stops.reduce((sum, stop) => sum + Number(stop.load || 0), 0));
  if (totalLoad > Number(vehicle.capacity)) {
    return res.status(400).json({ message: 'Trip load exceeds the selected vehicle capacity.' });
  }

  const trip = await Trip.create({
    ...Object.fromEntries(mutableFields.filter(field => field in req.body).map(field => [field, req.body[field]])),
    tripCode: String(req.body.tripCode || `TRP-${randomUUID().slice(0, 8).toUpperCase()}`).trim(),
    totalLoad,
    stops: stops.map((stop, sequence) => ({ ...stop, sequence: Number.isFinite(Number(stop.sequence)) ? Number(stop.sequence) : sequence + 1 })),
  });
  res.status(201).json({ trip });
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
