'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class applyments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      applyments.belongsTo(models.users, {
        foreignKey: 'userId',
        as: 'userId',
        onDelete: 'CASCADE',
      });
      applyments.belongsTo(models.batchs, {
        foreignKey: 'batchId',
        as: 'batchId',
        onDelete: 'CASCADE',
      });
    }
  }
  applyments.init({
    applyId: {
      type: DataTypes.INTEGER,
      primaryKey: true
  },
    userId: DataTypes.INTEGER,
    batchId: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'applyments',
  });
  return applyments;
};