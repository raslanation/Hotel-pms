const { Op } = require("sequelize");
const { Booking, Room } = require("../models");

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function getStats(req, res) {
  const today = todayISO();

  const activeBookings = await Booking.findAll({ where: { status: { [Op.ne]: "cancelled" } } });
  const inHouse = activeBookings.filter((b) => b.checkIn <= today && b.checkOut > today);
  const arrivals = activeBookings.filter((b) => b.checkIn === today);
  const revenue = activeBookings.reduce((sum, b) => sum + Number(b.total), 0);

  const activeRoomCount = await Room.count({ where: { status: "active" } });
  const occupancy = activeRoomCount > 0 ? Math.round((inHouse.length / activeRoomCount) * 100) : 0;

  res.json({
    inHouseTonight: inHouse.length,
    arrivingToday: arrivals.length,
    occupancy,
    revenue,
  });
}

module.exports = { getStats };
