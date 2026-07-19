const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Closure = sequelize.define("Closure", {
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
});

module.exports = Closure;
