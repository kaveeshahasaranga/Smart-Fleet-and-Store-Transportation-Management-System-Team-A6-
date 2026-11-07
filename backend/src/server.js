import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

try {
  await connectDatabase(env.mongoUri);
  app.listen(env.port, () => console.log(`API listening on port ${env.port}`));
} catch (error) {
  console.error('Startup failed:', error.message);
  process.exitCode = 1;
}
