'use strict';
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Transaction, {
        foreignKey: 'user_id'
      })
      // this.hasOne(models.Role, {
      //   foreignKey: 'role_id'
      // })
    }
  }
  User.init({
    name: DataTypes.STRING,
    nik: DataTypes.STRING,
    password: DataTypes.STRING,
    role_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true,
    hooks: {
      beforeCreate: (user, options) => {
        user.password = bcrypt.hashSync(user.password, salt);
        return user
      }
    }
  });
  return User;
};