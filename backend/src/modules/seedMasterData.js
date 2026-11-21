import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { connectDatabase } from '../config/database.js';
import Vehicle from './vehicles/vehicle.model.js';
import Item from './items/item.model.js';

if (env.nodeEnv === 'production') throw new Error('Sample seeding is only available outside production.');
try {
  await connectDatabase(env.mongoUri);
  await Promise.all([Vehicle.init(), Item.init()]);
  const vehicles = [
    { registration: 'WP LK-4821', name: 'Delivery Truck 01', type: 'Truck', capacity: 3500, driver: 'Nimal Perera', status: 'Available' },
    { registration: 'WP CAD-7392', name: 'Delivery Van 02', type: 'Van', capacity: 1000, driver: 'Kamal Silva', status: 'In transit' },
    { registration: 'CP LB-2156', name: 'Delivery Truck 03', type: 'Truck', capacity: 5000, driver: 'Sunil Fernando', status: 'Maintenance' },
    { registration: 'SP CAB-6048', name: 'Delivery Van 04', type: 'Van', capacity: 1200, driver: '', status: 'Inactive' },
  ];
  const items = [
    { name: 'Rice bags', category: 'Dry goods', unit: 'bag', weight: 25, status: 'Active' },
    { name: 'Milk cartons', category: 'Dairy', unit: 'carton', weight: 12, status: 'Active' },
    { name: 'Fresh vegetables', category: 'Produce', unit: 'crate', weight: 15, status: 'Active' },
  ];
  for (const vehicle of vehicles) {
    if (!await Vehicle.exists({ registration: vehicle.registration, deletedAt: null })) await Vehicle.create(vehicle);
  }
  for (const item of items) {
    if (!await Item.exists({ nameKey: item.name.toLowerCase(), deletedAt: null })) await Item.create(item);
  }
  console.log('Sample master data is ready. Existing records were preserved.');
} finally {
  await mongoose.disconnect();
}
