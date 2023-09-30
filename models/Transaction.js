const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Transaction extends Model { }

Transaction.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Transaction',
  }
);

Transaction.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

module.exports = Transaction;
