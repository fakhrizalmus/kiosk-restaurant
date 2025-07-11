'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Cart, {
        foreignKey: 'cart_id'
      })
    }
  }
  Transaction.init({
    cart_id: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    status: DataTypes.STRING,
    paid_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Transaction',
    paranoid: true
  });
  return Transaction;
};