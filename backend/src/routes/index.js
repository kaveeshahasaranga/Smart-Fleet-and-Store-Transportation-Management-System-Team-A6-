import { Router } from 'express';
import storeRoutes from '../modules/stores/store.routes.js';
import scheduleRoutes from '../modules/schedules/schedule.routes.js';
import vehicleRoutes from '../modules/vehicles/vehicle.routes.js';
import itemRoutes from '../modules/items/item.routes.js';

const router = Router();
router.get('/health', (_req, res) =>
  res.json({ status: 'ok', service: 'smart-fleet-store-api' })
);
router.use('/stores', storeRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/items', itemRoutes);

export default router;
