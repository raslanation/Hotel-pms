const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Housekeeping = sequelize.define("Housekeeping", {
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cleanedBy: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
  cleanedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Housekeeping;
