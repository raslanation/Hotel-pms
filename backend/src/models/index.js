const sequelize = require("../config/db");
const Room = require("./Room");
const Booking = require("./Booking");
const Closure = require("./Closure");
const Housekeeping = require("./Housekeeping");
const User = require("./User");

Room.hasMany(Booking, { foreignKey: "roomId", onDelete: "CASCADE" });
Booking.belongsTo(Room, { foreignKey: "roomId" });

Room.hasMany(Closure, { foreignKey: "roomId", onDelete: "CASCADE" });
Closure.belongsTo(Room, { foreignKey: "roomId" });

Room.hasMany(Housekeeping, { foreignKey: "roomId", onDelete: "CASCADE" });
Housekeeping.belongsTo(Room, { foreignKey: "roomId" });

module.exports = { sequelize, Room, Booking, Closure, Housekeeping, User };
