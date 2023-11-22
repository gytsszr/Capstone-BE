'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      batchs.hasMany(models.batchs, {
        foreignKey: 'batchId',
        as: 'batchId',
      });
      batchs.hasMany(models.applyments, {
        foreignKey: 'Id',
        as: 'batchId',
      });
    }
  }
  users.init({
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true
  },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING,
    resume: DataTypes.STRING,
    profile: DataTypes.STRING,
    isCostumer: DataTypes.BOOLEAN,
    isAdmin: DataTypes.BOOLEAN,
    status: DataTypes.BOOLEAN,
    job: DataTypes.STRING,
    sex: DataTypes.ENUM,
    address: DataTypes.STRING,
    website: DataTypes.STRING,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};