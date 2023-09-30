'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        password: passwordHash,
        name: 'Admin User',
        address: 'Admin Address',
        phone: '1234567890',
        nik: '1234567890',
        roleId: 2, // ID 2 mengacu pada peran 'Admin' dalam tabel Roles
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
