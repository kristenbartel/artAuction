'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artworks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Artworks.init({
    artTitle: DataTypes.STRING,
    artDetails: DataTypes.STRING,
    artImage: DataTypes.STRING,
    startingAmount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Artworks',
  });
  return Artworks;
};