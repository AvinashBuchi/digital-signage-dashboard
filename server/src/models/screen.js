const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Screen = sequelize.define(
  "Screen",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("online", "offline"),
      allowNull: false,
      defaultValue: "offline",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    scheduledMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    scheduledTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastUpdated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "screens",
    timestamps: false,
  }
);

module.exports = Screen;
