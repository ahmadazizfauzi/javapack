'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('password', 10);
    const now = new Date();

    await queryInterface.bulkInsert('users', [
      {
        name: 'Ahmad Aziz Fauzi',
        email: 'admin@gmail.com',
        password: hashedPassword,
        phone: '085216373763',
        role: 'admin',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Ahmad Aziz Fauzi',
        email: 'ahmad@gmail.com',
        password: hashedPassword,
        phone: '085216373764',
        role: 'customer',
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: ['admin@gmail.com', 'ahmad@gmail.com'] }, {});
  }
};
