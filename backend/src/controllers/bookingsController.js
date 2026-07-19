const { Op } = require("sequelize");
const { Booking, Room, Closure } = require("../models");
const { overlapWhere, genConfirmationCode, nightsBetween } = require("../utils/helpers");

// GET /api/bookings (protected) - full ledger for front desk
async function listBookings(req, res) {
  const bookings = await Booking.findAll({
    include: [{ model: Room, attributes: ["number", "type"] }],
    order: [["checkIn", "ASC"]],
  });
  res.json(bookings);
}

// GET /api/bookings/lookup?code=GGR-XXX-0000 (public)
async function lookupBooking(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: "code is required." });

  const booking = await Booking.findOne({
    where: { confirmationCode: code.trim().toUpperCase() },
    include: [{ model: Room, attributes: ["number", "type"] }],
  });
  if (!booking) return res.status(404).json({ error: "No reservation found with that code." });
  res.json(booking);
}

// POST /api/bookings (public) - guest creates a reservation
async function createBooking(req, res) {
  const {
    roomId, checkIn, checkOut, guestName, phone, nationality, email,
    adults, children, specialRequests, arrivalTime,
  } = req.body;

  if (!roomId || !checkIn || !checkOut || !guestName || !phone || !nationality || !email) {
    return res.status(400).json({ error: "Missing required booking fields." });
  }
  if (new Date(checkOut) <= new Date(checkIn)) {
    return res.status(400).json({ error: "Check-out must be after check-in." });
  }

  const room = await Room.findByPk(roomId);
  if (!room || room.status !== "active") {
    return res.status(404).json({ error: "Room not available." });
  }

  const partySize = (Number(adults) || 1) + (Number(children) || 0);
  if (partySize > room.capacity) {
    return res.status(400).json({ error: `This room sleeps up to ${room.capacity}.` });
  }

  // Re-check availability server-side to prevent double-booking races
  const clash = await Booking.findOne({
    where: { roomId, status: { [Op.ne]: "cancelled" }, ...overlapWhere(checkIn, checkOut) },
  });
  if (clash) return res.status(409).json({ error: "This room was just booked for those dates. Please pick another." });

  const closureClash = await Closure.findOne({
    where: { roomId, ...overlapWhere(checkIn, checkOut, "startDate", "endDate") },
  });
  if (closureClash) return res.status(409).json({ error: "This room is closed for those dates." });

  const nights = nightsBetween(checkIn, checkOut);
  let confirmationCode = genConfirmationCode();
  // extremely unlikely collision, but guard anyway
  while (await Booking.findOne({ where: { confirmationCode } })) {
    confirmationCode = genConfirmationCode();
  }

  const booking = await Booking.create({
    confirmationCode,
    roomId,
    guestName,
    phone,
    nationality,
    email,
    adults: Number(adults) || 1,
    children: Number(children) || 0,
    specialRequests: specialRequests || "",
    arrivalTime: arrivalTime || null,
    checkIn,
    checkOut,
    pricePerNight: room.price,
    total: Number(room.price) * nights,
    status: "confirmed",
  });

  res.status(201).json({ ...booking.toJSON(), roomNumber: room.number, roomType: room.type });
}

// PATCH /api/bookings/:id/status (protected)
async function updateBookingStatus(req, res) {
  const { status } = req.body;
  const allowed = ["confirmed", "checked-in", "checked-out", "cancelled"];
  if (!allowed.includes(status)) return res.status(400).json({ error: "Invalid status." });

  const booking = await Booking.findByPk(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found." });

  booking.status = status;
  await booking.save();
  res.json(booking);
}

module.exports = { listBookings, lookupBooking, createBooking, updateBookingStatus };
