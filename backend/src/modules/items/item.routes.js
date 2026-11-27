import { Router } from 'express';
import Item from './item.model.js';
import { calculateLoad } from '../../validators/load.js';
import { asyncHandler, httpError, serialize } from '../../utils/http.js';
import { objectBody, validateId, validateItem, validateVersion, enumValue, itemStatuses, itemCategories } from '../../validators/masterData.js';
import { authenticateMasterData, requireMasterDataAdmin, requireMasterDataDatabase } from '../../middleware/masterDataAccess.js';

const router = Router();
const publicItem = record => {
  const { nameKey, ...item } = serialize(record);
  return item;
};

router.use(authenticateMasterData, requireMasterDataDatabase);
router.get('/', asyncHandler(async (req, res) => {
  const filter = { deletedAt: null };
  if (req.user.role !== 'admin') filter.status = 'Active';
  if (req.query.status) {
    const status = enumValue(req.query.status, itemStatuses, 'status');
    if (req.user.role !== 'admin' && status !== 'Active') throw httpError(403, 'Only active items are available.');
    filter.status = status;
  }
  if (req.query.category) filter.category = enumValue(req.query.category, itemCategories, 'category');
  if (req.query.q) {
    if (typeof req.query.q !== 'string' || req.query.q.length > 100) throw httpError(400, 'Search must be at most 100 characters.');
    filter.nameKey = { $regex: req.query.q.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') };
  }
  const items = await Item.find(filter).sort({ name: 1 });
  res.json({ data: items.map(publicItem) });
}));
router.post('/validate-lines', asyncHandler(async (req, res) => {
  objectBody(req.body, ['lines']);
  res.json({ data: await calculateLoad(req.body.lines) });
}));
router.get('/:id', asyncHandler(async (req, res) => {
  validateId(req.params.id);
  const filter = { _id: req.params.id, deletedAt: null };
  if (req.user.role !== 'admin') filter.status = 'Active';
  const item = await Item.findOne(filter);
  if (!item) throw httpError(404, 'Item not found.');
  res.json({ data: publicItem(item) });
}));
router.use(requireMasterDataAdmin);
router.post('/', asyncHandler(async (req, res) => {
  const item = await Item.create(validateItem(req.body));
  res.status(201).json({ data: publicItem(item) });
}));
async function update(req, res) {
  validateId(req.params.id);
  const fields = validateItem(req.body, req.method === 'PATCH');
  const item = await Item.findOne({ _id: req.params.id, deletedAt: null });
  if (!item) throw httpError(404, 'Item not found.');
  if (req.body.version !== undefined && req.body.version !== item.__v) throw httpError(409, 'Item changed. Refresh and try again.');
  Object.assign(item, fields);
  await item.save();
  res.json({ data: publicItem(item) });
}
router.put('/:id', asyncHandler(update));
router.patch('/:id', asyncHandler(update));
router.delete('/:id', asyncHandler(async (req, res) => {
  validateId(req.params.id);
  const body = req.body ?? {};
  objectBody(body, ['version']);
  validateVersion(body);
  const item = await Item.findOne({ _id: req.params.id, deletedAt: null });
  if (!item) throw httpError(404, 'Item not found.');
  if (body.version !== undefined && body.version !== item.__v) throw httpError(409, 'Item changed. Refresh and try again.');
  item.deletedAt = new Date();
  await item.save();
  res.status(204).end();
}));
export default router;
