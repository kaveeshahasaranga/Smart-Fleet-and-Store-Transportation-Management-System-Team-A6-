import { Router } from 'express';
import {
  getSchedules,
  addSchedule,
  updateSchedule,
  removeSchedule,
} from './schedule.controller.js';
import { authenticateMasterData, requireMasterDataDatabase } from '../../middleware/masterDataAccess.js';
import { requireRoles, requireStoreScope } from '../../middleware/storeScope.js';

const router = Router();

router.use(authenticateMasterData, requireMasterDataDatabase);
router.get('/', requireStoreScope, getSchedules);
router.use(requireRoles('admin'));
router.post('/', addSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', removeSchedule);

export default router;