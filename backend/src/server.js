import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import Vehicle from './modules/vehicles/vehicle.model.js';
import Item from './modules/items/item.model.js';
import User from './modules/auth/user.model.js';
import Booking from './modules/bookings/booking.model.js';

try {
  if (env.mongoUri) {
    await connectDatabase(env.mongoUri);
    await Promise.all([Vehicle.init(), Item.init(), User.init(), Booking.init()]);
  } else {
    console.warn('Running without MongoDB. Store/schedule preview storage remains available.');
  }
} catch (error) {
  console.warn('MongoDB startup failed:', error.message);
}

if (env.nodeEnv === 'development' && env.devMasterDataAccess) {
  console.warn('Local development master-data access is enabled.');
}
app.listen(env.port, () => console.log(`API listening on port ${env.port}`));
