const { Op } = require("sequelize");

// True if [aStart, aEnd) overlaps [bStart, bEnd) - checkout day itself doesn't count as occupied
function overlaps(aStart, aEnd, bStart, bEnd) {
  return new Date(aStart) < new Date(bEnd) && new Date(bStart) < new Date(aEnd);
}

function nightsBetween(a, b) {
  const ms = new Date(b) - new Date(a);
  return Math.max(0, Math.round(ms / 86400000));
}

function genConfirmationCode() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  let s = "GGR-";
  for (let i = 0; i < 3; i++) s += letters[Math.floor(Math.random() * letters.length)];
  s += "-" + Math.floor(1000 + Math.random() * 9000);
  return s;
}

// Sequelize where-clause fragment for "this row's date range overlaps [checkIn, checkOut)"
function overlapWhere(checkIn, checkOut, startField = "checkIn", endField = "checkOut") {
  return {
    [startField]: { [Op.lt]: checkOut },
    [endField]: { [Op.gt]: checkIn },
  };
}

module.exports = { overlaps, nightsBetween, genConfirmationCode, overlapWhere };
