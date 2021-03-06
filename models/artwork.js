'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artwork extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Artwork.init({
    artTitle: DataTypes.STRING,
    artArtist: DataTypes.STRING,
    artYear: DataTypes.STRING,
    artDetails: DataTypes.STRING,
    artImage: DataTypes.STRING,
    startingAmount: DataTypes.INTEGER,
    maxBid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Artwork',
  });
  return Artwork;
};