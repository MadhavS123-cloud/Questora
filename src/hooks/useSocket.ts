'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface GenerationProgressPayload {
  status: 'ingesting' | 'parsing' | 'synthesizing' | 'guardrails' | 'completed' | 'failed';
  step: number;
  progressPercent: number;
  logs: string[];
}

interface UseSocketOptions {
  assignmentId: string | null;
  onProgress: (payload: GenerationProgressPayload) => void;
}

let sharedSocket: Socket | null = null;

function getSocket(): Socket {
  if (!sharedSocket || !sharedSocket.connected) {
    sharedSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return sharedSocket;
}

export function useSocket({ assignmentId, onProgress }: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  const joinRoom = useCallback((id: string) => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit('join_assignment', id);
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const handleProgress = (payload: GenerationProgressPayload) => {
      onProgressRef.current(payload);
    };

    socket.on('generation_progress', handleProgress);

    // Join the assignment room when id is available
    if (assignmentId) {
      joinRoom(assignmentId);
    }

    return () => {
      socket.off('generation_progress', handleProgress);
    };
  }, [assignmentId, joinRoom]);

  useEffect(() => {
    if (assignmentId && socketRef.current) {
      joinRoom(assignmentId);
    }
  }, [assignmentId, joinRoom]);
}

export function disconnectSocket() {
  if (sharedSocket) {
    sharedSocket.disconnect();
    sharedSocket = null;
  }
}
