import { Router } from 'express';

const router = Router();
router.get('/health', (_req, res) => res.json({ status: 'ok', service: 'smart-fleet-store-api' }));

// Mount feature routers here as each module is implemented.
export default router;
