import { createServer } from 'node:http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { attachSocketServer } from './sockets/index.js';

const httpServer = createServer(app);
const io = attachSocketServer(httpServer, env.clientUrl);
app.set('io', io);

try {
  await connectDatabase();
  httpServer.listen(env.port, () => console.log(`API and Socket.IO listening on port ${env.port}`));
} catch (error) {
  io.close();
  console.error('Startup failed:', error.message);
  process.exitCode = 1;
}
