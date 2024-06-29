import { io } from 'socket.io-client';

export const socket = io('http://localhost:5000', {
  autoConnect: false,
});

export const socketPrivate = io('http://localhost:5000/private', {
  autoConnect: false,
});

export const socketGroup = io('http://localhost:5000/group', {
  autoConnect: false,
});
