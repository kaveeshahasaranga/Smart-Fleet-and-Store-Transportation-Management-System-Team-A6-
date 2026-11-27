import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

try {
  if (env.mongoUri) {
    await connectDatabase(env.mongoUri);
  } else {
    console.warn('Running without MongoDB connection (in-memory/test mode).');
  }
} catch (error) {
  console.warn('MongoDB connection skipped/failed in test mode:', error.message);
}

app.listen(env.port, () => console.log(`API listening on port ${env.port}`));