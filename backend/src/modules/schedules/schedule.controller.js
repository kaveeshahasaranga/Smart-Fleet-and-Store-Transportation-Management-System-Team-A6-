import * as scheduleService from './schedule.service.js';

export const getSchedules = async (req, res, next) => {
  try {
    const storeId = req.query.storeId || 'STR-305';
    const schedules = await scheduleService.getSchedulesByStore(storeId);
    res.status(200).json({ success: true, count: schedules.length, data: schedules });
  } catch (error) {
    next(error);
  }
};

export const addSchedule = async (req, res, next) => {
  try {
    const newSlot = await scheduleService.createScheduleSlot(req.body);
    res.status(201).json({ success: true, data: newSlot });
  } catch (error) {
    next(error);
  }
};

export const updateSchedule = async (req, res, next) => {
  try {
    const updated = await scheduleService.updateScheduleSlot(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Schedule slot not found' });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const removeSchedule = async (req, res, next) => {
  try {
    const deleted = await scheduleService.deleteScheduleSlot(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Schedule slot not found' });
    }
    res.status(200).json({ success: true, message: 'Slot removed' });
  } catch (error) {
    next(error);
  }
};