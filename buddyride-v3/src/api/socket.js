import { tokens } from './config.js';

// ─────────────────────────────────────────────────────────────
// socketService.js
// Manages the Socket.IO real-time connection.
// Import this once in your app and call connect() after login.
// ─────────────────────────────────────────────────────────────

let socket = null;
const listeners = new Map();   // eventName → Set of callbacks

// Load Socket.IO client from CDN (add this script tag to index.html):
// <script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>

// ── Connect to the server ─────────────────────────────────────
export function connect() {
  if (socket?.connected) return socket;

  // io() is the global from the Socket.IO CDN script
  socket = io('https://buddyride-backend-production.up.railway.app', {
    auth: { token: tokens.access },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket.id);
    emit('socket:connected');
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
    emit('socket:disconnected');
  });

  socket.on('connect_error', (err) => {
    console.warn('[Socket] Connection error:', err.message);
  });

  // Forward all server events to local listeners
  ['chat:message', 'chat:typing', 'chat:read',
   'user:online', 'user:offline', 'location:update'].forEach(event => {
    socket.on(event, (data) => emit(event, data));
  });

  return socket;
}

// ── Disconnect ────────────────────────────────────────────────
export function disconnect() {
  socket?.disconnect();
  socket = null;
}

// ── Send a chat message ───────────────────────────────────────
export function sendChatMessage(receiverId, content, rideId = null) {
  return new Promise((resolve) => {
    if (!socket?.connected) {
      resolve({ error: 'Not connected' });
      return;
    }
    socket.emit('chat:send', { receiverId, content, rideId }, resolve);
  });
}

// ── Send typing indicator ─────────────────────────────────────
export function sendTyping(receiverId, isTyping) {
  socket?.emit('chat:typing', { receiverId, isTyping });
}

// ── Mark messages as read ─────────────────────────────────────
export function markRead(senderId) {
  socket?.emit('chat:read', { senderId });
}

// ── Share your location during a ride ────────────────────────
export function joinRideLocation(rideId) {
  socket?.emit('location:join', { rideId });
}

export function updateLocation(rideId, lat, lng) {
  socket?.emit('location:update', { rideId, lat, lng });
}

// ── Local event bus ───────────────────────────────────────────
// on('chat:message', callback) — subscribe to an event
export function on(event, callback) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(callback);
  return () => listeners.get(event)?.delete(callback); // returns unsubscribe fn
}

function emit(event, data) {
  listeners.get(event)?.forEach(cb => cb(data));
}

export function isConnected() {
  return socket?.connected ?? false;
}
