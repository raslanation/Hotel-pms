const { Op } = require("sequelize");
const { Room, Booking, Closure } = require("../models");
const { overlapWhere } = require("../utils/helpers");

// GET /api/rooms - all rooms (used by both guest search and admin screens)
async function listRooms(req, res) {
  const rooms = await Room.findAll({ order: [["number", "ASC"]] });
  res.json(rooms);
}

// GET /api/rooms/available?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&guests=2
async function listAvailableRooms(req, res) {
  const { checkIn, checkOut, guests } = req.query;
  if (!checkIn || !checkOut) {
    return res.status(400).json({ error: "checkIn and checkOut are required." });
  }
  const guestCount = Number(guests) || 1;

  const rooms = await Room.findAll({
    where: { status: "active", capacity: { [Op.gte]: guestCount } },
    order: [["number", "ASC"]],
  });

  const clashingBookings = await Booking.findAll({
    where: {
      status: { [Op.ne]: "cancelled" },
      ...overlapWhere(checkIn, checkOut),
    },
    attributes: ["roomId"],
  });
  const clashingClosures = await Closure.findAll({
    where: overlapWhere(checkIn, checkOut, "startDate", "endDate"),
    attributes: ["roomId"],
  });

  const blockedRoomIds = new Set([
    ...clashingBookings.map((b) => b.roomId),
    ...clashingClosures.map((c) => c.roomId),
  ]);

  const available = rooms.filter((r) => !blockedRoomIds.has(r.id));
  res.json(available);
}

// PATCH /api/rooms/:id  (protected)
async function updateRoom(req, res) {
  const room = await Room.findByPk(req.params.id);
  if (!room) return res.status(404).json({ error: "Room not found." });

  const { price, status } = req.body;
  if (price !== undefined) room.price = price;
  if (status !== undefined) room.status = status;
  await room.save();
  res.json(room);
}

// POST /api/rooms  (protected) - add a new room to inventory
async function createRoom(req, res) {
  const { number, floor, type, bed, size, capacity, price, amenities } = req.body;
  if (!number || !floor || !type || !capacity || !price) {
    return res.status(400).json({ error: "number, floor, type, capacity and price are required." });
  }
  const room = await Room.create({
    number, floor, type, bed: bed || "", size: size || 0, capacity, price,
    amenities: amenities || [], status: "active",
  });
  res.status(201).json(room);
}

module.exports = { listRooms, listAvailableRooms, updateRoom, createRoom };
