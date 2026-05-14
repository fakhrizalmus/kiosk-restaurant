const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:3000'];
const TABLE_ROOM_PATTERN = /^table_\d+$/;

const parseAllowedOrigins = () => {
  const rawOrigins = process.env.SOCKET_CORS_ORIGIN || process.env.CORS_ORIGIN;

  if (!rawOrigins) {
    return DEFAULT_ALLOWED_ORIGINS;
  }

  if (rawOrigins === '*') {
    return '*';
  }

  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const isValidTableRoom = (room) => (
  typeof room === 'string' && TABLE_ROOM_PATTERN.test(room)
);

const normalizeOrderPayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const cartId = Number(payload.cart_id);
  const table = Number(payload.table);
  const items = Array.isArray(payload.items) ? payload.items : [];

  if (!Number.isInteger(cartId) || cartId <= 0) {
    return null;
  }

  if (!Number.isInteger(table) || table <= 0) {
    return null;
  }

  return {
    cart_id: cartId,
    table,
    items,
    created_at: new Date().toISOString(),
  };
};

const getSocketCorsOptions = () => ({
  origin: parseAllowedOrigins(),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});

const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`[socket] connected: ${socket.id}`);

    socket.on('join_table', (room, callback) => {
      if (!isValidTableRoom(room)) {
        if (typeof callback === 'function') {
          callback({ ok: false, message: 'Invalid table room' });
        }
        return;
      }

      socket.join(room);
      console.log(`[socket] ${socket.id} joined ${room}`);

      if (typeof callback === 'function') {
        callback({ ok: true, room });
      }
    });

    socket.on('leave_table', (room) => {
      if (!isValidTableRoom(room)) {
        return;
      }

      socket.leave(room);
      console.log(`[socket] ${socket.id} left ${room}`);
    });

    socket.on('new_order', (payload, callback) => {
      const order = normalizeOrderPayload(payload);

      if (!order) {
        if (typeof callback === 'function') {
          callback({ ok: false, message: 'Invalid order payload' });
        }
        return;
      }

      console.log(`[socket] new order: cart ${order.cart_id}, table ${order.table}`);
      socket.broadcast.emit('new_order', order);

      if (typeof callback === 'function') {
        callback({ ok: true });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`[socket] disconnected: ${socket.id} (${reason})`);
    });
  });
};

module.exports = {
  getSocketCorsOptions,
  registerSocketHandlers,
};
