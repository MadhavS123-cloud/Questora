import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketServer;

export function initializeWebSocket(server: HttpServer) {
  io = new SocketServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket client connected: ${socket.id}`);

    // Subscribe to a specific assignment generation room
    socket.on('join_assignment', (assignmentId: string) => {
      socket.join(`assignment:${assignmentId}`);
      console.log(`Socket client ${socket.id} joined room: assignment:${assignmentId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
}

// Push progress updates directly to subscribers in a room
export function sendAssignmentProgress(assignmentId: string, payload: {
  status: string;
  step: number;
  progressPercent: number;
  logs: string[];
}) {
  if (io) {
    io.to(`assignment:${assignmentId}`).emit('generation_progress', payload);
  }
}
