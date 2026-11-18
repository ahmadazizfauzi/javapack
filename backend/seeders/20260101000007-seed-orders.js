'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up() {
    // Intentionally left empty per project seed specification
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('orders', null, {});
  }
};
