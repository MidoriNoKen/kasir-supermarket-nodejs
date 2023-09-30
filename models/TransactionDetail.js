const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Transaction = require('./Transaction');
const Product = require('./Product');

class TransactionDetail extends Model { }

TransactionDetail.init(
  {
    transactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TransactionDetail',
  }
);

TransactionDetail.belongsTo(Transaction, {
  foreignKey: 'transactionId', // Ubah menjadi 'transactionId'
  as: 'transaction',
});

TransactionDetail.belongsTo(Product, {
  foreignKey: 'productId', // Ubah menjadi 'productId'
  as: 'product',
});

module.exports = TransactionDetail;
