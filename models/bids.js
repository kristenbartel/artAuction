'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bids extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Bids.belongsTo(models.Users, {
        foreignKey: 'userID',
        onDelete: 'CASCADE'
      });
        Bids.belongsTo(models.Artwork, {
        foreignKey: 'artID',
        onDelete: 'CASCADE'
      });
    }
  }
  Bids.init({
    bidAmount: DataTypes.INTEGER,
    userID: DataTypes.INTEGER,
    artID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Bids',
  });
  return Bids;
};