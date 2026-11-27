import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true, maxlength: 254 },
    role: { type: String, required: true, enum: ['admin', 'store'], default: 'store' },
    phone: { type: String, trim: true, maxlength: 32, required() { return this.role === 'store'; } },
    storeId: { type: String, trim: true, required() { return this.role === 'store'; } },
    storeLocation: { type: String, trim: true, maxlength: 120, required() { return this.role === 'store'; } },
    storeRole: { type: String, enum: ['staff', 'manager'], required() { return this.role === 'store'; } },
    passwordHash: { type: String, required: true, select: false },
    tokenVersion: { type: Number, default: 0 },
    resetTokenHash: { type: String, select: false },
    resetTokenExpiresAt: { type: Date, select: false },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
