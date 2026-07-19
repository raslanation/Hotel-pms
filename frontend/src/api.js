const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("wren-token");
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try { data = await res.json(); } catch (e) { /* empty response */ }

  if (!res.ok) {
    const message = (data && data.error) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  // auth
  login: (username, password) => request("/auth/login", { method: "POST", body: { username, password } }),
  me: () => request("/auth/me", { auth: true }),

  // rooms
  listRooms: () => request("/rooms"),
  listAvailableRooms: (checkIn, checkOut, guests) =>
    request(`/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`),
  updateRoom: (id, patch) => request(`/rooms/${id}`, { method: "PATCH", body: patch, auth: true }),
  createRoom: (room) => request("/rooms", { method: "POST", body: room, auth: true }),

  // bookings
  listBookings: () => request("/bookings", { auth: true }),
  lookupBooking: (code) => request(`/bookings/lookup?code=${encodeURIComponent(code)}`),
  createBooking: (booking) => request("/bookings", { method: "POST", body: booking }),
  updateBookingStatus: (id, status) => request(`/bookings/${id}/status`, { method: "PATCH", body: { status }, auth: true }),

  // closures
  listClosures: () => request("/closures", { auth: true }),
  createClosure: (closure) => request("/closures", { method: "POST", body: closure, auth: true }),
  removeClosure: (id) => request(`/closures/${id}`, { method: "DELETE", auth: true }),

  // housekeeping
  listHousekeeping: () => request("/housekeeping", { auth: true }),
  logCleaning: (entry) => request("/housekeeping", { method: "POST", body: entry, auth: true }),
  removeCleaning: (id) => request(`/housekeeping/${id}`, { method: "DELETE", auth: true }),

  // stats
  getStats: () => request("/stats", { auth: true }),
};

export function saveToken(token) {
  localStorage.setItem("wren-token", token);
}
export function clearToken() {
  localStorage.removeItem("wren-token");
}
export function isLoggedIn() {
  return !!getToken();
}
