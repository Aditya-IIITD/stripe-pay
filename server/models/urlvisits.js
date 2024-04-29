module.exports = (sequelize, DataTypes) => {
  const urlvisits = sequelize.define("urlvisits", {
    visit_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "urls", // name of the target model
        key: "url_id", // key in the target model that we're referencing
      },
    },
    referrer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    browser: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    device: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return urlvisits;
};
