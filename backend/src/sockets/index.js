import { Server } from 'socket.io';

const validTripCode = value => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 64;

export function attachSocketServer(httpServer, clientUrl) {
  const io = new Server(httpServer, {
    cors: {
      origin: clientUrl,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', socket => {
    socket.join('tracking:live');
    socket.on('tracking:subscribe-trip', tripCode => {
      if (validTripCode(tripCode)) socket.join(`tracking:trip:${tripCode.trim()}`);
    });
    socket.on('tracking:unsubscribe-trip', tripCode => {
      if (validTripCode(tripCode)) socket.leave(`tracking:trip:${tripCode.trim()}`);
    });
  });

  return io;
}
