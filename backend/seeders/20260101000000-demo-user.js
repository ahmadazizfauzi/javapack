'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('password', 10);
    const now = new Date();

    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin Operational',
        email: 'admin@gmail.com',
        password: hashedPassword,
        phone: '089630637034',
        role: 'admin',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Petugas Konter Bandara',
        email: 'petugas@gmail.com',
        password: hashedPassword,
        phone: '081234567890',
        role: 'admin',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Ahmad Aziz Fauzi',
        email: 'ahmad@gmail.com',
        password: hashedPassword,
        phone: '085216373763',
        role: 'customer',
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: ['admin@gmail.com', 'petugas@gmail.com', 'ahmad@gmail.com'] }, {});
  }
};
