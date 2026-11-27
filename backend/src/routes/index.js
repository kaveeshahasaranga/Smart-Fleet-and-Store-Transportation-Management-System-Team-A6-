import { Router } from 'express';
import storeRoutes from '../modules/stores/store.routes.js';
import scheduleRoutes from '../modules/schedules/schedule.routes.js';

const router = Router();

router.get('/health', (_req, res) =>
  res.json({ status: 'ok', service: 'smart-fleet-store-api' })
);

router.use('/stores', storeRoutes);
router.use('/schedules', scheduleRoutes);

export default router;