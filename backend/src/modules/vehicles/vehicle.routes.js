import { Router } from 'express';
import Vehicle from './vehicle.model.js';
import { asyncHandler, httpError, serialize } from '../../utils/http.js';
import { objectBody, validateId, validateVehicle, validateVersion, enumValue, vehicleStatuses, vehicleTypes } from '../../validators/masterData.js';
import { authenticateMasterData, requireMasterDataAdmin, requireMasterDataDatabase } from '../../middleware/masterDataAccess.js';
import { validatePayloadCapacity } from '../../validators/load.js';

const router = Router();
router.use(authenticateMasterData, requireMasterDataAdmin, requireMasterDataDatabase);
router.get('/', asyncHandler(async (req, res) => {
  const filter = { deletedAt: null };
  if (req.query.status) filter.status = enumValue(req.query.status, vehicleStatuses, 'status');
  if (req.query.type) filter.type = enumValue(req.query.type, vehicleTypes, 'type');
  if (req.query.q) {
    if (typeof req.query.q !== 'string' || req.query.q.length > 100) throw httpError(400, 'Search must be at most 100 characters.');
    const search = { $regex: req.query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    filter.$or = [{ name: search }, { registration: search }];
  }
  res.json({ data: (await Vehicle.find(filter).sort({ registration: 1 })).map(serialize) });
}));
router.get('/:id', asyncHandler(async (req, res) => {
  validateId(req.params.id);
  const vehicle = await Vehicle.findOne({ _id: req.params.id, deletedAt: null });
  if (!vehicle) throw httpError(404, 'Vehicle not found.');
  res.json({ data: serialize(vehicle) });
}));
router.post('/', asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.create(validateVehicle(req.body));
  res.status(201).json({ data: serialize(vehicle) });
}));
async function update(req, res) {
  validateId(req.params.id);
  const fields = validateVehicle(req.body, req.method === 'PATCH');
  const vehicle = await Vehicle.findOne({ _id: req.params.id, deletedAt: null });
  if (!vehicle) throw httpError(404, 'Vehicle not found.');
  if (req.body.version !== undefined && req.body.version !== vehicle.__v) throw httpError(409, 'Vehicle changed. Refresh and try again.');
  Object.assign(vehicle, fields);
  await vehicle.save();
  res.json({ data: serialize(vehicle) });
}
router.put('/:id', asyncHandler(update));
router.patch('/:id', asyncHandler(update));
router.delete('/:id', asyncHandler(async (req, res) => {
  validateId(req.params.id);
  const body = req.body ?? {};
  objectBody(body, ['version']);
  validateVersion(body);
  const vehicle = await Vehicle.findOne({ _id: req.params.id, deletedAt: null });
  if (!vehicle) throw httpError(404, 'Vehicle not found.');
  if (body.version !== undefined && body.version !== vehicle.__v) throw httpError(409, 'Vehicle changed. Refresh and try again.');
  if (vehicle.status === 'In transit') throw httpError(409, 'A vehicle in transit cannot be deleted.');
  vehicle.deletedAt = new Date();
  await vehicle.save();
  res.status(204).end();
}));
router.post('/:vehicleId/validate-load', (req, _res, next) => {
  try { objectBody(req.body, ['lines']); next(); } catch (error) { next(error); }
}, validatePayloadCapacity, (req, res) => res.json({ data: req.validatedLoad }));
export default router;
