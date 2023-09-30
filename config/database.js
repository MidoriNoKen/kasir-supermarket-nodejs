const Sequelize = require('sequelize');

const sequelize = new Sequelize('kasir_sm', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
