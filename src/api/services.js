import { apiFetch } from './config.js';

// ════════════════════════════════════════
// CHAT
// ════════════════════════════════════════

export async function getConversations() {
  const { data, error } = await apiFetch('/chat/conversations');
  if (error) return { conversations: [], error };
  return { conversations: data.conversations };
}

export async function getMessages(partnerId, limit = 50) {
  const { data, error } = await apiFetch(`/chat/${partnerId}?limit=${limit}`);
  if (error) return { messages: [], error };
  return { messages: data.messages };
}

export async function sendMessage(partnerId, content, rideId = null) {
  const { data, error } = await apiFetch(`/chat/${partnerId}`, {
    method: 'POST',
    body: JSON.stringify({ content, ride_id: rideId }),
  });
  if (error) return { message: null, error };
  return { message: data.message };
}

export async function getUnreadCount() {
  const { data, error } = await apiFetch('/chat/unread/count');
  if (error) return { unread: 0 };
  return { unread: data.unread };
}

// ════════════════════════════════════════
// PAYMENTS
// ════════════════════════════════════════

export async function getWallet() {
  const { data, error } = await apiFetch('/payments/wallet');
  if (error) return { wallet: null, error };
  return { wallet: data };
}

export async function topUpWallet(amount) {
  const { data, error } = await apiFetch('/payments/topup', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
  if (error) return { error };
  return { transaction: data.transaction, new_balance: data.new_balance };
}

export async function payForRide(bookingId) {
  const { data, error } = await apiFetch(`/payments/pay/${bookingId}`, {
    method: 'POST',
  });
  if (error) return { error };
  return data;
}

export async function withdrawFromWallet(amount, upi_id) {
  const { data, error } = await apiFetch('/payments/withdraw', {
    method: 'POST',
    body: JSON.stringify({ amount, upi_id }),
  });
  if (error) return { error };
  return { transaction: data.transaction, new_balance: data.new_balance };
}

export async function getTransactions(limit = 20, offset = 0) {
  const { data, error } = await apiFetch(`/payments/transactions?limit=${limit}&offset=${offset}`);
  if (error) return { transactions: [], error };
  return { transactions: data.transactions, total: data.total };
}

// ════════════════════════════════════════
// RATINGS
// ════════════════════════════════════════

export async function getUserRatings(userId) {
  const { data, error } = await apiFetch(`/ratings/${userId}`);
  if (error) return { ratings: [], stats: null, error };
  return { ratings: data.ratings, stats: data.stats };
}

export async function submitRating({ ride_id, rated_id, stars, review }) {
  const { data, error } = await apiFetch('/ratings', {
    method: 'POST',
    body: JSON.stringify({ ride_id, rated_id, stars, review }),
  });
  if (error) return { error };
  return { rating: data.rating };
}

// ════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════

export async function getNotifications() {
  const { data, error } = await apiFetch('/notifications');
  if (error) return { notifications: [], unread: 0, error };
  return { notifications: data.notifications, unread: data.unread };
}

export async function markNotificationsRead() {
  await apiFetch('/notifications/read', { method: 'PATCH' });
}
