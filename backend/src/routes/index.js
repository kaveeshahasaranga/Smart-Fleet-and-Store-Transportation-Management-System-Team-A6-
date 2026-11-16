import { Router } from 'express';
import trips from './trips.js';

const router = Router();
router.get('/health', (_req, res) => res.json({ status: 'ok', service: 'smart-fleet-store-api' }));
router.use('/trips', trips);
export default router;
