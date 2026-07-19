const { Closure, Room } = require("../models");

async function listClosures(req, res) {
  const closures = await Closure.findAll({
    include: [{ model: Room, attributes: ["number", "type"] }],
    order: [["startDate", "ASC"]],
  });
  res.json(closures);
}

async function createClosure(req, res) {
  const { roomId, startDate, endDate, reason } = req.body;
  if (!roomId || !startDate || !endDate) {
    return res.status(400).json({ error: "roomId, startDate and endDate are required." });
  }
  if (new Date(endDate) <= new Date(startDate)) {
    return res.status(400).json({ error: "endDate must be after startDate." });
  }
  const room = await Room.findByPk(roomId);
  if (!room) return res.status(404).json({ error: "Room not found." });

  const closure = await Closure.create({ roomId, startDate, endDate, reason: reason || "" });
  res.status(201).json({ ...closure.toJSON(), roomNumber: room.number });
}

async function removeClosure(req, res) {
  const closure = await Closure.findByPk(req.params.id);
  if (!closure) return res.status(404).json({ error: "Closure not found." });
  await closure.destroy();
  res.json({ deleted: true });
}

module.exports = { listClosures, createClosure, removeClosure };
