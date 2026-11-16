import mongoose from 'mongoose';

const tripStopSchema = new mongoose.Schema({
  stopId: { type: String, required: true },
  bookingId: { type: String, default: '' },
  name: { type: String, required: true },
  city: { type: String, default: '' },
  contact: { type: String, default: '' },
  load: { type: Number, min: 0, default: 0 },
  cartons: { type: Number, min: 0, default: 0 },
  notes: { type: String, maxlength: 500, default: '' },
  eta: { type: String, default: '' },
  distance: { type: Number, min: 0, default: 0 },
  tag: { type: String, default: 'Store drop-off' },
  sequence: { type: Number, min: 0, required: true },
}, { _id: false });

const tripSchema = new mongoose.Schema({
  tripCode: { type: String, required: true, unique: true, trim: true },
  vehicle: {
    id: { type: String, required: true },
    registration: { type: String, required: true, trim: true },
    name: { type: String, default: '' },
    type: { type: String, default: '' },
    capacity: { type: Number, min: 0, required: true },
  },
  driver: { type: String, required: true, trim: true, maxlength: 100 },
  driverPhone: { type: String, trim: true, maxlength: 25, default: '' },
  departure: { type: String, required: true },
  returnTime: { type: String, default: '' },
  origin: { type: String, default: 'Western Depot #04 (Colombo Central Hub Bay 04)' },
  notes: { type: String, maxlength: 500, default: '' },
  bookingIds: { type: [String], default: [] },
  stops: { type: [tripStopSchema], default: [] },
  totalLoad: { type: Number, min: 0, default: 0 },
  totalDistance: { type: Number, min: 0, default: 0 },
  status: { type: String, enum: ['Draft', 'Ready to Stage', 'Scheduled', 'In Transit', 'Completed', 'Cancelled'], default: 'Ready to Stage' },
}, { timestamps: true, versionKey: false });

export default mongoose.models.Trip || mongoose.model('Trip', tripSchema);
