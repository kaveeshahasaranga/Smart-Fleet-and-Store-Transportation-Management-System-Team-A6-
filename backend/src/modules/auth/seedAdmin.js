import { env } from '../../config/env.js';
import { connectDatabase } from '../../config/database.js';
import { createAdminAccount } from './auth.service.js';
import mongoose from 'mongoose';

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before running this command.');
}

try {
  await connectDatabase(env.mongoUri);
  const admin = await createAdminAccount({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });
  console.log(`Administrator account created: ${admin.email}`);
} finally {
  await mongoose.disconnect();
}
