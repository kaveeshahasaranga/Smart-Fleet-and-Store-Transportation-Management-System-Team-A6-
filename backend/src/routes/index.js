import { Router } from 'express';
import mongoose from 'mongoose';
import storeRoutes from '../modules/stores/store.routes.js';
import scheduleRoutes from '../modules/schedules/schedule.routes.js';
import vehicleRoutes from '../modules/vehicles/vehicle.routes.js';
import itemRoutes from '../modules/items/item.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import bookingRoutes from '../modules/bookings/booking.routes.js';

const router = Router();
router.get('/health', (_req, res) =>
  res.json({
    status: 'ok',
    service: 'smart-fleet-store-api',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
);
router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/stores', storeRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/items', itemRoutes);

export default router;
