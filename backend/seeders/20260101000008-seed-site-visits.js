'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up() {
    // Intentionally left empty so site visits start from 0
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('site_visits', null, {});
  }
};
