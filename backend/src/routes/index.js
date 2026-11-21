import { Router } from 'express';

import vehicles from '../modules/vehicles/vehicle.routes.js';
import items from '../modules/items/item.routes.js';

const router = Router();
router.use('/vehicles', vehicles);
router.use('/items', items);
router.get('/health', (_req, res) => res.json({ status: 'ok', service: 'smart-fleet-store-api' }));

// Mount feature routers here as each module is implemented.
export default router;
