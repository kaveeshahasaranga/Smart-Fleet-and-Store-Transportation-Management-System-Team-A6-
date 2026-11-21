import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

import Vehicle from './modules/vehicles/vehicle.model.js';
import Item from './modules/items/item.model.js';

try {
  await connectDatabase(env.mongoUri);
  await Promise.all([Vehicle.init(), Item.init()]);
  if (env.nodeEnv === 'development' && env.devMasterDataAccess) console.warn('Local development master-data access is enabled.');
  app.listen(env.port, () => console.log(`API listening on port ${env.port}`));
} catch (error) {
  console.error('Startup failed:', error.message);
  process.exitCode = 1;
}
