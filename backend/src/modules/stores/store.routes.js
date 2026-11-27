import { Router } from 'express';
import {
  getStores,
  getStore,
  addStore,
  updateStore,
  addBay,
  removeStore,
} from './store.controller.js';
import { authenticateMasterData, requireMasterDataDatabase } from '../../middleware/masterDataAccess.js';
import { requireRoles, requireStoreScope } from '../../middleware/storeScope.js';

const router = Router();

router.use(authenticateMasterData, requireMasterDataDatabase);
router.get('/', requireStoreScope, getStores);
router.get('/:storeId', requireStoreScope, getStore);
router.use(requireRoles('admin'));
router.post('/', addStore);
router.put('/:storeId', updateStore);
router.post('/:storeId/bays', addBay);
router.delete('/:storeId', removeStore);

export default router;