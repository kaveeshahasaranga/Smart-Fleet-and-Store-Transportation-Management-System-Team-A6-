import mongoose from 'mongoose';

mongoose.connection.on('error', (err) => {
  console.warn('MongoDB connection warning:', err.message);
});

export async function connectDatabase(uri) {
  if (!uri) throw new Error('MONGODB_URI is required. Configure backend/.env first.');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
  console.log('MongoDB connected');
}