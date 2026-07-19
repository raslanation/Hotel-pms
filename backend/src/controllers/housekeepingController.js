const { Housekeeping, Room } = require("../models");

async function listHousekeeping(req, res) {
  const entries = await Housekeeping.findAll({
    include: [{ model: Room, attributes: ["number", "type"] }],
    order: [["cleanedAt", "DESC"]],
  });
  res.json(entries);
}

async function logCleaning(req, res) {
  const { roomId, cleanedBy, cleanedAt, notes } = req.body;
  if (!roomId || !cleanedBy || !cleanedAt) {
    return res.status(400).json({ error: "roomId, cleanedBy and cleanedAt are required." });
  }
  const room = await Room.findByPk(roomId);
  if (!room) return res.status(404).json({ error: "Room not found." });

  const entry = await Housekeeping.create({ roomId, cleanedBy, cleanedAt, notes: notes || "" });
  res.status(201).json({ ...entry.toJSON(), roomNumber: room.number, roomType: room.type });
}

async function removeCleaning(req, res) {
  const entry = await Housekeeping.findByPk(req.params.id);
  if (!entry) return res.status(404).json({ error: "Entry not found." });
  await entry.destroy();
  res.json({ deleted: true });
}

module.exports = { listHousekeeping, logCleaning, removeCleaning };
