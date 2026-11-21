import mongoose from 'mongoose';

const tripStopSchema = new mongoose.Schema({
  stopId: { type: String, required: true, trim: true, maxlength: 100 },
  bookingId: { type: String, trim: true, maxlength: 100, default: '' },
  name: { type: String, required: true, trim: true, maxlength: 160 },
  city: { type: String, trim: true, maxlength: 100, default: '' },
  contact: { type: String, trim: true, maxlength: 100, default: '' },
  load: { type: Number, min: 0, default: 0 },
  cartons: { type: Number, min: 0, validate: Number.isInteger, default: 0 },
  notes: { type: String, maxlength: 500, default: '' },
  eta: { type: String, trim: true, maxlength: 40, default: '' },
  distance: { type: Number, min: 0, default: 0 },
  tag: { type: String, trim: true, maxlength: 60, default: 'Store drop-off' },
  sequence: { type: Number, min: 1, validate: Number.isInteger, required: true },
}, { _id: false });

const tripSchema = new mongoose.Schema({
  tripCode: { type: String, required: true, unique: true, trim: true },
  vehicle: {
    id: { type: String, required: true, trim: true, maxlength: 100 },
    registration: { type: String, required: true, trim: true, maxlength: 40 },
    name: { type: String, trim: true, maxlength: 100, default: '' },
    type: { type: String, trim: true, maxlength: 60, default: '' },
    capacity: { type: Number, min: 0, required: true },
  },
  driver: { type: String, required: true, trim: true, maxlength: 100 },
  driverPhone: { type: String, trim: true, maxlength: 25, default: '' },
  departure: { type: String, required: true, trim: true, maxlength: 40 },
  returnTime: { type: String, trim: true, maxlength: 40, default: '' },
  origin: { type: String, trim: true, maxlength: 160, default: 'Western Depot #04 (Colombo Central Hub Bay 04)' },
  notes: { type: String, maxlength: 500, default: '' },
  bookingIds: { type: [{ type: String, trim: true, maxlength: 100 }], default: [] },
  stops: { type: [tripStopSchema], default: [] },
  totalLoad: { type: Number, min: 0, default: 0 },
  totalDistance: { type: Number, min: 0, default: 0 },
  status: { type: String, enum: ['Draft', 'Ready to Stage', 'Scheduled', 'In Transit', 'Completed', 'Cancelled'], default: 'Ready to Stage' },
}, { timestamps: true, versionKey: false });

tripSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Trip || mongoose.model('Trip', tripSchema);
