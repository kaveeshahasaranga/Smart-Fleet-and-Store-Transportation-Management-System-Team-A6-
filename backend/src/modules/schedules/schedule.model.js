import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    storeId: { type: String, required: true, default: 'STR-305' },
    bayNumber: { type: String, required: true }, // "01", "02", "03", "04"
    bookingCode: { type: String }, // e.g., "BK-8849"
    companyName: { type: String, required: true }, // e.g., "Keells Supply Chain SL"
    slotType: {
      type: String,
      enum: ['confirmed', 'pending', 'offline', 'standard', 'available'],
      default: 'standard',
    },
    badgeText: { type: String }, // e.g., "Unloaded", "Intake Active", "OFFLINE"
    timeRange: { type: String, required: true }, // e.g., "12:00 - 15:00"
    startCol: { type: Number, required: true }, // Grid start column (1 to 9)
    endCol: { type: Number, required: true }, // Grid end column (2 to 10)
    note: { type: String }, // e.g., "Awaiting Driver", "Cap 85%"
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  },
  { timestamps: true }
);

export default mongoose.model('Schedule', scheduleSchema);