import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { initRedis } from './config/redis';
import { initializeWebSocket } from './socket/gateway';

// Load environment variables from backend .env
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Connect to MongoDB
  await connectDB();
  console.log('MongoDB Connected');

  // Initialize Redis connection
  await initRedis();
  console.log('Redis Connected');

  // Create HTTP server
  const server = http.createServer(app);

  // Initialize WebSockets
  initializeWebSocket(server);

  server.listen(PORT, () => {
    console.log(`Questora backend server running on port: ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Critical boot error occurred on server:', error);
});
