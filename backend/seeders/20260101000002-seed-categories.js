'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const categories = [
      {
        name: 'Pocket WiFi',
        slug: 'pocket-wifi',
        description: 'Unlimited global portable WiFi routers for multi-device travel connectivity.'
      },
      {
        name: 'eSIM',
        slug: 'esim',
        description: 'Instant digital eSIM data plans activated via QR code without physical SIM swap.'
      },
      {
        name: 'SIM Card',
        slug: 'sim-card',
        description: 'Prepaid physical travel SIM cards ready for airport pickup or delivery.'
      }
    ].map((item) => ({ ...item, is_active: true, created_at: now, updated_at: now }));

    await queryInterface.bulkInsert('categories', categories, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
