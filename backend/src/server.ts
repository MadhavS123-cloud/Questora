import dotenv from 'dotenv';
import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { initializeWebSocket } from './socket/gateway';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Connect to database
  await connectDB();

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
