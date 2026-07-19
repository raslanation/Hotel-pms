const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING(60),
    allowNull: false,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "staff"),
    allowNull: false,
    defaultValue: "staff",
  },
});

module.exports = User;
