import { apiFetch, tokens, currentUser } from './config.js';

// ── Register a new user ───────────────────────────────────────
// Returns { user, tokens } on success or { error } on failure
export async function register({ name, email, phone, password }) {
  const { data, error } = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, phone, password }),
  });

  if (error) return { error };

  tokens.save(data.tokens.access, data.tokens.refresh);
  currentUser.save(data.user);
  return { user: data.user };
}

// ── Login ─────────────────────────────────────────────────────
export async function login({ email, password }) {
  const { data, error } = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (error) return { error };

  tokens.save(data.tokens.access, data.tokens.refresh);
  currentUser.save(data.user);
  return { user: data.user };
}

// ── Logout ────────────────────────────────────────────────────
export async function logout() {
  await apiFetch('/auth/logout', { method: 'POST' });
  tokens.clear();
  currentUser.clear();
}

// ── Get current logged-in user ────────────────────────────────
export async function getMe() {
  const { data, error } = await apiFetch('/auth/me');
  if (error) return { error };
  currentUser.save(data);
  return { user: data };
}

// ── Check if user is logged in ────────────────────────────────
export function isLoggedIn() {
  return !!tokens.access && !!currentUser.get();
}
