import mongoose from 'mongoose';

export async function connectDatabase(uri) {
  if (!uri) throw new Error('MONGODB_URI is required. Configure backend/.env first.');
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}
