import { Router } from 'express';
import {
  getSchedules,
  addSchedule,
  updateSchedule,
  removeSchedule,
} from './schedule.controller.js';

const router = Router();

router.get('/', getSchedules);
router.post('/', addSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', removeSchedule);

export default router;