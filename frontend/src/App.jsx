import React, { useState, useEffect, useMemo } from "react";
import { api, saveToken, clearToken, isLoggedIn } from "./api.js";

/* ---------------- ICONS ---------------- */

function Icon({ name, size = 16, color = "currentColor", strokeWidth = 1.75, style }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", style };
  switch (name) {
    case "search": return <svg {...p}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
    case "calendar": return <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
    case "users": return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "wifi": return <svg {...p}><path d="M5 12.55a11 11 0 0 1 14 0" /><path d="M8.5 16a6 6 0 0 1 7 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>;
    case "x": return <svg {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
    case "arrowRight": return <svg {...p}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
    case "conciergeBell": return <svg {...p}><path d="M3 18h18" /><path d="M5 18a7 7 0 0 1 14 0" /><line x1="12" y1="6" x2="12" y2="3" /><circle cx="12" cy="3" r="1" fill={color} /></svg>;
    case "leaf": return <svg {...p}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>;
    case "bedDouble": return <svg {...p}><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" /><path d="M2 17h20" /><path d="M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" /></svg>;
    case "ban": return <svg {...p}><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>;
    case "logIn": return <svg {...p}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>;
    case "logOut": return <svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
    case "doorOpen": return <svg {...p}><path d="M4 21V5a2 2 0 0 1 2-2h6v18" /><path d="M12 21h8" /><path d="M16 3l4 2v16" /><circle cx="9" cy="12" r="1" fill={color} /></svg>;
    case "lock": return <svg {...p}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
    default: return null;
  }
}

/* ---------------- HELPERS ---------------- */

function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}
function nightsBetween(a, b) {
  const ms = new Date(b) - new Date(a);
  return Math.max(0, Math.round(ms / 86400000));
}
function money(n) { return `$${Number(n).toFixed(2)}`; }

/* ---------------- APP ---------------- */

export default function App() {
  const [view, setView] = useState("guest");
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [toast, setToast] = useState(null);
  const [printJob, setPrintJob] = useState(null);

  useEffect(() => {
    if (!printJob) return;
    const onAfterPrint = () => setPrintJob(null);
    window.addEventListener("afterprint", onAfterPrint);
    const t = setTimeout(() => window.print(), 60);
    return () => {
      window.removeEventListener("afterprint", onAfterPrint);
      clearTimeout(t);
    };
  }, [printJob]);

  function exportToPDF(title, columns, rows) {
    setPrintJob({ title, columns, rows, generatedAt: new Date().toLocaleString() });
  }
  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }
  function handleLogout() {
    clearToken();
    setLoggedIn(false);
  }

  return (
    <div className="wren-app" style={{ minHeight: "100vh", background: "#1F332E", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <Header view={view} setView={setView} loggedIn={loggedIn} onLogout={handleLogout} />

      {view === "guest" ? (
        <GuestView showToast={showToast} />
      ) : loggedIn ? (
        <AdminView showToast={showToast} exportToPDF={exportToPDF} onLoggedOut={handleLogout} />
      ) : (
        <Login onSuccess={() => setLoggedIn(true)} />
      )}

      {toast && <div className="wren-toast">{toast}</div>}

      {printJob && (
        <div className="wren-print-area">
          <div className="wren-print-header">
            <div className="wren-print-brand">Green Garden Resort Hurghada</div>
            <h2>{printJob.title}</h2>
            <div className="wren-print-meta">Generated {printJob.generatedAt}</div>
          </div>
          <table className="wren-print-table">
            <thead><tr>{printJob.columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {printJob.rows.map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer style={{ textAlign: "center", padding: "28px 16px 40px", color: "#6E8479", fontSize: 12, letterSpacing: "0.08em" }}>
        GREEN GARDEN RESORT HURGHADA &nbsp;·&nbsp; RED SEA COASTLINE, EGYPT
      </footer>
    </div>
  );
}

function Header({ view, setView, loggedIn, onLogout }) {
  return (
    <div style={{ background: "#152420", borderBottom: "1px solid rgba(217,189,140,0.25)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid #B8935B", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="leaf" size={18} color="#D9BD8C" strokeWidth={1.5} />
          </div>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: "#FBF6EA", letterSpacing: "0.02em", lineHeight: 1 }}>Green Garden Resort Hurghada</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: "#8CA396", letterSpacing: "0.18em", marginTop: 4 }}>GUEST REGISTER &amp; FRONT DESK</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="wren-toggle">
            <button onClick={() => setView("guest")} className={`wren-toggle-btn ${view === "guest" ? "active" : ""}`}>
              <Icon name="doorOpen" size={14} strokeWidth={1.75} /> Guest
            </button>
            <button onClick={() => setView("admin")} className={`wren-toggle-btn ${view === "admin" ? "active" : ""}`}>
              <Icon name="conciergeBell" size={14} strokeWidth={1.75} /> Front Desk
            </button>
          </div>
          {view === "admin" && loggedIn && (
            <button className="wren-btn-ghost" onClick={onLogout}>Log out</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- LOGIN ---------------- */

function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login(username.trim(), password);
      saveToken(data.token);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="wren-login-wrap">
      <form className="wren-card wren-modal" onSubmit={submit} style={{ maxWidth: 380 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Icon name="lock" size={18} color="#8C6A3D" />
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, margin: 0, color: "#1C1B17" }}>Front desk login</h3>
        </div>
        <div style={{ fontSize: 12.5, color: "#8A8064", marginBottom: 16 }}>Staff access only.</div>

        {error && <div className="wren-error">{error}</div>}

        <label className="wren-form-label">Username</label>
        <input className="wren-input" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
        <label className="wren-form-label">Password</label>
        <input type="password" className="wren-input" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="wren-btn" type="submit" style={{ marginTop: 18, width: "100%" }} disabled={loading || !username || !password}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

/* ---------------- GUEST VIEW ---------------- */

function GuestView({ showToast }) {
  const [checkIn, setCheckIn] = useState(todayISO(1));
  const [checkOut, setCheckOut] = useState(todayISO(3));
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [showLookup, setShowLookup] = useState(false);

  const nights = nightsBetween(checkIn, checkOut);

  useEffect(() => {
    if (nights <= 0) { setRooms([]); return; }
    let cancelled = false;
    setLoading(true);
    setError("");
    api.listAvailableRooms(checkIn, checkOut, guests)
      .then((data) => { if (!cancelled) setRooms(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [checkIn, checkOut, guests, nights]);

  async function handleBook(details) {
    try {
      const booking = await api.createBooking({
        roomId: selectedRoom.id,
        checkIn, checkOut,
        guestName: details.fullName,
        phone: details.phone,
        nationality: details.nationality,
        email: details.email,
        adults: details.adults,
        children: details.children,
        specialRequests: details.specialRequests,
        arrivalTime: details.arrivalTime,
      });
      setSelectedRoom(null);
      setConfirmation({
        ...booking,
        roomNumber: booking.roomNumber || selectedRoom.number,
        roomType: booking.roomType || selectedRoom.type,
      });
      showToast("Reservation confirmed — welcome to Green Garden Resort Hurghada.");
    } catch (err) {
      showToast(err.message);
    }
  }

  if (confirmation) {
    return (
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
        <Keycard booking={confirmation} />
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button className="wren-btn-ghost" onClick={() => setConfirmation(null)}>
            Back to search <Icon name="arrowRight" size={14} style={{ marginLeft: 6 }} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 20px" }}>
      <div className="wren-hero">
        <div style={{ maxWidth: 520 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.2em", color: "#D9BD8C", marginBottom: 10 }}>
            FIRST · SECOND · THIRD FLOOR APARTMENTS
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 40px)", color: "#FBF6EA", lineHeight: 1.15, margin: 0 }}>
            Check the register, <br />find your room.
          </h1>
        </div>
      </div>

      <SearchCard checkIn={checkIn} setCheckIn={setCheckIn} checkOut={checkOut} setCheckOut={setCheckOut} guests={guests} setGuests={setGuests} nights={nights} />

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "36px 0 16px" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", color: "#FBF6EA", fontSize: 20, margin: 0 }}>
          {loading ? "Checking the register…" : `${rooms.length} ${rooms.length === 1 ? "room" : "rooms"} open for these dates`}
        </h2>
        <button className="wren-link" onClick={() => setShowLookup(true)}>Find my reservation</button>
      </div>

      {error && <div className="wren-error">{error}</div>}

      {!loading && rooms.length === 0 && !error ? (
        <div className="wren-empty">Nothing free on the register for those dates. Try shifting a night or lowering the party size.</div>
      ) : (
        <div className="wren-grid">
          {rooms.map((r) => (
            <RoomCard key={r.id} room={r} nights={nights} onReserve={() => setSelectedRoom(r)} />
          ))}
        </div>
      )}

      {selectedRoom && (
        <BookingModal room={selectedRoom} checkIn={checkIn} checkOut={checkOut} guests={guests} nights={nights} onClose={() => setSelectedRoom(null)} onConfirm={handleBook} />
      )}

      {showLookup && <LookupModal onClose={() => setShowLookup(false)} />}
    </div>
  );
}

function SearchCard({ checkIn, setCheckIn, checkOut, setCheckOut, guests, setGuests, nights }) {
  return (
    <div className="wren-card wren-search">
      <Field label="Arrive" icon={<Icon name="calendar" size={13} />}>
        <input type="date" value={checkIn} min={todayISO()} onChange={(e) => setCheckIn(e.target.value)} className="wren-input" />
      </Field>
      <Field label="Depart" icon={<Icon name="calendar" size={13} />}>
        <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} className="wren-input" />
      </Field>
      <Field label="Guests" icon={<Icon name="users" size={13} />}>
        <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="wren-input">
          {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}
        </select>
      </Field>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#7A6F58", marginBottom: 6 }}>
          {nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "pick a valid range"}
        </div>
        <div className="wren-search-icon"><Icon name="search" size={16} color="#FBF6EA" /></div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 130 }}>
      <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, letterSpacing: "0.1em", color: "#7A6F58", textTransform: "uppercase" }}>
        {icon}{label}
      </span>
      {children}
    </label>
  );
}

function RoomCard({ room, nights, onReserve }) {
  return (
    <div className="wren-card wren-room-card">
      <div className="wren-tag"><span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{room.number}</span></div>
      <div style={{ padding: "22px 20px 20px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: "0.15em", color: "#9A8A63" }}>{room.floor.toUpperCase()}</div>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 21, margin: "4px 0 10px", color: "#1C1B17" }}>{room.type}</h3>
        <div style={{ fontSize: 13.5, color: "#544C3C", display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon name="bedDouble" size={14} /> {room.bed}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon name="users" size={14} /> Sleeps {room.capacity}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
          {(room.amenities || []).map((a) => (
            <span key={a} className="wren-chip">{a === "Wifi" ? <Icon name="wifi" size={11} style={{ marginRight: 4 }} /> : null}{a}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "#1C1B17" }}>{money(room.price)}</div>
            <div style={{ fontSize: 11, color: "#8A8064" }}>per night · {nights > 0 ? money(room.price * nights) + " total" : "—"}</div>
          </div>
          <button className="wren-btn" onClick={onReserve}>Reserve</button>
        </div>
      </div>
    </div>
  );
}

function BookingModal({ room, checkIn, checkOut, guests, nights, onClose, onConfirm }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [email, setEmail] = useState("");
  const [adults, setAdults] = useState(Math.max(1, guests));
  const [children, setChildren] = useState(0);
  const [specialRequests, setSpecialRequests] = useState("");
  const [arrivalTime, setArrivalTime] = useState("14:00");
  const [submitting, setSubmitting] = useState(false);

  const party = adults + children;
  const valid = fullName.trim().length > 1 && phone.trim().length > 3 && nationality.trim().length > 1 && /\S+@\S+\.\S+/.test(email) && adults >= 1 && party <= room.capacity;

  async function submit() {
    setSubmitting(true);
    await onConfirm({ fullName: fullName.trim(), phone: phone.trim(), nationality: nationality.trim(), email: email.trim(), adults, children, specialRequests: specialRequests.trim(), arrivalTime });
    setSubmitting(false);
  }

  return (
    <div className="wren-overlay" onClick={onClose}>
      <div className="wren-card wren-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: "0.15em", color: "#9A8A63" }}>ROOM {room.number} · {room.type.toUpperCase()}</div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, margin: "4px 0 0", color: "#1C1B17" }}>Register your stay</h3>
          </div>
          <button className="wren-icon-btn" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>

        <div className="wren-summary-row">
          <span>{checkIn} → {checkOut}</span>
          <span>{nights} night{nights !== 1 ? "s" : ""}</span>
          <span>Sleeps up to {room.capacity}</span>
        </div>

        <label className="wren-form-label">Full name</label>
        <input className="wren-input" placeholder="As it appears on ID" value={fullName} onChange={(e) => setFullName(e.target.value)} />

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="wren-form-label">Phone number</label>
            <input className="wren-input" placeholder="+20 1xx xxx xxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="wren-form-label">Nationality</label>
            <input className="wren-input" placeholder="e.g. Egyptian" value={nationality} onChange={(e) => setNationality(e.target.value)} />
          </div>
        </div>

        <label className="wren-form-label">Email</label>
        <input className="wren-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="wren-form-label">Adults</label>
            <input type="number" min={1} className="wren-input" value={adults} onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="wren-form-label">Children</label>
            <input type="number" min={0} className="wren-input" value={children} onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="wren-form-label">Time of arrival</label>
            <input type="time" className="wren-input" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} />
          </div>
        </div>
        {party > room.capacity && (
          <div style={{ fontSize: 12, color: "#7A2E2E", marginTop: 6 }}>This suite sleeps up to {room.capacity} — reduce the party size.</div>
        )}

        <label className="wren-form-label">Special requests</label>
        <textarea className="wren-input" style={{ width: "100%", minHeight: 70, resize: "vertical", fontFamily: "'IBM Plex Sans', sans-serif" }} placeholder="Late arrival, dietary needs, celebration, accessibility needs…" value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 16, borderTop: "1px dashed #D8CBB0" }}>
          <div>
            <div style={{ fontSize: 11, color: "#8A8064" }}>Total due at stay</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: "#1C1B17" }}>{money(room.price * nights)}</div>
          </div>
          <button className="wren-btn" disabled={!valid || submitting} onClick={submit}>
            {submitting ? "Booking…" : "Confirm reservation"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Keycard({ booking }) {
  return (
    <div className="wren-keycard">
      <div className="wren-keycard-stripe" />
      <div className="wren-keycard-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="leaf" size={16} color="#B8935B" strokeWidth={1.5} />
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 15, color: "#FBF6EA" }}>Green Garden Resort Hurghada</span>
          </div>
          <span className="wren-status-pill">{(booking.status || "confirmed").toUpperCase()}</span>
        </div>
        <div style={{ margin: "22px 0 6px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.15em", color: "#8CA396" }}>CONFIRMATION CODE</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 26, color: "#D9BD8C", letterSpacing: "0.08em" }}>{booking.confirmationCode}</div>
        <div className="wren-keycard-grid">
          <div><span>Guest</span><strong>{booking.guestName}</strong></div>
          <div><span>Room</span><strong>{booking.roomNumber} · {booking.roomType}</strong></div>
          <div><span>Phone</span><strong>{booking.phone}</strong></div>
          <div><span>Nationality</span><strong>{booking.nationality}</strong></div>
          <div><span>Arrive</span><strong>{booking.checkIn}</strong></div>
          <div><span>Depart</span><strong>{booking.checkOut}</strong></div>
          <div><span>Arrival time</span><strong>{booking.arrivalTime || "—"}</strong></div>
          <div><span>Party</span><strong>{booking.adults} adult{booking.adults !== 1 ? "s" : ""}{booking.children > 0 ? `, ${booking.children} child${booking.children !== 1 ? "ren" : ""}` : ""}</strong></div>
          <div><span>Total</span><strong>{money(booking.total)}</strong></div>
        </div>
        {booking.specialRequests && (
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px dashed rgba(217,189,140,0.3)" }}>
            <span style={{ display: "block", fontSize: 10.5, color: "#8CA396", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Special requests</span>
            <div style={{ color: "#FBF6EA", fontSize: 13, lineHeight: 1.4 }}>{booking.specialRequests}</div>
          </div>
        )}
      </div>
      <div className="wren-keycard-perf" />
    </div>
  );
}

function LookupModal({ onClose }) {
  const [code, setCode] = useState("");
  const [found, setFound] = useState(undefined);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    setFound(undefined);
    try {
      const booking = await api.lookupBooking(code);
      setFound(booking);
    } catch (err) {
      setFound(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="wren-overlay" onClick={onClose}>
      <div className="wren-card wren-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, margin: 0, color: "#1C1B17" }}>Find your reservation</h3>
          <button className="wren-icon-btn" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <label className="wren-form-label">Confirmation code</label>
        <input className="wren-input" placeholder="GGR-XXX-0000" value={code} onChange={(e) => setCode(e.target.value)} />
        <button className="wren-btn" style={{ marginTop: 14, width: "100%" }} onClick={search} disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
        {found === null && <div className="wren-empty" style={{ marginTop: 16 }}>No reservation found with that code.</div>}
        {found && <div style={{ marginTop: 18 }}><Keycard booking={found} /></div>}
      </div>
    </div>
  );
}

/* ---------------- ADMIN VIEW ---------------- */

function AdminView({ showToast, exportToPDF, onLoggedOut }) {
  const [tab, setTab] = useState("ledger");
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [closures, setClosures] = useState([]);
  const [housekeeping, setHousekeeping] = useState([]);
  const [stats, setStats] = useState({ inHouseTonight: 0, arrivingToday: 0, occupancy: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function reload() {
    try {
      const [r, b, c, h, s] = await Promise.all([
        api.listRooms(), api.listBookings(), api.listClosures(), api.listHousekeeping(), api.getStats(),
      ]);
      setRooms(r); setBookings(b); setClosures(c); setHousekeeping(h); setStats(s);
      setError("");
    } catch (err) {
      if (err.message.includes("Invalid or expired") || err.message.includes("Missing or invalid")) {
        onLoggedOut();
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, []);

  async function updateBookingStatus(id, status) {
    try {
      await api.updateBookingStatus(id, status);
      showToast(`Reservation marked ${status}.`);
      reload();
    } catch (err) { showToast(err.message); }
  }
  async function updateRoom(id, patch) {
    try {
      await api.updateRoom(id, patch);
      reload();
    } catch (err) { showToast(err.message); }
  }
  async function addClosure(closure) {
    try {
      await api.createClosure(closure);
      showToast("Room closed for those dates.");
      reload();
    } catch (err) { showToast(err.message); }
  }
  async function removeClosure(id) {
    try {
      await api.removeClosure(id);
      showToast("Room reopened for those dates.");
      reload();
    } catch (err) { showToast(err.message); }
  }
  async function logCleaning(entry) {
    try {
      await api.logCleaning(entry);
      showToast("Cleaning logged.");
      reload();
    } catch (err) { showToast(err.message); }
  }
  async function removeCleaning(id) {
    try {
      await api.removeCleaning(id);
      reload();
    } catch (err) { showToast(err.message); }
  }

  if (loading) {
    return <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px", color: "#8CA396" }}>Loading front desk…</div>;
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px" }}>
      {error && <div className="wren-error">{error}</div>}

      <div className="wren-stats">
        <StatBlock label="In house tonight" value={stats.inHouseTonight} />
        <StatBlock label="Arriving today" value={stats.arrivingToday} />
        <StatBlock label="Occupancy" value={`${stats.occupancy}%`} />
        <StatBlock label="Booked revenue" value={money(stats.revenue)} />
      </div>

      <div className="wren-toggle" style={{ margin: "28px 0 20px", flexWrap: "wrap" }}>
        <button className={`wren-toggle-btn ${tab === "ledger" ? "active" : ""}`} onClick={() => setTab("ledger")}>Reservation ledger</button>
        <button className={`wren-toggle-btn ${tab === "rooms" ? "active" : ""}`} onClick={() => setTab("rooms")}>Room management</button>
        <button className={`wren-toggle-btn ${tab === "availability" ? "active" : ""}`} onClick={() => setTab("availability")}>Availability</button>
        <button className={`wren-toggle-btn ${tab === "housekeeping" ? "active" : ""}`} onClick={() => setTab("housekeeping")}>Housekeeping</button>
      </div>

      {tab === "ledger" && <Ledger bookings={bookings} onUpdate={updateBookingStatus} exportToPDF={exportToPDF} />}
      {tab === "rooms" && <RoomsManager rooms={rooms} housekeeping={housekeeping} onUpdate={updateRoom} exportToPDF={exportToPDF} />}
      {tab === "availability" && <RoomAvailability rooms={rooms} closures={closures} onAdd={addClosure} onRemove={removeClosure} exportToPDF={exportToPDF} />}
      {tab === "housekeeping" && <Housekeeping rooms={rooms} housekeeping={housekeeping} onLog={logCleaning} onRemove={removeCleaning} exportToPDF={exportToPDF} />}
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div className="wren-card wren-stat">
      <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "#8A8064", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 30, color: "#1C1B17", marginTop: 6 }}>{value}</div>
    </div>
  );
}

function Ledger({ bookings, onUpdate, exportToPDF }) {
  const sorted = [...bookings].sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));

  function handleExport() {
    const columns = ["Code", "Guest", "Nationality", "Phone", "Email", "Room", "Arrive", "Depart", "Arrival time", "Party", "Special requests", "Total", "Status"];
    const rows = sorted.map((b) => [
      b.confirmationCode, b.guestName, b.nationality || "—", b.phone || "—", b.email,
      `${b.Room ? b.Room.number : b.roomId} · ${b.Room ? b.Room.type : ""}`, b.checkIn, b.checkOut, b.arrivalTime || "—",
      `${b.adults} adult${b.adults !== 1 ? "s" : ""}${b.children > 0 ? `, ${b.children} child${b.children !== 1 ? "ren" : ""}` : ""}`,
      b.specialRequests || "—", money(b.total), b.status,
    ]);
    exportToPDF("Reservation Ledger", columns, rows);
  }

  if (sorted.length === 0) return <div className="wren-empty">No reservations yet. They'll appear here as guests book.</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button className="wren-btn-ghost" onClick={handleExport}>Export to PDF</button>
      </div>
      <div className="wren-card" style={{ padding: 0, overflow: "auto" }}>
        <table className="wren-table">
          <thead><tr><th>Code</th><th>Guest</th><th>Contact</th><th>Room</th><th>Arrive</th><th>Depart</th><th>Arrival time</th><th>Party</th><th>Special requests</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {sorted.map((b) => (
              <tr key={b.id}>
                <td style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{b.confirmationCode}</td>
                <td>{b.guestName}<div style={{ fontSize: 11, color: "#8A8064" }}>{b.nationality}</div></td>
                <td>{b.phone}<div style={{ fontSize: 11, color: "#8A8064" }}>{b.email}</div></td>
                <td>{b.Room ? `${b.Room.number} · ${b.Room.type}` : b.roomId}</td>
                <td>{b.checkIn}</td>
                <td>{b.checkOut}</td>
                <td>{b.arrivalTime || "—"}</td>
                <td>{b.adults} adult{b.adults !== 1 ? "s" : ""}{b.children > 0 ? `, ${b.children} child${b.children !== 1 ? "ren" : ""}` : ""}</td>
                <td style={{ maxWidth: 180, whiteSpace: "pre-wrap" }}>{b.specialRequests || "—"}</td>
                <td>{money(b.total)}</td>
                <td><StatusPill status={b.status} /></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    {b.status !== "cancelled" && <button className="wren-icon-btn" title="Cancel" onClick={() => onUpdate(b.id, "cancelled")}><Icon name="ban" size={14} /></button>}
                    {b.status === "confirmed" && <button className="wren-icon-btn" title="Check in" onClick={() => onUpdate(b.id, "checked-in")}><Icon name="logIn" size={14} /></button>}
                    {b.status === "checked-in" && <button className="wren-icon-btn" title="Check out" onClick={() => onUpdate(b.id, "checked-out")}><Icon name="logOut" size={14} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    confirmed: { bg: "#EAF1EC", fg: "#3F6B52", label: "Confirmed" },
    "checked-in": { bg: "#EFE6D6", fg: "#8C6A3D", label: "Checked in" },
    "checked-out": { bg: "#EDEAE2", fg: "#7A6F58", label: "Checked out" },
    cancelled: { bg: "#F3E4E4", fg: "#7A2E2E", label: "Cancelled" },
  };
  const s = map[status] || map.confirmed;
  return <span style={{ background: s.bg, color: s.fg, padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 600 }}>{s.label}</span>;
}

function RoomsManager({ rooms, housekeeping, onUpdate, exportToPDF }) {
  function lastCleaned(roomId) {
    const entries = housekeeping.filter((h) => h.roomId === roomId);
    if (entries.length === 0) return null;
    return entries.reduce((latest, e) => (new Date(e.cleanedAt) > new Date(latest.cleanedAt) ? e : latest));
  }

  function handleExport() {
    const columns = ["Room", "Floor", "Type", "Nightly rate", "Status", "Last cleaned by", "Last cleaned at"];
    const rows = rooms.map((r) => {
      const last = lastCleaned(r.id);
      return [r.number, r.floor, r.type, money(r.price), r.status === "active" ? "In service" : "Out of service", last ? last.cleanedBy : "—", last ? new Date(last.cleanedAt).toLocaleString() : "—"];
    });
    exportToPDF("Room Directory", columns, rows);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button className="wren-btn-ghost" onClick={handleExport}>Export to PDF</button>
      </div>
      <div className="wren-grid">
        {rooms.map((r) => {
          const last = lastCleaned(r.id);
          return (
            <div key={r.id} className="wren-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: "0.15em", color: "#9A8A63" }}>ROOM {r.number} · {r.floor.toUpperCase()}</div>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, margin: "4px 0 8px", color: "#1C1B17" }}>{r.type}</h3>
                </div>
                <label className="wren-switch">
                  <input type="checkbox" checked={r.status === "active"} onChange={(e) => onUpdate(r.id, { status: e.target.checked ? "active" : "out-of-service" })} />
                  <span className="wren-switch-track"><span className="wren-switch-thumb" /></span>
                </label>
              </div>
              <div style={{ fontSize: 12, color: "#8A8064", marginBottom: 14 }}>{r.status === "active" ? "In service" : "Out of service"}</div>
              <label className="wren-form-label" style={{ marginTop: 0 }}>Nightly rate</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#8A8064" }}>$</span>
                <input type="number" className="wren-input" value={r.price} onChange={(e) => onUpdate(r.id, { price: Number(e.target.value) || 0 })} />
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px dashed #E4D9BE" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.08em", color: "#8A8064", textTransform: "uppercase", marginBottom: 4 }}>Housekeeping</div>
                {last ? (
                  <div style={{ fontSize: 13, color: "#1C1B17" }}>
                    Cleaned by <strong>{last.cleanedBy}</strong>
                    <div style={{ fontSize: 12, color: "#8A8064", marginTop: 2 }}>{new Date(last.cleanedAt).toLocaleString()}</div>
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: "#8A8064" }}>No cleaning logged yet</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RoomAvailability({ rooms, closures, onAdd, onRemove, exportToPDF }) {
  const [roomId, setRoomId] = useState(rooms[0]?.id || "");
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(todayISO(1));
  const [reason, setReason] = useState("");

  useEffect(() => { if (!roomId && rooms[0]) setRoomId(rooms[0].id); }, [rooms]);

  const validRange = roomId && startDate && endDate && new Date(endDate) > new Date(startDate);

  function submit() {
    if (!validRange) return;
    onAdd({ roomId, startDate, endDate, reason: reason.trim() });
    setReason("");
  }

  const sorted = [...closures].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const today = todayISO();

  function handleExport() {
    const columns = ["Room", "Closed from", "Closed to", "Reason"];
    const rows = sorted.map((c) => [c.Room ? `${c.Room.number} · ${c.Room.type}` : c.roomId, c.startDate, c.endDate, c.reason || "—"]);
    exportToPDF("Room Closures", columns, rows);
  }

  return (
    <div>
      <div className="wren-card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, margin: "0 0 4px", color: "#1C1B17" }}>Close a room for specific dates</h3>
        <div style={{ fontSize: 12.5, color: "#8A8064", marginBottom: 16 }}>Blocked dates keep the room off the guest search — useful for maintenance, renovation, or owner stays.</div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Field label="Room">
            <select className="wren-input" value={roomId} onChange={(e) => setRoomId(Number(e.target.value))}>
              {rooms.map((r) => <option key={r.id} value={r.id}>{r.number} · {r.type}</option>)}
            </select>
          </Field>
          <Field label="Closed from"><input type="date" className="wren-input" value={startDate} min={today} onChange={(e) => setStartDate(e.target.value)} /></Field>
          <Field label="Closed to"><input type="date" className="wren-input" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} /></Field>
        </div>
        <label className="wren-form-label">Reason (optional)</label>
        <input className="wren-input" style={{ width: "100%" }} placeholder="Maintenance, renovation, owner stay…" value={reason} onChange={(e) => setReason(e.target.value)} />
        <button className="wren-btn" style={{ marginTop: 16 }} disabled={!validRange} onClick={submit}>Close these dates</button>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button className="wren-btn-ghost" onClick={handleExport}>Export to PDF</button>
      </div>

      {sorted.length === 0 ? (
        <div className="wren-empty">No rooms are currently closed for specific dates.</div>
      ) : (
        <div className="wren-card" style={{ padding: 0, overflow: "auto" }}>
          <table className="wren-table">
            <thead><tr><th>Room</th><th>Closed from</th><th>Closed to</th><th>Reason</th><th></th></tr></thead>
            <tbody>
              {sorted.map((c) => (
                <tr key={c.id}>
                  <td>{c.Room ? `${c.Room.number} · ${c.Room.type}` : c.roomId}</td>
                  <td>{c.startDate}</td>
                  <td>{c.endDate}</td>
                  <td>{c.reason || "—"}</td>
                  <td><button className="wren-icon-btn" title="Reopen these dates" onClick={() => onRemove(c.id)}><Icon name="x" size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Housekeeping({ rooms, housekeeping, onLog, onRemove, exportToPDF }) {
  const [roomId, setRoomId] = useState(rooms[0]?.id || "");
  const [cleanedBy, setCleanedBy] = useState("");
  const [cleanedAt, setCleanedAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState("");

  useEffect(() => { if (!roomId && rooms[0]) setRoomId(rooms[0].id); }, [rooms]);

  const valid = roomId && cleanedBy.trim().length > 1 && cleanedAt;

  function submit() {
    if (!valid) return;
    onLog({ roomId, cleanedBy: cleanedBy.trim(), cleanedAt: new Date(cleanedAt).toISOString(), notes: notes.trim() });
    setCleanedBy("");
    setNotes("");
  }

  const sorted = [...housekeeping].sort((a, b) => new Date(b.cleanedAt) - new Date(a.cleanedAt));

  function handleExport() {
    const columns = ["Room", "Cleaned by", "Cleaned at", "Notes"];
    const rows = sorted.map((h) => [h.Room ? `${h.Room.number} · ${h.Room.type}` : h.roomId, h.cleanedBy, new Date(h.cleanedAt).toLocaleString(), h.notes || "—"]);
    exportToPDF("Housekeeping Log", columns, rows);
  }

  return (
    <div>
      <div className="wren-card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, margin: "0 0 4px", color: "#1C1B17" }}>Log a cleaning</h3>
        <div style={{ fontSize: 12.5, color: "#8A8064", marginBottom: 16 }}>Record who cleaned a room and when, so the team always has an up-to-date housekeeping trail.</div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Field label="Room">
            <select className="wren-input" value={roomId} onChange={(e) => setRoomId(Number(e.target.value))}>
              {rooms.map((r) => <option key={r.id} value={r.id}>{r.number} · {r.type}</option>)}
            </select>
          </Field>
          <Field label="Cleaned by"><input className="wren-input" placeholder="Staff name" value={cleanedBy} onChange={(e) => setCleanedBy(e.target.value)} /></Field>
          <Field label="Cleaned at"><input type="datetime-local" className="wren-input" value={cleanedAt} onChange={(e) => setCleanedAt(e.target.value)} /></Field>
        </div>
        <label className="wren-form-label">Notes (optional)</label>
        <input className="wren-input" style={{ width: "100%" }} placeholder="Deep clean, linens changed, minibar restocked…" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button className="wren-btn" style={{ marginTop: 16 }} disabled={!valid} onClick={submit}>Log cleaning</button>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button className="wren-btn-ghost" onClick={handleExport}>Export to PDF</button>
      </div>

      {sorted.length === 0 ? (
        <div className="wren-empty">No cleanings logged yet. Entries will appear here as housekeeping reports them.</div>
      ) : (
        <div className="wren-card" style={{ padding: 0, overflow: "auto" }}>
          <table className="wren-table">
            <thead><tr><th>Room</th><th>Cleaned by</th><th>Cleaned at</th><th>Notes</th><th></th></tr></thead>
            <tbody>
              {sorted.map((h) => (
                <tr key={h.id}>
                  <td>{h.Room ? `${h.Room.number} · ${h.Room.type}` : h.roomId}</td>
                  <td>{h.cleanedBy}</td>
                  <td>{new Date(h.cleanedAt).toLocaleString()}</td>
                  <td style={{ maxWidth: 200, whiteSpace: "pre-wrap" }}>{h.notes || "—"}</td>
                  <td><button className="wren-icon-btn" title="Remove entry" onClick={() => onRemove(h.id)}><Icon name="x" size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
