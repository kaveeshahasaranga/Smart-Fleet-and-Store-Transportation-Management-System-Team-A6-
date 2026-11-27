import mongoose from 'mongoose';
import Schedule from './schedule.model.js';
import {
  readSchedules,
  insertSchedule,
  patchSchedule,
  removeScheduleById,
} from '../stores/storage.service.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

export const getSchedulesByStore = async (storeId = 'STR-305') => {
  if (isDbConnected()) {
    return await Schedule.find({ storeId }).sort({ bayNumber: 1, startCol: 1 });
  }

  return readSchedules(storeId);
};

export const createScheduleSlot = async (slotData) => {
  if (isDbConnected()) {
    const slot = new Schedule(slotData);
    return await slot.save();
  }

  return insertSchedule(slotData);
};

export const updateScheduleSlot = async (id, updateData) => {
  if (isDbConnected()) {
    return await Schedule.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  return patchSchedule(id, updateData);
};

export const deleteScheduleSlot = async (id) => {
  if (isDbConnected()) {
    return await Schedule.findByIdAndDelete(id);
  }

  return removeScheduleById(id);
};