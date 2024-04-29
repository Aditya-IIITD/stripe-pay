const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const urls = sequelize.define("urls", {
    url_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    original_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    short_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Assuming short_code is unique
    },
  });

  return urls;
};
