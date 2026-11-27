import mongoose from 'mongoose';
import { itemCategories, itemUnits, itemStatuses } from '../../validators/masterData.js';

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  nameKey: { type: String, required: true },
  category: { type: String, required: true, enum: itemCategories },
  unit: { type: String, required: true, enum: itemUnits },
  weight: { type: Number, required: true, min: 0.001, max: 1000000 },
  status: { type: String, enum: itemStatuses, default: 'Active' },
  deletedAt: { type: Date, default: null },
}, { timestamps: true, optimisticConcurrency: true });

schema.pre('validate', function () {
  this.nameKey = this.name?.toLowerCase();
  if (this.unit === 'kg' && this.weight !== 1) this.invalidate('weight', 'A kg unit must weigh 1 kg.');
});
schema.index({ nameKey: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
export default mongoose.model('Item', schema);
