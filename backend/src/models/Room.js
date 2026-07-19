const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Room = sequelize.define("Room", {
  number: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
  },
  floor: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  bed: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER, // square feet
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  amenities: {
    // stored as JSON array of strings, e.g. ["Wifi","Balcony","Sea view"]
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM("active", "out-of-service"),
    allowNull: false,
    defaultValue: "active",
  },
});

module.exports = Room;
