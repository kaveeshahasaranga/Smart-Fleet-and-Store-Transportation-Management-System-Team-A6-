import { Router } from 'express';
import { authenticateMasterData, requireMasterDataDatabase } from '../../middleware/masterDataAccess.js';
import { requireRoles, requireStoreScope } from '../../middleware/storeScope.js';
import * as controller from './booking.controller.js';

const router = Router();

router.use(authenticateMasterData, requireMasterDataDatabase, requireRoles('admin', 'store'));
router.use(requireStoreScope);
router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id/handover', controller.handover);
router.post('/:id/goods-confirmation', requireRoles('store'), controller.confirm);
router.patch('/:id/review', requireRoles('admin'), controller.review);
router.get('/:id', controller.read);
router.put('/:id', controller.replace);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.remove);

export default router;
