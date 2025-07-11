'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.CartItem, {
        foreignKey: 'cart_id'
      })
      this.hasMany(models.Transaction, {
        foreignKey: 'cart_id'
      })
    }
  }
  Cart.init({
    no_table: DataTypes.INTEGER,
    status: DataTypes.ENUM('ongoing', 'end')
  }, {
    sequelize,
    modelName: 'Cart',
    paranoid: true
  });
  return Cart;
};