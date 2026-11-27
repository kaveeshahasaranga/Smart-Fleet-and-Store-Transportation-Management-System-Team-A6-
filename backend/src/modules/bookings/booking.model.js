import mongoose from 'mongoose';

const bookingItemSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    itemName: { type: String, required: true },
    unit: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0.001 },
    unitWeight: { type: Number, required: true, min: 0.001 },
    weight: { type: Number, required: true, min: 0.001 },
  },
  { _id: false }
);

const receivedItemSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    itemName: { type: String, required: true },
    unit: { type: String, required: true },
    expectedQuantity: { type: Number, required: true, min: 0.001 },
    receivedQuantity: { type: Number, required: true, min: 0 },
    acceptedQuantity: { type: Number, required: true, min: 0 },
    condition: { type: String, required: true, enum: ['Good', 'Short', 'Extra', 'Damaged', 'Damaged and short'] },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: { type: String, required: true, unique: true },
    storeId: { type: String, required: true, index: true },
    destinationStoreId: { type: String, required: true },
    deliveryDate: { type: String, required: true },
    deliverySlot: {
      type: String,
      required: true,
      enum: ['Morning (08:00 AM – 12:00 PM)', 'Afternoon (12:00 PM – 04:00 PM)', 'Evening (04:00 PM – 08:00 PM)'],
    },
    contactName: { type: String, required: true, maxlength: 100 },
    contactPhone: { type: String, required: true, maxlength: 32 },
    instructions: { type: String, default: '', maxlength: 1000 },
    items: { type: [bookingItemSchema], required: true, validate: value => value.length > 0 },
    totalWeight: { type: Number, required: true, min: 0.001 },
    status: {
      type: String,
      required: true,
      enum: ['Pending Review', 'Approved', 'Rejected', 'Completed', 'Cancelled'],
      default: 'Pending Review',
    },
    reviewStatus: { type: String, required: true, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    reviewNote: { type: String, default: '' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    goodsConfirmation: {
      confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      confirmedAt: { type: Date },
      items: { type: [receivedItemSchema] },
      discrepancyNote: { type: String, maxlength: 500 },
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, optimisticConcurrency: true }
);

bookingSchema.index({ storeId: 1, createdAt: -1 });
bookingSchema.index({ status: 1, reviewStatus: 1, createdAt: -1 });

export default mongoose.model('Booking', bookingSchema);
