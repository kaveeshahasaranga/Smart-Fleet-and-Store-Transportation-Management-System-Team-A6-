import { Router } from 'express';
import trips from './trips.js';
import tracking from './tracking.js';
import dashboard from './dashboard.js';
import reports from './reports.js';

const router = Router();
router.get('/health', (_req, res) => res.json({ status: 'ok', service: 'smart-fleet-store-api' }));
router.use('/trips', trips);
router.use('/tracking', tracking);
router.use('/dashboard', dashboard);
router.use('/reports', reports);
export default router;
