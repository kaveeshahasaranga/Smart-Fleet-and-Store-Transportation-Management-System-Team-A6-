import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    storeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String, required: true },
    coords: { type: String, default: '6.8649° N, 79.8997° E' },
    contact: { type: String, required: true },
    phone: { type: String, required: true },
    hours: { type: String, default: '07:00 – 21:00' },
    isShifted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['Active', 'Active Depot', 'Maintenance', 'Inactive'],
      default: 'Active',
    },
    classification: { type: String, default: 'Central Distribution Center' },
    geofenceBuffer: { type: String, default: '250m' },
    standardIntakeWindow: { type: String, default: '60 Minutes' },
    maxSimultaneousCarriers: { type: String, default: '6 Carriers' },
    sanitationBuffer: { type: String, default: '15 Minutes' },
    autoConflictPrevention: { type: Boolean, default: true },
    overstayPenaltyAlert: { type: Boolean, default: true },
    bays: [
      {
        bayNumber: String,
        name: String,
        status: String,
        ruleEnabled: Boolean,
        maxPayload: String,
        carrierRoster: String,
        unloadPace: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Store', storeSchema);