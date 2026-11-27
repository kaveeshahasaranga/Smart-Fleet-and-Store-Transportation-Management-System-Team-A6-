import { Router } from 'express';
import {
  getStores,
  getStore,
  addStore,
  updateStore,
  addBay,
  removeStore,
} from './store.controller.js';

const router = Router();

router.get('/', getStores);
router.post('/', addStore);
router.get('/:storeId', getStore);
router.put('/:storeId', updateStore);
router.post('/:storeId/bays', addBay);
router.delete('/:storeId', removeStore);

export default router;