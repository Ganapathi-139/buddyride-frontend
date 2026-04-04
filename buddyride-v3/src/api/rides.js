import { apiFetch } from './config.js';

// ── Search rides ──────────────────────────────────────────────
// filters: { from_city, to_city, date, vehicle_type, min_seats }
export async function searchRides(filters = {}) {
  const params = new URLSearchParams();
  if (filters.from_city)    params.set('from_city',    filters.from_city);
  if (filters.to_city)      params.set('to_city',      filters.to_city);
  if (filters.date)         params.set('date',         filters.date);
  if (filters.vehicle_type && filters.vehicle_type !== 'any')
                            params.set('vehicle_type', filters.vehicle_type);
  if (filters.min_seats)    params.set('min_seats',    filters.min_seats);

  const query = params.toString() ? `?${params}` : '';
  const { data, error } = await apiFetch(`/rides${query}`);
  if (error) return { rides: [], error };
  return { rides: data.rides, total: data.total };
}

// ── Get one ride's full details ───────────────────────────────
export async function getRide(rideId) {
  const { data, error } = await apiFetch(`/rides/${rideId}`);
  if (error) return { ride: null, error };
  return { ride: data };
}

// ── Post a new ride ───────────────────────────────────────────
export async function postRide(rideData) {
  const { data, error } = await apiFetch('/rides', {
    method: 'POST',
    body: JSON.stringify(rideData),
  });
  if (error) return { ride: null, error };
  return { ride: data };
}

// ── Book a seat on a ride ─────────────────────────────────────
export async function bookRide(rideId, seats = 1) {
  const { data, error } = await apiFetch(`/rides/${rideId}/book`, {
    method: 'POST',
    body: JSON.stringify({ seats }),
  });
  if (error) return { booking: null, error };
  return { booking: data.booking, message: data.message };
}

// ── Cancel a ride you posted ──────────────────────────────────
export async function cancelRide(rideId) {
  const { data, error } = await apiFetch(`/rides/${rideId}/cancel`, {
    method: 'PATCH',
  });
  if (error) return { error };
  return { ride: data.ride };
}

// ── My posted rides ───────────────────────────────────────────
export async function myPostedRides() {
  const { data, error } = await apiFetch('/rides/my/posted');
  if (error) return { rides: [], error };
  return { rides: data.rides };
}

// ── My booked rides ───────────────────────────────────────────
export async function myBookedRides() {
  const { data, error } = await apiFetch('/rides/my/booked');
  if (error) return { bookings: [], error };
  return { bookings: data.bookings };
}
