'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Cart, {
        foreignKey: 'cart_id'
      })
      this.belongsTo(models.Product, {
        foreignKey: 'product_id'
      })
    }
  }
  CartItem.init({
    cart_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    status: DataTypes.ENUM('waiting','preparing','served')
  }, {
    sequelize,
    modelName: 'CartItem',
    paranoid: true
  });
  return CartItem;
};