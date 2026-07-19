const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Booking = sequelize.define("Booking", {
  confirmationCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  guestName: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  nationality: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  adults: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  children: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  arrivalTime: {
    type: DataTypes.STRING(5), // "HH:MM"
    allowNull: true,
  },
  checkIn: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  checkOut: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  pricePerNight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("confirmed", "checked-in", "checked-out", "cancelled"),
    allowNull: false,
    defaultValue: "confirmed",
  },
});

module.exports = Booking;
