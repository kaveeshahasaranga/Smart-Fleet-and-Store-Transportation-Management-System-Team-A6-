import mongoose from 'mongoose';
import { vehicleTypes, vehicleStatuses } from '../../validators/masterData.js';

const schema = new mongoose.Schema({
  registration: { type: String, required: true, trim: true, uppercase: true, maxlength: 100 },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  type: { type: String, required: true, enum: vehicleTypes },
  capacity: { type: Number, required: true, min: 0.001, max: 1000000 },
  driver: { type: String, default: '', trim: true, maxlength: 100 },
  status: { type: String, enum: vehicleStatuses, default: 'Available' },
  deletedAt: { type: Date, default: null },
}, { timestamps: true, optimisticConcurrency: true });

schema.index({ registration: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
export default mongoose.model('Vehicle', schema);
